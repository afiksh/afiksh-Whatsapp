//#region imports

//#region components
import ChatContainer from '../ChatContainer/ChatContainer';
import Sidebar from '../Sidebar/Sidebar';
//#endregion

import './ChatPage.css';
//#endregion

const ChatPage = ({ currentUser, signOut }) => {

    return (
        <div className='chatpage'>
            <div className='chatpage-container'>
                <Sidebar currentUser={currentUser} signOut={signOut} />
                <ChatContainer currentUser={currentUser} />
            </div>
        </div>
    )
}

export default ChatPage
