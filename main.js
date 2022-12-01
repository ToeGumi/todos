let todoList = localStorage.getItem("todos") !== null ? 
  JSON.parse(localStorage.getItem('todos')) :
  [];
let myForm = document.getElementById("myForm");
let myList = document.getElementById("myList");

window.onload = function() {
  display(todoList);
};

myForm.addEventListener("submit", handleSubmit);


function handleSubmit(event) {
  event.preventDefault();

  let data = new FormData(myForm);
  let title = data.get("title");
  
  if (title !== "") {
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
    console.log("Empty field!");
  }
}

function clear() {
  myForm.reset();
  myList.innerHTML = '';
}

function display(todosList) {
  for (let todo of todosList) {
    let li = elt("li", todo.title, todo.completed);
    myList.prepend(li);
  }
}

function elt(name, title, completed) {
  let dom = document.createElement(name);
  let text = document.createTextNode(title);
  dom.appendChild(text);
  dom.className = completed ? "completed" : "";
  return dom;
}