//#region imports

//#region hooks
import { useEffect, useRef, useState } from 'react';
import { useLongPress } from 'use-long-press';
//#endregion

//#region firebase
import db, { auth } from '../../Firebase/Firebase';
//#endregion

import './ChatMessage.css';
//#endregion

const ChatMessage = ({ message, isLongPress, setIsLongPress, currentMessage, setCurrentMessage, isSended, setIsSended }) => {

    //#region variables

    //#region hooks

    //#region useRef

    const chatMessage = useRef(null);
    const longpressList = useRef(null);

    //#endregion

    //#region useState

    //^bool
    const [isOnlyClick, setIsOnlyClick] = useState(true);

    //#endregion

    //#endregion

    //#region regular variables

    //^string
    const chatMessageBackground =
        message.senderEmail === auth.currentUser?.email ?
            'var(--color-dcf8c6-white)'
            :
            'var(--color-fff-white)';

    //^array
    const liList = [
        { name: 'Message info', click: () => { } },
        { name: 'Reply', click: () => { } },
        { name: 'React to message', click: () => { } },
        { name: 'Forward message', click: () => { } },
        { name: 'Star message', click: () => { } },
        { name: 'Delete message', click: (e) => deleteMessage(e) }
    ];

    //^object
    const chatMessageStyle = {
        alignSelf: message.senderEmail === auth.currentUser?.email ? 'flex-end' : 'flex-start',
        backgroundColor: chatMessageBackground
    }

    //#endregion

    //#endregion

    if (isLongPress.isLongPress && isLongPress.message !== message) {
        chatMessage.current.style.backgroundColor = chatMessageBackground;
    }

    //#region functions

    //#region arrow functions

    const deleteMessage = async (e) => {
        e.preventDefault();
        if (currentMessage.chatMessage) {
            setCurrentMessage({ chatMessage: null, senderCurrentUser: null });
            await db.collection('chats')
                .doc(message.senderEmail)
                .collection('messages')
                .orderBy('timeStamp', 'asc')
                .onSnapshot((snapshot) => {
                    if (isSended) {
                        return;
                    }
                    const docs = snapshot.docs;
                    const messgaeId = docs.find(doc => doc.data().id === message.id)?.id;
                    let lastMessage = docs[docs.length - 1].data();
                    if (lastMessage.id === messgaeId) {

                        const updateLastMsg = (isSender) => {
                            const friend1 = isSender ? message.senderEmail : message.receiverEmail;
                            const friend2 = isSender ? message.receiverEmail : message.senderEmail;
                            return db.collection('friendsList')
                                .doc(friend1)
                                .collection('list')
                                .doc(friend2)
                                .onSnapshot((snapshotFriends) => {
                                    if (!snapshotFriends.metadata.fromCache && snapshotFriends.metadata.hasPendingWrites) {
                                        return;
                                    }
                                    lastMessage = docs.length > 1 ? docs[docs.length - 2].data().text : null;
                                    updateLastMsg(isSender)
                                        .update({ lastMessage: lastMessage });
                                })
                        }

                        //^sender
                        updateLastMsg(true);
                        //^receiver
                        updateLastMsg(false);
                    }

                    const deleteMsgDoc = (isSender) => {
                        const user = isSender ? message.senderEmail : message.receiverEmail;
                        db.collection('chats')
                            .doc(user)
                            .collection('messages')
                            .doc(messgaeId)
                            .delete().then(() => {
                                console.log("Message successfully deleted!");
                            }).catch(function (error) {
                                console.error("Error removing document: ", error);
                            });
                    }

                    //^sender
                    deleteMsgDoc(true);
                    //^receiver
                    deleteMsgDoc(false);
                })
        }
    }

    const longPress = useLongPress((e) => {
        e.preventDefault();
        chatMessage.current.style.backgroundColor = '#88c4f4';
        setIsLongPress({ isLongPress: true, message: message });
        setIsOnlyClick(false);
        setCurrentMessage({ chatMessage: chatMessage, senderCurrentUser: message.senderEmail === auth.currentUser?.email });
        setIsSended(false);
    });

    const click = (e) => {
        e.preventDefault();
        if (isOnlyClick) {
            setIsLongPress({ isLongPress: false, message: message });
            chatMessage.current.style.backgroundColor = chatMessageBackground;
            if (currentMessage.chatMessage !== chatMessage) {
                currentMessage.chatMessage.current.style.backgroundColor =
                    currentMessage.senderCurrentUser ?
                        'var(--color-dcf8c6-white)'
                        :
                        'var(--color-fff-white)'
            }
        }
        setIsOnlyClick(true);
    }

    //#endregion

    //#endregion

    //#region useEffect

    useEffect(() => {
        if (longpressList.current) {
            const margin = `calc(100% - ${longpressList.current.clientWidth}px)`;
            if (message.senderEmail === auth.currentUser?.email) {
                longpressList.current.style.marginLeft = margin;
            } else {
                longpressList.current.style.marginRight = margin;
            }
        }
    }, [isLongPress]);

    useEffect(() => {
        const clickHandler = (e) => {
            e.preventDefault();
            if (chatMessage.current !== e.target && !chatMessage.current.contains(e.target) && longpressList.current) {
                click(e);
            }
        }

        document.body.addEventListener('click', clickHandler);
        return () => {
            document.body.removeEventListener('click', clickHandler);
        }
    }, [])

    //#endregion

    return (
        <>
            <div ref={chatMessage} className='chat-message' style={chatMessageStyle} onClick={click} {...longPress()}>
                <div>
                    <div className='chat-message-text'>
                        <p>{message.text}</p>
                    </div>
                    <div className='chat-message-date'>
                        <p>{new Date(message.timeStamp.toDate()).toLocaleString()}</p>
                    </div>
                    {isLongPress.isLongPress &&
                        isLongPress.message === message && (
                            <div id='longpressList' ref={longpressList} className="longpress-list" tabIndex="-1" role="application">
                                <ul>
                                    <div>
                                        {liList.map((item, index) => (
                                            <li key={index} className="longpress-list-item" tabIndex="0" onClick={item.click}>
                                                <div className="longpress-list-text" role="button" aria-label={item.name}>
                                                    {item.name}
                                                </div>
                                            </li>
                                        ))}
                                    </div>
                                </ul>
                            </div>
                        )}
                </ div>
            </div>
        </>
    )
}

export default ChatMessage