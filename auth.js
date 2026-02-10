import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBc_f9XBgUi3HMpFQU40fWJdzxscfV826s",
  authDomain: "paisaeran-43a70.firebaseapp.com",
  databaseURL: "https://paisaeran-43a70-default-rtdb.firebaseio.com",
  projectId: "paisaeran-43a70",
  storageBucket: "paisaeran-43a70.firebasestorage.app",
  messagingSenderId: "856454531468",
  appId: "1:856454531468:web:92ab5b407f2def2cb7aea9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.signup = function(){
  const email = email.value;
  const password = password.value;

  createUserWithEmailAndPassword(auth,email,password)
  .then(()=>{
    location.href="index.html";
  })
  .catch(err=>msg.innerText=err.message);
}

window.login = function(){
  signInWithEmailAndPassword(auth,email.value,password.value)
  .then(()=>{
    location.href="index.html";
  })
  .catch(err=>msg.innerText=err.message);
}

window.logout = function(){
  signOut(auth);
}

onAuthStateChanged(auth,(user)=>{
  if(user && location.pathname.includes("login")){
    location.href="index.html";
  }
});
