//#region imports

//#region hooks
import { useNavigate } from 'react-router-dom';
//#endregion

import './UserProfile.css';
//#endregion

const UserProfile = ({ name, photoUrl, email, lastMessage }) => {

    //#region variables
    
    //#region hooks
    
    //#region useNavigate

    const Navigate = useNavigate();

    //#endregion

    //#endregion
    
    //#endregion

    //#region functions

    //#region arrow functions

    const goToUser = () => {
        if (email) {
            Navigate(`/${email}`);
        }
    }

    //#endregion

    //#endregion
    
    return (
        <div className='user-profile' onClick={goToUser}>
            <div className='user-image'>
                <img src={photoUrl} alt='user profile photo' />
            </div>
            <div className='user-info'>
                <p className='user-name'>
                    {name}
                </p>
                {lastMessage &&
                    <p className='user-lastmessage'>
                        {lastMessage}
                    </p>
                }
            </div>
        </div>
    )
}

export default UserProfile
