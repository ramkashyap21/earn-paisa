import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getDatabase, 
  ref, 
  get, 
  set, 
  update 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBc_f9XBgUi3HMpFQU40fWJdzxscfV826s",
  authDomain: "paisaeran-43a70.firebaseapp.com",
  databaseURL: "https://paisaeran-43a70-default-rtdb.firebaseio.com",
  projectId: "paisaeran-43a70"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const tasksContainer = document.getElementById("tasks");

/* 🔥 AUTO SEED */
async function seedTasksIfEmpty() {
  const snap = await get(ref(db, "tasks"));
  if (!snap.exists()) {
    await set(ref(db, "tasks"), {
      task1: { title: "Visit Website", reward: 10, active: true },
      task2: { title: "Download App", reward: 20, active: true },
      task3: { title: "Watch Video", reward: 5, active: true }
    });
  }
}

/* 📊 LOAD TASKS */
async function loadTasks() {
  await seedTasksIfEmpty();

  const snap = await get(ref(db, "tasks"));
  if (!snap.exists()) {
    tasksContainer.innerHTML = "No Tasks Available";
    return;
  }

  tasksContainer.innerHTML = "";

  snap.forEach(child => {
    const task = child.val();
    if (!task.active) return;

    const div = document.createElement("div");
    div.style.margin = "15px 0";
    div.style.padding = "15px";
    div.style.background = "#f9fafb";
    div.style.borderRadius = "10px";
    div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";

    div.innerHTML = `
      <p style="font-weight:bold">${task.title}</p>
      <p>Reward: ₹${task.reward}</p>
      <button style="
        padding:10px 18px;
        background:#22c55e;
        border:none;
        color:#fff;
        border-radius:6px;
        cursor:pointer;
        transition:0.3s;
      ">Complete Task</button>
    `;

    const btn = div.querySelector("button");

    btn.onclick = () => completeTask(child.key, task.reward, btn);

    tasksContainer.appendChild(div);
  });
}

/* 💰 COMPLETE TASK WITH ANIMATION */
async function completeTask(taskId, reward, btn) {
  const user = auth.currentUser;
  if (!user) return alert("Login required");

  btn.disabled = true;
  btn.innerText = "Processing...";
  btn.style.background = "#999";

  const userRef = ref(db, "users/" + user.uid);
  const snap = await get(userRef);
  let balance = 0;

  if (snap.exists()) {
    balance = snap.val().balance || 0;
  }

  await update(userRef, {
    balance: balance + reward
  });

  // 🎉 SUCCESS ANIMATION
  btn.innerText = "✔ Completed";
  btn.style.background = "#16a34a";

  showCoinPopup(reward);

  setTimeout(() => {
    location.reload();
  }, 1500);
}

/* 🪙 COIN POPUP */
function showCoinPopup(amount) {
  const popup = document.createElement("div");
  popup.innerText = "🪙 +₹" + amount;
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%,-50%) scale(0)";
  popup.style.background = "#22c55e";
  popup.style.color = "#fff";
  popup.style.padding = "20px 40px";
  popup.style.borderRadius = "15px";
  popup.style.fontSize = "22px";
  popup.style.fontWeight = "bold";
  popup.style.transition = "0.4s";
  popup.style.zIndex = "9999";

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.style.transform = "translate(-50%,-50%) scale(1)";
  }, 50);

  setTimeout(() => {
    popup.remove();
  }, 1200);
}

loadTasks();
