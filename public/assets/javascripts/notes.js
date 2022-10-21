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

newNoteBtn.addEventListener("click", async function () {
  saveNoteBtn.style.display = 'none';
  const checkId =  await getData();
  if(checkId > 0) {
    for(let i = 0; i < checkId.length; i++) {
      if(i + 1 == checkId.length) {
        currId = checkId[i].id + 1;
      }
    }
  }
  let input = {
    id: currId,
    title: noteTitle.value,
    text: noteText.value,
  };
  await addData(input);
  const data = await getData();
  let list = document.getElementsByTagName("li")[0];
  for (let i = data.length - 1; i < data.length; i++) {
    if (i + 1 == data.length) {
      currId = data[i].id + 1;
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
    noteTitle.value = ''
    noteText.value = ''
  }

});

async function setActive(index) {
  saveNoteBtn.style.display = 'inline'
  prevActive = true;
  const data = await getData();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id == index) {
      currId = data[i].id;
      noteTitle.value = `${data[i].title}`;
      noteText.value = data[i].text;
      saveNoteBtn.style.display = 'inline';

    }
  }

}

saveNoteBtn.addEventListener("click", async function () {
  let input = {
    id: currId,
    title: noteTitle.value,
    text: noteText.value,
  };
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
  noteTitle.value = '';
  noteText.value = '';
  newNoteBtn.style.display = 'inline'
  saveNoteBtn.style.display = 'none'


})


async function delFunc(index) {
  currId = index;
  let input = {
    id: currId,
    title: noteTitle.value,
    text: noteText.value,
  };
  await delData(input);
  try {
    let span = document.getElementsByTagName("span")[index - 1];
    let i = document.getElementsByTagName("i")[index + 2 - 1];
    span.remove();
    i.remove();
  } catch {
    let span = document.getElementById(`${index}`);
    span.setAttribute("class", "invis")
    let i = document.getElementById(`${index}i`);
    i.setAttribute("class", "invis");
  }
}
















// Gets notes from the db and renders them to the sidebar
//const getAndRenderNotes = () => getNotes().then(renderNoteList);
/*
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}
*/
/*
getAndRenderNotes();

*/
