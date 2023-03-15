//#region imports

//#region components
import Sidebar from '../Sidebar/Sidebar';
//#endregion

import './HomePage.css';
//#endregion

const HomePage = ({ currentUser, signOut }) => {
    
    return (
        <div className='homepage'>
            <div className='homepage-container'>
                <Sidebar currentUser={currentUser} signOut={signOut} />
                <div className='homepage-bg'>
                    <img src='./images/whatsapp.png' alt='current user photo' />
                </div>
            </div>
        </div>
    )
}

export default HomePage
