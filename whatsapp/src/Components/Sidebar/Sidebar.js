//#region imports

//#region hooks
import { useEffect, useState } from 'react';
//#endregion

//#region icons and emojis
import TollIcon from '@mui/icons-material/Toll';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
//#endregion

//#region firebase
import db from '../../Firebase/Firebase';
//#endregion

//#region components
import UserProfile from '../UserProfile/UserProfile';
//#endregion

import './Sidebar.css';
//#endregion

const Sidebar = ({ currentUser, signOut }) => {

    //#region variables

    //#region hooks

    //#region useState

    //^string
    const [searchInput, setSearchInput] = useState('');

    //^array
    const [allUsers, setAllUsers] = useState([]);
    const [friendsList, setFriendsList] = useState([]);

    //#endregion

    //#endregion

    //#region regular variables

    const searchedUser = allUsers.filter((user) => {
        if (searchInput) {
            if (user.data().fullName.toLowerCase()
                .includes(searchInput.toLowerCase())) {
                return user;
            }
        }
    })

    const searchItem = searchedUser.map((user) => {
        return (
            <UserProfile
                name={user.data().fullName}
                photoUrl={user.data().photoURL}
                email={user.data().email}
                key={user.id} />
        )
    })

    //#endregion

    //#endregion

    //#region useEffect

    useEffect(() => {
        const getAllUsers = async () => {
            await db.collection('users')
                .onSnapshot((snapshot) => {
                    setAllUsers(snapshot.docs.filter((doc) =>
                        doc.data().email !== currentUser?.email
                    ));
                });
        }

        const getFriends = async () => {
            await db.collection('friendsList')
                .doc(currentUser.email)
                .collection('list')
                .onSnapshot((snapshot) => {
                    setFriendsList(snapshot.docs);
                });
        }

        getAllUsers();
        getFriends();
    }, [])

    //#endregion

    return (
        <div className='sidebar'>
            <div className='sidebar-header'>
                <div className='sidebar-header-img' onClick={signOut}>
                    <img src={currentUser?.photoURL} alt='current user photo' />
                </div>
                <div className='sidebar-header-btn'>
                    <TollIcon />
                    <InsertCommentIcon />
                    <MoreVertIcon />
                </div>
            </div>
            <div className='sidebar-search'>
                <div className='sidebar-search-input'>
                    <SearchIcon />
                    <input
                        name='search'
                        placeholder='Seacrh...'
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                </div>
            </div>
            <div className='sidebar-chat-list'>
                {searchItem.length > 0 ? (
                    searchItem
                ) : (
                    friendsList.map((friend) => (
                        <UserProfile
                            key={friend.data().email}
                            name={friend.data().fullName}
                            photoUrl={friend.data().photoURL}
                            email={friend.data().email}
                            lastMessage={friend.data().lastMessage} />
                    ))
                )}
            </div>
        </div>
    )
}

export default Sidebar
