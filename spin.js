import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, update } 
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

const ONE_DAY = 24 * 60 * 60 * 1000;

window.spinNow = async function(){
  const user = auth.currentUser;
  if(!user) return alert("Login required");

  const userRef = ref(db,"users/"+user.uid);
  const snap = await get(userRef);

  let balance = 0;
  let lastSpin = 0;

  if(snap.exists()){
    balance = snap.val().balance || 0;
    lastSpin = snap.val().lastSpin || 0;
  }

  const now = Date.now();

  if(now - lastSpin < ONE_DAY){
    const remaining = ONE_DAY - (now - lastSpin);
    const hours = Math.floor(remaining/(1000*60*60));
    document.getElementById("spinStatus").innerText =
      "⏳ Try again in " + hours + " hours";
    return;
  }

  // 🎯 Random Reward
  const rewards = [2,5,10,15,20,50];
  const reward = rewards[Math.floor(Math.random()*rewards.length)];

  // 🎡 Animation
  const wheel = document.getElementById("spinWheel");
  const rotateDeg = 1440 + Math.floor(Math.random()*360);
  wheel.style.transform = "rotate("+rotateDeg+"deg)";

  setTimeout(async ()=>{
    await update(userRef,{
      balance: balance + reward,
      lastSpin: now
    });

    alert("🎉 You won ₹"+reward);
    location.reload();
  },4000);
};
