let addBtn = document.getElementById("addBtn");
let ul = document.getElementById("taskList");
let taskInput = document.getElementById("taskInput");
let clearAllBtn = document.getElementById("clearAll");
let counter = document.getElementById("counter");
let filterButtons = document.querySelectorAll(".filters button");
let themeToggle = document.getElementById("themeToggle");
let dueDateInput = document.getElementById("dueDate");
let priorityInput = document.getElementById("priority");

function saveTasks() {
  localStorage.setItem("tasks", ul.innerHTML);
}

function loadTasks() {
  ul.innerHTML = localStorage.getItem("tasks") || "";
  updateCounter();
}
loadTasks();

const isDark = localStorage.getItem("darkMode") === "true";
document.body.classList.toggle("dark", isDark);
themeToggle.innerText = isDark ? "☀️" : "🌙";

addBtn.addEventListener("click", function () {
  if (taskInput.value.trim() === "") return;

  let item = document.createElement("li");
  item.classList.add(priorityInput.value);
  item.setAttribute("data-priority", priorityInput.value);

  let dueText = dueDateInput.value ? ` (Due: ${dueDateInput.value})` : "";

  item.innerHTML = `
    <span class="task-text">${taskInput.value}${dueText}</span>
    <div>
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>
  `;

  ul.appendChild(item);
  taskInput.value = "";
  dueDateInput.value = "";
  saveTasks();
  updateCounter();
});

ul.addEventListener("click", function (e) {
  let target = e.target;
  let li = target.closest("li");

  if (!li) return;

  if (target.classList.contains("delete")) {
    li.remove();
  } else if (target.classList.contains("edit")) {
    let span = li.querySelector(".task-text");
    if (target.innerText === "Edit") {
      let input = document.createElement("input");
      input.type = "text";
      input.value = span.innerText;
      li.replaceChild(input, span);
      target.innerText = "Save";
    } else {
      let input = li.querySelector("input");
      let newSpan = document.createElement("span");
      newSpan.classList.add("task-text");
      newSpan.innerText = input.value;
      li.replaceChild(newSpan, input);
      target.innerText = "Edit";
    }
  } else if (target.classList.contains("task-text")) {
    li.classList.toggle("completed");
  }

  saveTasks();
  updateCounter();
});

clearAllBtn.addEventListener("click", function () {
  ul.innerHTML = "";
  saveTasks();
  updateCounter();
});

function updateCounter() {
  let total = ul.querySelectorAll("li").length;
  let completed = ul.querySelectorAll("li.completed").length;
  let pending = total - completed;
  counter.innerText = `${total} tasks (${pending} pending, ${completed} completed)`;
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    let filter = btn.dataset.filter;

    ul.querySelectorAll("li").forEach(li => {
      if (filter === "all") li.style.display = "flex";
      else if (filter === "completed") li.style.display = li.classList.contains("completed") ? "flex" : "none";
      else if (filter === "pending") li.style.display = !li.classList.contains("completed") ? "flex" : "none";
    });
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.innerText = isDark ? "☀️" : "🌙";
  localStorage.setItem("darkMode", isDark);
});
