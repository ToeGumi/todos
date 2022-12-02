/**
 * @todoList check whether localStorage has data or not
 */
let todoList = localStorage.getItem("todos") !== null ? 
  JSON.parse(localStorage.getItem('todos')) :
  [];
let myForm = document.getElementById("myForm");
let myList = document.getElementById("myList");
let myFilters = document.getElementById("filters");
let filterInput = document.getElementById("showCompletedTodo");
let removeCompletedButton = document.getElementById("clearAllCompletedTodo");
myForm.addEventListener("submit", add);
filterInput.addEventListener("change", filterCompletedTodo);
removeCompletedButton.addEventListener("click", removeCompletedTodo);

window.onload = function () { // display view on every load
  display(todoList);
};

/**
 * Add a todo into view and localStorage
 */
function add(event) {
  event.preventDefault();

  let data = new FormData(myForm);
  let title = data.get("title");

  let isDuplicate = todoList.some((a) => a.title === title);
  
  if (title !== "" && !isDuplicate) {
    let todo = {
      title: title,
      completed: false
    };
    todoList.push(todo);
    
    localStorage.setItem('todos', JSON.stringify(todoList));
    
    let todos = JSON.parse(localStorage.getItem('todos'));

    myForm.reset();
    display(todos);

  } else {
    isDuplicate ?
    console.log("Duplicated!") :
    console.log("Empty field!");
  }
}

/**
 * Handle doubleclick event and show edit view
 */
function edit(evt) { 
  let editForm = evt.currentTarget.editForm;
  editForm.firstChild.value = evt.target.textContent;
  editForm.firstChild.focus();
}

/**
 * Handle submit on editing, update localStorage, update view and clear focus
 */
function submitEdit(evt) {
  evt.preventDefault();
  let form = evt.currentTarget.form;
  let field = evt.currentTarget.field;
  let todo = {
    title: field.value,
    completed: false
  }
  todoList[evt.currentTarget.itemId] = todo;
  localStorage.setItem('todos', JSON.stringify(todoList));

  myList.removeChild(evt.currentTarget.myItem);
  form.reset();
  field.blur();
  display(todoList);
}

/**
 * Remove a todo in view and localStorage, clear form
 */
function remove(evt) {
  let id = evt.currentTarget.itemId;
  let item = evt.currentTarget.myItem;
  todoList.splice(id, 1);
  
  localStorage.setItem('todos', JSON.stringify(todoList));
  myList.removeChild(item);

  myForm.reset();
  display(todoList);
}

function toggleCheckbox(e) {
  let completed = e.currentTarget.checked;
  let label = e.currentTarget.itemLabel;
  let id = e.currentTarget.itemId;
  let todo = {
    title: label.textContent,
    completed: completed
  }
  todoList[id] = todo;
  localStorage.setItem('todos', JSON.stringify(todoList));
  display(todoList);
}

function filterCompletedTodo(e) {
  if (e.currentTarget.checked) {
    let filteredList = todoList.filter((todo) => todo.completed);
    display(filteredList);
  } else {
    display(todoList);
  }
}

function removeCompletedTodo() {
  todoList = todoList.filter(todo => !todo.completed);
  localStorage.setItem('todos', JSON.stringify(todoList));
  display(todoList);
}

/**
 *  Create item
 */
function createListItem(index, title, completed) {
  let li = document.createElement("li");
  let input = document.createElement("input");
  let label = document.createElement("label");
  let editForm = document.createElement("form");
  let editField = document.createElement("input");
  let span = document.createElement("span");
  let text = document.createTextNode(title);
  let i = document.createElement("i").appendChild(document.createTextNode("X"))

  input.setAttribute("type", "checkbox");
  input.addEventListener("change", toggleCheckbox);
  input.checked = completed;
  input.itemId = index;
  input.itemLabel = label;

  editField.setAttribute("type", "text");
  editField.setAttribute("name", "newTitle");
  editField.id = "editField";
  editForm.id = "editForm";
  editForm.appendChild(editField);
  editForm.addEventListener("submit", submitEdit);
  editForm.itemId = index;
  editForm.myItem = li;
  editForm.form = editForm;
  editForm.field = editField;

  label.appendChild(text);
  label.addEventListener("dblclick", edit);
  label.editForm = editForm;

  span.appendChild(i);
  span.id = "remove";
  span.addEventListener("click", remove);
  span.itemId = index;
  span.myItem = li;

  li.className = completed ? "completed" : "";
  li.appendChild(input);
  li.appendChild(label);
  li.appendChild(editForm);
  li.appendChild(span);
  
  return li;
}

function display(todos) {
  myFilters.classList = todos.length === 0 && !filterInput.checked ? "hidden" : "";
  removeCompletedButton.disabled = todos.every(todo => !todo.completed);
  myList.innerHTML = '';
  for (let todo of todos) {
    let li = createListItem(todos.indexOf(todo) ,todo.title, todo.completed);
    myList.prepend(li);
  }
}