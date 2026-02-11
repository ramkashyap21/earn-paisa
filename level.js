import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBc_f9XBgUi3HMpFQU40fWJdzxscfV826s",
  authDomain: "paisaeran-43a70.firebaseapp.com",
  databaseURL: "https://paisaeran-43a70-default-rtdb.firebaseio.com",
  projectId: "paisaeran-43a70"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

function calculateLevel(balance){
  if(balance >= 1500) return {level:5,badge:"👑 King"};
  if(balance >= 700) return {level:4,badge:"💎 Diamond"};
  if(balance >= 300) return {level:3,badge:"🥇 Gold"};
  if(balance >= 100) return {level:2,badge:"🥈 Silver"};
  return {level:1,badge:"🥉 Beginner"};
}

onAuthStateChanged(auth, async(user)=>{
  if(!user) return;

  const snap = await get(ref(db,"users/"+user.uid));
  if(!snap.exists()) return;

  const balance = snap.val().balance || 0;
  const result = calculateLevel(balance);

  document.getElementById("userLevel").innerText =
    "Level " + result.level;

  document.getElementById("userBadge").innerText =
    result.badge;
});
