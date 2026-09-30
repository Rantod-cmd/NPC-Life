const quests = {
  assignment: {
    title: "Finish Software Engineering Assignment",
    type: "MAIN QUEST",
    desc: "Defeat the deadline before midnight.",
    difficulty: "★★★★☆",
    reward: "+200 XP",
    flavor: "One focused push. Finish the work you already planned to do.",
    xp: 200,
    stats: { int: 15, disc: 20 }
  },
  datacom: {
    title: "Review Data Communication",
    type: "SIDE QUEST",
    desc: "Enter the signal dungeon and master today's lesson.",
    difficulty: "★★★☆☆",
    reward: "+120 XP",
    flavor: "Master today's lesson and strengthen your knowledge.",
    xp: 120,
    stats: { int: 15 }
  },
  workout: {
    title: "Evening Workout",
    type: "SIDE QUEST",
    desc: "Train your body and strengthen your resolve.",
    difficulty: "★★☆☆☆",
    reward: "+100 XP",
    flavor: "Turn the workout you already planned into visible character growth.",
    xp: 100,
    stats: { str: 10 }
  }
};

const initialState = {
  level: 7,
  xp: 720,
  stats: { int: 57, str: 44, agi: 61, soc: 48, disc: 47 },
  completed: []
};

let state = JSON.parse(JSON.stringify(initialState));
let activeQuest = null;

const $ = (id) => document.getElementById(id);

const modal = $("questModal");
const toast = $("toast");
const completeBtn = $("completeQuestBtn");

document.querySelectorAll("[data-open]").forEach(btn => {
  btn.addEventListener("click", () => openQuest(btn.dataset.open));
});

$("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

completeBtn.addEventListener("click", completeActiveQuest);
$("resetBtn").addEventListener("click", resetDay);
$("endDayBtn").addEventListener("click", () => {
  $("adventureLog").classList.remove("hidden");
  $("gmMessage").textContent = "Day cleared. Your routine became a story of visible progress.";
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
});

function openQuest(id) {
  if (state.completed.includes(id)) return;
  activeQuest = id;
  const q = quests[id];
  $("modalType").textContent = q.type;
  $("modalTitle").textContent = q.title;
  $("modalDesc").textContent = q.desc;
  $("modalDifficulty").textContent = q.difficulty;
  $("modalReward").textContent = q.reward;
  $("modalFlavor").textContent = q.flavor;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  activeQuest = null;
}

function completeActiveQuest() {
  if (!activeQuest) return;
  const q = quests[activeQuest];
  state.completed.push(activeQuest);
  state.xp += q.xp;

  Object.entries(q.stats).forEach(([key, val]) => {
    state.stats[key] += val;
  });

  while (state.xp >= 1000) {
    state.xp -= 1000;
    state.level += 1;
    showToast(`LEVEL UP! LV.${state.level}`);
  }

  const card = document.querySelector(`[data-id="${activeQuest}"]`);
  card.classList.add("completed");
  render();
  closeModal();

  setTimeout(() => showToast(`QUEST COMPLETE! ${q.reward}`), 150);

  if (state.completed.length === 3) {
    $("gmMessage").textContent = "All quests cleared. The Adventure Log is now unlocked.";
  }
}

function render() {
  $("levelText").textContent = state.level;
  $("xpText").textContent = `${state.xp} / 1000 XP`;
  $("xpFill").style.width = `${Math.min(100, state.xp / 10)}%`;

  const map = {
    int: ["intVal", "intBar"],
    str: ["strVal", "strBar"],
    agi: ["agiVal", "agiBar"],
    soc: ["socVal", "socBar"],
    disc: ["discVal", "discBar"]
  };

  Object.entries(map).forEach(([key, [valId, barId]]) => {
    $(valId).textContent = state.stats[key];
    $(barId).style.width = `${Math.min(100, state.stats[key])}%`;
  });

  $("questCount").textContent = `${state.completed.length} / 3 COMPLETE`;
  $("endDayBtn").disabled = state.completed.length !== 3;
}

function resetDay() {
  state = JSON.parse(JSON.stringify(initialState));
  document.querySelectorAll(".quest-card").forEach(card => card.classList.remove("completed"));
  $("adventureLog").classList.add("hidden");
  $("gmMessage").textContent = "A new day begins. Three quests stand between you and victory.";
  render();
  showToast("DAY RESET");
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove("hidden");
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 1800);
}

render();
