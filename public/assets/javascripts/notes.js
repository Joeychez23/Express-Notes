let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === "/notes") {
  noteTitle = document.querySelector(".note-title");
  noteText = document.querySelector(".note-textarea");
  saveNoteBtn = document.querySelector(".save-note");
  newNoteBtn = document.querySelector(".new-note");
  noteList = document.querySelectorAll(".list-container .list-group");
}

let prevActive = false;


//GET request data function
async function getData() {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const getData = await fetch("/api/noteGET", options);
  const data = await getData.json();
  return data;
}


//POST request data function
async function addData(input) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  };
  const getData = await fetch("./api/notePOST", options);
  const data = await getData.json();
  return data;
}


//DELETE request data function
async function delData(input) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  };
  const getData = await fetch("./api/noteDEL", options);
  const data = await getData.json();
  return data;
}

listGroup = document.querySelector(".list-group");
let currId;


//Renders current notes saved in the database
async function renderNotes() {
  let data = await getData();
  if (data.length == 0) {
    currId = 1;
  }
  const liEl = document.createElement("li");
  liEl.classList.add("list-group-item");
  for (let i = 0; i < data.length; i++) {
    if (i + 1 == data.length) {
      currId = data[i].id + 1;
    }
    const spanEl = document.createElement("span");
    spanEl.classList.add("list-item-title");
    spanEl.setAttribute("onclick", `setActive(${data[i].id})`);
    spanEl.setAttribute("id", `${data[i].id}`);
    spanEl.innerText = data[i].title;
    liEl.append(spanEl);
    const delBtnEl = document.createElement("i");
    delBtnEl.classList.add(
      "fas",
      "fa-trash-alt",
      "float-right",
      "text-danger",
      "delete-note"
    );
    delBtnEl.setAttribute("id", `${data[i].id}i`);
    delBtnEl.setAttribute("onclick", `delFunc(${data[i].id})`);
    liEl.append(delBtnEl);
  }
  listGroup.append(liEl);
}
renderNotes();




//Allows the new notes button to have the functionaity to add a new note 
newNoteBtn.addEventListener("click", async function () {
  console.log(noteTitle.value);
  if (noteTitle.value != "") {
    saveNoteBtn.style.display = "none";
    const checkId = await getData();

    if (checkId.length > 0) {
      for (let i = checkId.length - 1; i < checkId.length; i++) {
        if (i + 1 == checkId.length) {
          currId = checkId[i].id + 1;
          console.log(currId);
        }
      }
    }
    console.log(currId);
    let input = {
      id: currId,
      title: noteTitle.value,
      text: noteText.value,
    };
    console.log(input);
    await addData(input);
    const data = await getData();
    let list = document.getElementsByTagName("li")[0];
    for (let i = data.length - 1; i < data.length; i++) {
      if (i + 1 == data.length) {
        currId = data[i].id + 1;
        console.log(currId);
      }
      const spanEl = document.createElement("span");
      spanEl.classList.add("list-item-title");
      spanEl.setAttribute("onclick", `setActive(${data[i].id})`);
      spanEl.setAttribute("id", `${data[i].id}`);
      spanEl.innerText = data[i].title;
      list.append(spanEl);
      const delBtnEl = document.createElement("i");
      delBtnEl.classList.add(
        "fas",
        "fa-trash-alt",
        "float-right",
        "text-danger",
        "delete-note"
      );
      delBtnEl.setAttribute("id", `${data[i].id}i`);
      delBtnEl.setAttribute("onclick", `delFunc(${data[i].id})`);
      list.append(delBtnEl);
    }
    noteTitle.value = "";
    noteText.value = "";
  }
});

let pageId;

//Sets the textboxs to the values of saved notes
async function setActive(index) {
  saveNoteBtn.style.display = "inline";
  prevActive = true;
  const data = await getData();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == index) {
      currId = data[i].id;
      pageId = currId;
      noteTitle.value = `${data[i].title}`;
      noteText.value = data[i].text;
      saveNoteBtn.style.display = "inline";
    }
  }
}


//Allows the save button to have the functionaity to overwrite a note from database
saveNoteBtn.addEventListener("click", async function () {
  if (noteTitle.value != "") {
    let input = {
      id: currId,
      title: noteTitle.value,
      text: noteText.value,
    };
    const check = await getData();

    await addData(input);
    const data = await getData();
    let index;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == currId) {
        index = i;
      }
    }
    let changeHTML = document.getElementById(`${currId}`);
    changeHTML.innerText = `${data[index].title}`;
    noteTitle.value = "";
    noteText.value = "";
    newNoteBtn.style.display = "inline";
    saveNoteBtn.style.display = "none";
  }
});


//Allows the delete button to have the functionaity to delete a note from database
async function delFunc(index) {
  console.log(pageId)
  currId = index;
  if(pageId == currId) {
    saveNoteBtn.style.display = "none";
  }
  let input = {
    id: currId,
    title: noteTitle.value,
    text: noteText.value,
  };
  console.log(index);
  await delData(input);
  const data = await getData();
  let span = document.getElementById(`${index}`);
  span.setAttribute("class", "invis");
  let i = document.getElementById(`${index}i`);
  i.setAttribute("class", "invis");
  span.remove();
  i.remove();
  let spanArr = document.getElementsByTagName('span');
  let iArr = document.getElementsByTagName('i');
  for (let i = 0; i < spanArr.length; i++) {
    spanArr[i].setAttribute("id", `${data[i].id}`);
    spanArr[i].setAttribute("onclick", `setActive(${data[i].id})`);
  }
  for (let i = 2; i < iArr.length; i++) {
    iArr[i].setAttribute("id", `${data[i - 2].id}i`);
    iArr[i].setAttribute("onclick", `delFunc(${data[i - 2].id})`);
  }
}
