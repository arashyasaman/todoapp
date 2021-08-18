showtodo();

let addInput = document.getElementById("addInput");
let addBtn = document.getElementById("addBtn");
let notempty = document.getElementById("notempty");
let removeAll = document.getElementById("removeAll");

addInput.value = "";
addInput.focus();

// ADD
addBtn.addEventListener("click", function () {
  document.getElementById("req").style.display = "none";
  removeAll.style.display = "block";
  addInputValue = addInput.value;

  if (addInputValue.trim() != 0) {
    let webTodoList = localStorage.getItem("todolist");
    if (webTodoList == null) {
      todoItem = [];
    } else {
      todoItem = JSON.parse(webTodoList);
    }

    todoItem.push(addInputValue);
    localStorage.setItem("todolist", JSON.stringify(todoItem));

    showtodo();
    addInput.value = "";
    addInput.focus();

    if (todoItem.length % 5 == 0) {
      showVideo();
      addInput.blur();
    }
  } else {
  }
});
console.log(todoItem.length);
if (todoItem.length > 0) {
  document.getElementById("req").style.display = "none";
  removeAll.style.display = "block";
}

// Modal
function showVideo() {
  fetch("http://api.aparat.com/fa/v1/video/video/mostViewedVideos")
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      let sabaideaData = response.data;
      let mostViewedArray = [];

      sabaideaData.forEach((item) => {
        mostViewedArray.push(item.attributes.visit_cnt);
      });

      console.log("Visit Count Array", mostViewedArray);

      let maxNumber = Math.max(...mostViewedArray);
      console.log("maxNumber", maxNumber);

      let maxCount = sabaideaData.find((item) => {
        if (Number(item.attributes.visit_cnt) === maxNumber) {
          return item.attributes.visit_cnt;
        }
      });
      let targetVideo = maxCount.attributes.preview_src;
      let targetVideoText = maxCount.attributes.title;
      let modal = document.getElementById("modal");
      let main = document.getElementById("main");
      console.log("Video link", targetVideo);
      console.log("Video Text", targetVideoText);

      modal.classList.add("show");
      main.classList.add("noscroll");
      document.getElementById("iframeTag").src = targetVideo;
      document.getElementById("videotext").innerHTML = targetVideoText;
    })
    .catch(function (err) {
      console.warn("Something went wrong.", err);
    });
}

//CLOSEMODAL
let closeModal = document.getElementById("closeModal");
closeModal.addEventListener("click", function () {
  let modal = document.getElementById("modal");
  let main = document.getElementById("main");

  modal.classList.remove("show");
  main.classList.remove("noscroll");
});
window.onclick = function (event) {
  if (event.target == modal) {
    modal.classList.remove("show");
  }
};

// SHOW LIST
function showtodo() {
  let webTodoList = localStorage.getItem("todolist");
  if (webTodoList == null) {
    todoItem = [];
  } else {
    todoItem = JSON.parse(webTodoList);
  }

  let html = "";
  let listOfTodo = document.getElementById("listOfTodo");
  todoItem.forEach((item, index) => {
    html += `
              <div class="todo-item item-${index}">
                  <h3>${item}</h3>
                  <div class="todo-btn">
                      <i class="fa fa-pen todo-btn" onclick="edittodo(${index})"></i>
                      <i class="fa fa-trash-alt todo-btn" onclick="deletetodo(${index})"></i>
                  </div>
              </div>`;
  });
  listOfTodo.innerHTML = html;
}

// EDIT
function edittodo(index) {
  let addInput = document.getElementById("addInput");
  let saveInput = document.getElementById("saveInput");
  let addBtn = document.getElementById("addBtn");
  let editBtn = document.getElementById("editBtn");
  addInput.focus();
  saveInput.value = index;
  let webTodoList = localStorage.getItem("todolist");
  let todoItem = JSON.parse(webTodoList);
  addInput.value = todoItem[index];

  addBtn.style.display = "none";
  editBtn.style.display = "block";
}

// SAVE
let editBtn = document.getElementById("editBtn");
editBtn.addEventListener("click", function () {
  let webTodoList = localStorage.getItem("todolist");
  let todoItem = JSON.parse(webTodoList);

  let saveInput = document.getElementById("saveInput").value;
  todoItem[saveInput] = addInput.value;
  localStorage.setItem("todolist", JSON.stringify(todoItem));
  showtodo();
  addInput.value = "";
  addBtn.style.display = "block";
  editBtn.style.display = "none";
  addInput.focus();
});

function deletetodo(index) {
  let webTodoList = localStorage.getItem("todolist");
  let todoItem = JSON.parse(webTodoList);
  todoItem.splice(index, 1);
  localStorage.setItem("todolist", JSON.stringify(todoItem));
  showtodo();
}

// DELETE ALL
removeAll.addEventListener("click", function () {
  let webTodoList = localStorage.getItem("todolist");
  let todoItem = JSON.parse(webTodoList);
  if (todoItem != 0) {
    todoItem = [];
  } else {
    let todoItem = JSON.parse(webTodoList);
    todoItem = [];
  }
  localStorage.setItem("todolist", JSON.stringify(todoItem));

  addInput.value = "";
  addInput.focus();
  addBtn.style.display = "block";
  editBtn.style.display = "none";

  showtodo();
});
