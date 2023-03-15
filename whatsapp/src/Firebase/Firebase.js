//#region imports

//#region firebase
import firebase from 'firebase';
//#endregion

//#endregion

const firebaseConfig = {
  apiKey: "AIzaSyDPzi950yZdpuJ6AA6CKABdlcaB7N_13qA",
  authDomain: "whatsapp-a94ba.firebaseapp.com",
  projectId: "whatsapp-a94ba",
  storageBucket: "whatsapp-a94ba.appspot.com",
  messagingSenderId: "19604131393",
  appId: "1:19604131393:web:dbe80e011626e01d7900c0",
  measurementId: "G-BX6TCM9GN4"
};

const app = firebase.initializeApp(firebaseConfig);

const auth = app.auth();

const db = app.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();

export { auth, googleProvider };
export default db;

