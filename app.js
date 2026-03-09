let tasks = [];
let currentView = "list";
let timerInterval = null;
let timeLeft = 25 * 60;
let initialTime = 25 * 60;
let focusedTaskId = null;
let currentChart = null;

const taskForm = document.getElementById("taskForm");
const tasksContainer = document.getElementById("tasks");
const subtaskList = document.getElementById("subtaskList");
const viewButtons = document.querySelectorAll(".nav-btn[data-view]");
const viewSections = document.querySelectorAll(".view-section");

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  setupEventListeners();
  setupTheme();
  renderApp();
});

function loadTasks() {
  const data = localStorage.getItem("taskmate_data");
  if (data) tasks = JSON.parse(data);
}

function saveTasks() {
  localStorage.setItem("taskmate_data", JSON.stringify(tasks));
  renderApp();
}

function renderApp() {
  updateSidebarCount();

  viewSections.forEach((el) => el.classList.remove("active"));
  const activeSection = document.getElementById(`view-${currentView}`);
  if (activeSection) activeSection.classList.add("active");

  viewButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === currentView);
  });

  if (currentView === "list") renderListView();

  if (window.lucide) lucide.createIcons();
}

function renderListView() {
  tasksContainer.innerHTML = "";

  const searchTerm = document.getElementById("search").value.toLowerCase();
  const filterStatus = document.getElementById("filterStatus").value;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm);
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && task.status !== "done") ||
      (filterStatus === "completed" && task.status === "done");

    return matchesSearch && matchesFilter;
  });

  if (filteredTasks.length === 0) {
    tasksContainer.innerHTML =
      '<div style="text-align:center;padding:2rem;opacity:.6;">No tasks found</div>';
    return;
  }

  filteredTasks.forEach((task) => {
    tasksContainer.appendChild(createTaskElement(task));
  });
}

function createTaskElement(task) {
  const div = document.createElement("div");
  div.className = `task ${task.status === "done" ? "completed" : ""}`;

  const totalSteps = task.subtasks ? task.subtasks.length : 0;
  const doneSteps = task.subtasks
    ? task.subtasks.filter((s) => s.done).length
    : 0;

  const progressPercent = totalSteps > 0 ? (doneSteps / totalSteps) * 100 : 0;

  let subtasksHTML = "";

  if (task.subtasks && task.subtasks.length > 0) {
    subtasksHTML = `
      <div class="subtasks">
        ${task.subtasks
          .map(
            (s, index) => `
          <label style="display:flex;gap:8px;align-items:center;">
            <input type="checkbox"
              ${s.done ? "checked" : ""}
              onchange="toggleSubtask('${task.id}',${index})">
            <span>${s.text}</span>
          </label>
        `
          )
          .join("")}
      </div>
    `;
  }

  div.innerHTML = `
  <div style="flex:1">

    <div class="title">${task.title}</div>
    <div class="meta">${task.notes || ""}</div>

    ${
      totalSteps > 0
        ? `
      <div class="subtask-progress">
        <div class="progress-track">
          <div class="progress-bar" style="width:${progressPercent}%"></div>
        </div>
        <small>${doneSteps}/${totalSteps} steps</small>
      </div>`
        : ""
    }

    ${subtasksHTML}

    <div class="actions" style="margin-top:8px;">
      <span class="chip">${task.priority}</span>
      <button class="btn ghost sm" onclick="fillEditForm('${task.id}')">Edit</button>
      <button class="btn ghost sm" onclick="deleteTask('${task.id}')">Delete</button>
    </div>

  </div>

  <input type="checkbox"
    ${task.status === "done" ? "checked" : ""}
    onchange="toggleTaskStatus('${task.id}')">
  `;

  return div;
}

function setupEventListeners() {
  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentView = btn.dataset.view;
      renderApp();
    });
  });

  document
    .getElementById("aiBreakdownBtn")
    ?.addEventListener("click", generateSubtasksAI);

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const subtaskItems = [];
    document.querySelectorAll(".subtask-text").forEach((input) => {
      if (input.value) subtaskItems.push({ text: input.value, done: false });
    });

    const newTask = {
      id: document.getElementById("editingId").value || Date.now().toString(),
      title: document.getElementById("title").value,
      priority: document.getElementById("priority").value,
      notes: document.getElementById("notes").value,
      dueDate: document.getElementById("due").value,
      status: "todo",
      subtasks: subtaskItems,
      createdAt: new Date().toISOString(),
    };

    const existingIndex = tasks.findIndex((t) => t.id === newTask.id);

    if (existingIndex >= 0) tasks[existingIndex] = newTask;
    else tasks.unshift(newTask);

    saveTasks();
    taskForm.reset();
    subtaskList.innerHTML = "";
    document.getElementById("editingId").value = "";
  });

  document.getElementById("addSubtaskBtn").addEventListener("click", () => {
    const div = document.createElement("div");

    div.className = "subtask-row";

    div.innerHTML = `
      <input type="checkbox" disabled>
      <input type="text" class="subtask-text" placeholder="Step...">
      <button type="button" onclick="this.parentElement.remove()">×</button>
    `;

    subtaskList.appendChild(div);
  });
}

function updateSidebarCount() {
  document.getElementById("count").textContent = tasks.length;
}

window.toggleTaskStatus = (id) => {
  const task = tasks.find((t) => t.id === id);

  if (task) {
    task.status = task.status === "done" ? "todo" : "done";
    saveTasks();
  }
};

window.toggleSubtask = (taskId, subIndex) => {
  const task = tasks.find((t) => t.id === taskId);

  if (!task || !task.subtasks) return;

  task.subtasks[subIndex].done = !task.subtasks[subIndex].done;

  saveTasks();
};

window.deleteTask = (id) => {
  if (confirm("Delete task?")) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
  }
};

window.fillEditForm = (id) => {
  const task = tasks.find((t) => t.id === id);

  if (!task) return;

  document.getElementById("title").value = task.title;
  document.getElementById("notes").value = task.notes;
  document.getElementById("priority").value = task.priority;
  document.getElementById("due").value = task.dueDate;
  document.getElementById("editingId").value = task.id;

  viewButtons[0].click();
};

function setupTheme() {
  const savedTheme = localStorage.getItem("taskmate_theme") || "dark";

  applyTheme(savedTheme);

  document.getElementById("themeBtn").addEventListener("click", () => {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(newTheme);

    localStorage.setItem("taskmate_theme", newTheme);
  });
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;

  const btn = document.getElementById("themeBtn");

  if (btn) {
    const icon = theme === "light" ? "moon" : "sun";

    btn.innerHTML = `<i data-lucide="${icon}"></i> Theme`;

    if (window.lucide) lucide.createIcons();
  }
}

window.generateSubtasksAI = async function () {

  const title = document.getElementById("title").value;

  if (!title) {
    alert("Enter a task title first.");
    return;
  }

  try {

    const response = await fetch("http://localhost:5000/api/ai-breakdown", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
    });

    const data = await response.json();

    if (!data.result) {
      alert("AI failed.");
      return;
    }

    const steps = data.result.split("\n").filter(s => s.trim());

    const subtaskList = document.getElementById("subtaskList");
    subtaskList.innerHTML = "";

    steps.forEach(step => {

      const div = document.createElement("div");
      div.className = "subtask-row";

      div.innerHTML = `
        <input type="checkbox" disabled>
        <input type="text" class="subtask-text" value="${step.replace(/^\d+[\).\s]/,'')}">
        <button type="button" onclick="this.parentElement.remove()">×</button>
      `;

      subtaskList.appendChild(div);

    });

  } catch (error) {

    console.error(error);
    alert("Could not connect to AI server.");

  }

};