//#region imports

//#region hooks
import { useNavigate } from 'react-router-dom';
//#endregion

//#region firebase
import db, { auth, googleProvider } from '../../Firebase/Firebase';
//#endregion

import './Login.css';
//#endregion

const Login = ({ setUser }) => {

    //#region variables

    //#region hooks

    //#region useNavigate

    const Navigate = useNavigate();

    //#endregion

    //#endregion

    //#endregion

    //#region functions

    //#region arrow functions

    const signinWithGoogle = () => {
        auth.signInWithPopup(googleProvider)
            .then((result) => {
                const newUser = {
                    fullName: result.user.displayName,
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                };
                Navigate('/');
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                db.collection('users').doc(result.user.email).set(newUser);
            })
            .catch((err) => { alert(err.message) });
    }

    //#endregion

    //#endregion

    return (
        <div className='login'>
            <div className='login-container'>
                <img className='login-logo' src='./images/whatsapp.png' alt='login logo' />
                <p className='login-name'></p>
                <button className='login-btn' onClick={signinWithGoogle}>
                    <img src='./images/google.png' alt='login with google' />
                    Login with google
                </button>
            </div>
        </div>
    )
}

export default Login
