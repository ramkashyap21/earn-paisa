import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getDatabase, 
  ref, 
  get, 
  set, 
  update 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

import { 
  getAuth, 
  onAuthStateChanged 
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
const db = getDatabase(app);
const auth = getAuth(app);

const taskBox = document.getElementById("tasks");

async function autoCreateTasks() {
  const snap = await get(ref(db, "tasks"));

  if (!snap.exists()) {
    await set(ref(db, "tasks"), {
      task1: {
        title: "Visit Website",
        reward: 10,
        active: true
      },
      task2: {
        title: "Download App",
        reward: 20,
        active: true
      },
      task3: {
        title: "Watch Video",
        reward: 5,
        active: true
      }
    });
  }
}

async function loadTasks(user) {
  await autoCreateTasks();

  const snap = await get(ref(db, "tasks"));

  taskBox.innerHTML = "";

  snap.forEach(child => {
    const task = child.val();

    if (!task.active) return;

    const div = document.createElement("div");
    div.style.marginTop = "15px";

    div.innerHTML = `
      <h4>${task.title}</h4>
      <p>Reward: ₹${task.reward}</p>
      <button class="btn" onclick="completeTask('${child.key}', ${task.reward})">
        Complete Task
      </button>
    `;

    taskBox.appendChild(div);
  });
}

window.completeTask = async function(taskId, reward) {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = ref(db, "users/" + user.uid);

  const snap = await get(userRef);

  let balance = 0;

  if (snap.exists()) {
    balance = snap.val().balance || 0;
  }

  await update(userRef, {
    balance: balance + reward
  });

  if (typeof showSuccessPopup === "function") {
    showSuccessPopup(reward);
  }

  setTimeout(() => {
    location.reload();
  }, 1000);
};

onAuthStateChanged(auth, user => {
  if (!user) return;
  loadTasks(user);
});
