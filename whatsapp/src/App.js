//#region imports

//#region hooks
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//#endregion

//#region firebase
import { auth } from './Firebase/Firebase';
//#endregion

//#region components
import ChatPage from './Components/ChatPage/ChatPage';
import HomePage from './Components/HomePage/HomePage';
import Login from './Components/Login/Login';
//#endregion

import './App.css';
//#endregion

const App = () => {

  //#region variabels

  //#region hooks

  //#region useState

  //^object
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  //#endregion

  //#endregion

  //#endregion

  //#region functions

  //#region  arrow functions

  const signOut = () => {
    auth.signOut()
      .then(() => {
        setUser(null);
        localStorage.removeItem('user');
      })
      .catch(err => { alert(err) });
  }

  //#endregion

  //#endregion

  return (
    <>
      <BrowserRouter>
        <div className="app">
          {user ? (
            <Routes>
              <Route path='/:emailID' element={<ChatPage currentUser={user} signOut={signOut} />} />
              <Route path='/' element={<HomePage currentUser={user} signOut={signOut} />} />
            </Routes>
          ) :
            (
              <Login setUser={setUser} />
            )
          }
        </div>
      </BrowserRouter>
    </>
  )
}

export default App;