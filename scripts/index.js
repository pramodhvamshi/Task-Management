// creating a storage for storing all the tasks
const state = {
  taskList: [],
};

//accessing the task content and task modal body
const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");

// generating html for task content
const htmlTaskContent = ({ id, title, description, type, url }) => `
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
      <div class='card shadow-sm task__card'>
        <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
          <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick='editTask.apply(this, arguments)' >
            <i class='fas fa-pencil-alt' name=${id}></i>
          </button>
          <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick='deleteTask.apply(this, arguments)'>
            <i class='fas fa-trash-alt' name=${id}></i>
          </button>
        </div>
        <div class='card-body'>
          ${
            url
              ? `<img width='100%' height='150px' src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
              : `
        <img width='100%' height='150px' src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='card-image-top md-3 rounded-lg' />
        `
          }
          <h4 class='task__card__title'>${title}</h4>
          <p class='description trim-3-lines text-muted' data-gram_editor='false'>
            ${description}
          </p>
          <div class='tags text-white d-flex flex-wrap'>
            <span class='badge bg-primary m-1'>${type}</span>
          </div>
        </div>
        <div class='card-footer'>
          <button 
          type='button' 
          class='btn btn-outline-primary float-right' 
          data-bs-toggle='modal'
          data-bs-target='#showTask'
          id=${id}
          onclick='openTask.apply(this, arguments)'
          >
            Open Task
          </button>
        </div>
      </div>
    </div>
  `;

// generating html for modal
const htmlModalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
      <div id=${id}>
      ${
        url
          ? `
          <img width='100%' src=${url} alt='card image cap' class='img-fluid place__holder__image mb-3' />
        `
          : `
        <img width='100%' src="https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png" alt='card image cap' class='img-fluid place__holder__image mb-3' />
        `
      }
      <strong class='text-sm text-muted'>Created on ${date.toDateString()}</strong>
      <h2 class='my-3'>${title}</h2>
      <p class='lead'>
        ${description}
      </p>
      </div>
    `;
};

// updating the local storage by storing tasklist inside it
const updateLocalStorage = () => {
  localStorage.setItem(
    "tasks",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
};

// loading the local storage data onto the HTML page
const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.tasks);

  if (localStorageCopy) state.taskList = localStorageCopy.tasks;

  state.taskList.map((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  });
};

// handling the submit option of the task form
const handleSubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageURL").value,
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    type: document.getElementById("tags").value,
  };

  if (input.title === "" || input.description === "" || input.type === "") {
    return alert("Please fill all the fields");
  }

  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({
      ...input,
      id,
    })
  );

  state.taskList.push({ ...input, id });
  updateLocalStorage();
};

// handling the modal for every task
const openTask = (e) => {
  if (!e) {
    e = window.event;
  }
  const getTask = state.taskList.find(({ id }) => id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
};

// deleting a task
const deleteTask = (e) => {
  if (!e) {
    e = window.event;
  }
  const targetID = e.target.getAttribute("name");
  const type = e.target.tagName;
  const removeTask = state.taskList.filter(({ id }) => id !== targetID);
  state.taskList = removeTask;
  updateLocalStorage();

  if (type === "BUTTON") {
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  } else {
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

// editing a task
const editTask = (e) => {
  if (!e) {
    e = window.event;
  }
  const targetID = e.target.id;
  const type = e.target.tagName;

  let parent_node;
  let taskTitle;
  let taskDesc;
  let taskType;
  let submitButton;

  if (type === "BUTTON") {
    parent_node = e.target.parentNode.parentNode;
  } else {
    parent_node = e.target.parentNode.parentNode.parentNode;
  }
  // making the form editable
  taskTitle = parent_node.childNodes[3].childNodes[3];
  taskDesc = parent_node.childNodes[3].childNodes[5];
  taskType = parent_node.childNodes[3].childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable", true);
  taskDesc.setAttribute("contenteditable", true);
  taskType.setAttribute("contenteditable", true);

  submitButton = parent_node.childNodes[5].childNodes[1];
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.setAttribute("onclick", "saveTaskEdit.apply(this,arguments)");
  submitButton.innerText = "Save Changes";
};

// saving the edited task
const saveTaskEdit = (e) => {
  if (!e) {
    e = window.event;
  }
  const targetID = e.target.id;
  const parent_node = e.target.parentNode.parentNode;
  const taskTitle = parent_node.childNodes[3].childNodes[3];
  const taskDesc = parent_node.childNodes[3].childNodes[5];
  const taskType = parent_node.childNodes[3].childNodes[7].childNodes[1];
  const submitButton = parent_node.childNodes[5].childNodes[1];

  // getting back the changes made and storing in a new object
  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDesc: taskDesc.innerHTML,
    taskType: taskType.innerHTML,
  };

  // creating a copy of current state of tasklist
  let stateCopy = state.taskList;

  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
          id: task.id,
          title: updateData.taskTitle,
          description: updateData.taskDesc,
          type: updateData.taskType,
          url: task.url,
        }
      : task
  );

  // updating the storages
  state.taskList = stateCopy;
  updateLocalStorage();

  // setting back the changed attributes of form
  taskTitle.setAttribute("contenteditable", "false");
  taskDesc.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");

  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
  submitButton.innerText = "Open Task";
};

// searching a particular task
const searchTask = (e) => {
  if (!e) {
    e = window.event;
  }

  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }

  // filtering the tasks to match the searched title
  const resultData = state.taskList.filter(({ title }) => {
    return title.toLowerCase().includes(e.target.value.toLowerCase());
  });

  resultData.map((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  });
};
