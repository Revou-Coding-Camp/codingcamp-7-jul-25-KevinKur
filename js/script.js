const todoInput = document.getElementById("todoInput");
const dueDateInput = document.getElementById("dueDate");
const todoList = document.getElementById("todoList");
const notification = document.getElementById("notification");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

function showNotification(message, type = "success") {
  notification.textContent = message;
  notification.className = `mb-4 text-sm px-4 py-2 rounded-lg text-white ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }`;
  notification.classList.remove("hidden");
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = "";
  let filteredTodos = todos;
  if (filter === "pending") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  } else if (filter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  }

  if (filteredTodos.length === 0) {
    todoList.innerHTML =
      '<tr><td colspan="4" class="text-center py-6 text-gray-500">No task found</td></tr>';
    return;
  }

  filteredTodos.forEach((todo, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
          <td class="py-2 px-4">${todo.text}</td>
          <td class="py-2 px-4">${todo.date || "No due date"}</td>
          <td class="py-2 px-4">${todo.completed ? "Completed" : "Pending"}</td>
          <td class="py-2 px-4">
            <button onclick="toggleStatus(${index})" class="text-blue-600 hover:underline">Toggle</button>
            <button onclick="deleteTodo(${index})" class="text-red-600 hover:underline ml-2">Delete</button>
          </td>
        `;

    todoList.appendChild(row);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  const date = dueDateInput.value;

  if (!text) {
    showNotification("Please enter a task name", "error");
    return;
  }

  todos.push({ text, date: date || null, completed: false });
  saveToLocalStorage();
  todoInput.value = "";
  dueDateInput.value = "";
  renderTodos();
  showNotification("Todo added successfully");
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveToLocalStorage();
  renderTodos();
  showNotification("Todo deleted");
}

function toggleStatus(index) {
  todos[index].completed = !todos[index].completed;
  saveToLocalStorage();
  renderTodos();
}

function deleteAll() {
  todos = [];
  saveToLocalStorage();
  renderTodos();
  showNotification("All todos deleted");
}

function updateFilterStyles() {
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("filter-active"));
  const activeBtn = document.getElementById(`filter-${filter}`);
  if (activeBtn) {
    activeBtn.classList.add("filter-active");
  }
}

function filterTodos(type) {
  filter = type;
  renderTodos();
  updateFilterStyles();
}

updateFilterStyles();

renderTodos();
