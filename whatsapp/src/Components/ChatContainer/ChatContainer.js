//#region imports

//#region hooks
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
//#endregion

//#region icons and emojis
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import Picker from 'emoji-picker-react'
//#endregion

//#region firebase
import firebase from 'firebase';
import db from '../../Firebase/Firebase';
//#endregion

//#region components
import ChatMessage from '../ChatMessage/ChatMessage';
//#endregion

import './ChatContainer.css';
//#endregion

const ChatContainer = ({ currentUser }) => {

    //#region variables

    //#region hooks

    //#region useParams
    const { emailID } = useParams();
    //#endregion

    //#region useRef
    const chatBox = useRef(null);
    //#endregion

    //#region useState

    //^bool
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [isSended, setIsSended] = useState(false);

    //^number
    const [scrollWidth, setScrollWidth] = useState(0);

    //^string
    const [message, setMessage] = useState('');

    //^array
    const [chatMessages, setChatMessages] = useState([]);

    //^object
    const [chatUser, setChatUser] = useState({});
    const [isLongPress, setIsLongPress] = useState({ isLongPress: false, message: null });
    const [currentMessage, setCurrentMessage] = useState({ chatMessage: null, senderCurrentUser: null });

    //#endregion

    //#endregion

    //#endregion

    //#region functions

    //#region arrow functions

    const send = (e) => {
        setIsSended(true);
        e.preventDefault();
        if (emailID && message) {

            let payload = {
                id: uuid(),
                text: message,
                receiverEmail: emailID,
                senderEmail: currentUser.email,
                timeStamp: firebase.firestore.Timestamp.now()
            }

            const addFriendsToList = (user) => {
                return {
                    email: user.email,
                    fullName: user.fullName,
                    photoURL: user.photoURL,
                    lastMessage: message
                }
            }

            //#region messages

            const payloadSet = (isSender) => {
                const user = isSender ? currentUser.email : emailID;
                db.collection('chats')
                    .doc(user)
                    .collection('messages')
                    .doc(payload.id)
                    .set(payload);
            }

            //^sender
            payloadSet(true);
            //^reciver
            payloadSet(false)

            //#endregion

            //#region friendsList

            const friendsListSet = (isSender) => {
                const friend1 = isSender ? currentUser.email : emailID;
                const friend2 = isSender ? emailID : currentUser.email;
                const friendSet = isSender ? chatUser : currentUser;
                db.collection('friendsList')
                    .doc(friend1)
                    .collection('list')
                    .doc(friend2)
                    .set(addFriendsToList(friendSet));
            }

            //^sender
            friendsListSet(true);
            //^reciver
            friendsListSet(false);

            //#endregion

            setMessage('');
        }
    }

    const hugeImg = (e) => {
        const target = e.target;
        if (target.style.width === '500px') {
            target.style.width = '44px';
            target.style.position = 'static';
        } else {
            target.style.width = '500px';
            target.style.position = 'absolute';
        }
    }

    //#endregion

    //#endregion

    //#region useEffect

    useEffect(() => {
        const handleClickOutside = (e) => {
            e.preventDefault();
            if (e.target.id !== 'chat-input' && !e.target.closest('#chat-input') || e.target.closest('#chat-input-send-btn')) {
                setOpenEmojiPicker(false);
            }
        }

        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        }
    }, [])

    useEffect(() => {
        const getUser = async () => {
            await db.collection('users')
                .doc(emailID)
                .onSnapshot((snapshot) => {
                    setChatUser(snapshot.data());
                })
        }

        const getMessages = async () => {
            await db.collection('chats')
                .doc(emailID)
                .collection('messages')
                .orderBy('timeStamp', 'asc')
                .onSnapshot((snapshot) => {
                    let messages = snapshot.docs.map((doc) => doc.data());
                    let newMessage = messages.filter((message) =>
                        message.senderEmail === (currentUser.email || emailID)
                        ||
                        message.receiverEmail === (currentUser.email || emailID)
                    )
                    setChatMessages(newMessage);
                })
        }

        getUser();
        getMessages();
    }, [emailID])

    useEffect(() => {
        chatBox.current.addEventListener('DOMNodeInserted', (e) => {
            if (!isLongPress) {
                const { currentTarget: target } = e;
                target.scroll({ top: target.scrollHeight, behhavior: "smooth" });
            }
        });
    }, [chatMessages])

    useEffect(() => {
        const parentContainer = document.getElementsByClassName('chat-container')[0];
        const childContainer = document.getElementsByClassName('chat-display-container')[0];
        setScrollWidth(parentContainer.scrollWidth - childContainer.scrollWidth);
    }, [openEmojiPicker])

    //#endregion

    return (
        <div className='chat-container'>
            <div className='chat-container-header'>
                <div className='chat-user-info'>
                    <div className='chat-user-img'>
                        <img src={chatUser?.photoURL} alt='chat user photo' onClick={hugeImg} />
                    </div>
                    <div className='chat-user-info-name'>
                        <p>{chatUser?.fullName}</p>
                        <h6 id='info'>Tap here for more information</h6>
                    </div>
                </div>
                <div className='chat-container-header-btn'>
                    <MoreVertIcon />
                </div>
            </div>
            <div ref={chatBox} className='chat-display-container'>
                {chatMessages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                        isLongPress={isLongPress}
                        setIsLongPress={setIsLongPress}
                        currentMessage={currentMessage}
                        setCurrentMessage={setCurrentMessage}
                        isSended={isSended}
                        setIsSended={setIsSended} />
                ))}
            </div>
            <div id='chat-input' className='chat-input'>
                {openEmojiPicker && (
                    <Picker
                        width={`calc(100% - ${scrollWidth}px)`}
                        height="250px"
                        onEmojiClick={(emojiObj, event) => {
                            setMessage(message + emojiObj.emoji);
                        }} />
                )}
                <div className='chat-input-btn'>
                    <InsertEmoticonIcon onClick={() => { setOpenEmojiPicker(!openEmojiPicker) }} />
                    <AttachFileIcon />
                </div>
                <form onSubmit={send}>
                    <input type='text' placeholder='Type a message...' value={message} onChange={(e) => {
                        setMessage(e.target.value);
                    }} />
                </form>
                <div id='chat-input-send-btn' className='chat-input-send-btn' onClick={send}>
                    <SendIcon />
                </div>
            </div>
        </div>
    )
}

export default ChatContainer