/**
 * @todoList check whether localStorage has data or not
 */
let todoList = localStorage.getItem("todos") !== null ? 
  JSON.parse(localStorage.getItem('todos')) :
  [];
let myForm = document.getElementById("myForm");
let myList = document.getElementById("myList");

myForm.addEventListener("submit", add);

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
    clear();
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
  let editForm = document.getElementById("editForm");
  let newData = new FormData(editForm);
  let newTitle = newData.get("newTitle");
  let todo = {
    title: newTitle,
    completed: false
  }
  todoList[evt.currentTarget.itemId] = todo;
  localStorage.setItem('todos', JSON.stringify(todoList));

  myList.removeChild(evt.currentTarget.myItem);
  editForm.reset();
  editForm.firstChild.blur();
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

  clear();
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

  input.setAttribute("type", "checkbox")

  editField.setAttribute("type", "text");
  editField.setAttribute("name", "newTitle");
  editForm.id = "editForm";
  editForm.appendChild(editField);
  editForm.addEventListener("submit", submitEdit);
  editForm.itemId = index;
  editForm.myItem = li;

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

function clear() {
  myForm.reset();
  myList.innerHTML = '';
}

function display(todos) {
  for (let todo of todos) {
    let li = createListItem(todos.indexOf(todo) ,todo.title, todo.completed);
    myList.prepend(li);
  }
}