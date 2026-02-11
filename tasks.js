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

/* 🔥 AUTO SEED TASKS */
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

  const user = auth.currentUser;
  if (!user) return;

  const tasksSnap = await get(ref(db, "tasks"));
  const userSnap = await get(ref(db, "users/" + user.uid));

  const completed = userSnap.exists() && userSnap.val().completedTasks
    ? userSnap.val().completedTasks
    : {};

  tasksContainer.innerHTML = "";

  tasksSnap.forEach(child => {
    const task = child.val();
    if (!task.active) return;

    const taskId = child.key;
    const alreadyDone = completed && completed[taskId];

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
        border:none;
        border-radius:6px;
        color:#fff;
        cursor:pointer;
      ">
      </button>
    `;

    const btn = div.querySelector("button");

    if (alreadyDone) {
      btn.innerText = "✔ Already Completed";
      btn.style.background = "#16a34a";
      btn.disabled = true;
    } else {
      btn.innerText = "Complete Task";
      btn.style.background = "#22c55e";
      btn.onclick = () => completeTask(taskId, task.reward, btn);
    }

    tasksContainer.appendChild(div);
  });
}

/* 💰 COMPLETE TASK */
async function completeTask(taskId, reward, btn) {
  const user = auth.currentUser;
  if (!user) return;

  btn.disabled = true;
  btn.innerText = "Processing...";
  btn.style.background = "#999";

  const userRef = ref(db, "users/" + user.uid);
  const snap = await get(userRef);

  let balance = 0;
  let completedTasks = {};

  if (snap.exists()) {
    balance = snap.val().balance || 0;
    completedTasks = snap.val().completedTasks || {};
  }

  if (completedTasks[taskId]) {
    btn.innerText = "✔ Already Completed";
    btn.style.background = "#16a34a";
    return;
  }

  completedTasks[taskId] = true;

  await update(userRef, {
    balance: balance + reward,
    completedTasks: completedTasks
  });

  btn.innerText = "✔ Completed";
  btn.style.background = "#16a34a";

  showCoinPopup(reward);

  setTimeout(() => {
    location.reload();
  }, 1200);
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

auth.onAuthStateChanged(user => {
  if (user) loadTasks();
});
