const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedonLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}


// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  console.log('column:', column);

  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)')
  listEl.contentEditable = true;
  listEl.id = index;
  columnEl.appendChild(listEl)
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedonLoad) {
    console.log('yes')
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backLogItem, index) => {
    createItemEl(backlogList, 0, backLogItem, index)
  })
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressListItem, index) => {
    createItemEl(progressList, 1, progressListItem, index)
  })
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeListItem, index) => {
    createItemEl(completeList, 2, completeListItem, index)
  })
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldListItem, index) => {
    createItemEl(onHoldList, 3, onHoldListItem, index)
  })
  // Run getSavedColumns only once, Update Local Storage
  updatedonLoad = true;
  updateSavedColumns();
}

//Update item - Delete if necessary, or update the array value
function updateItem(id, column) {
  console.log('u', column, 'i', id)
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumn[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumn[id].textContent;
    }
    updateDOM();
  }
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  console.log(listArrays)
  const itemText = addItems[column].textContent 
  console.log(listArrays[column])
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}


//Show add item input box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden'
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display='flex';
}

//Hide item input box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible'
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display='none';
  addToColumn(column)
}
// Allows arrays to relfect Drag and Drop Items
function rebuildArrays() {
  backlogListArray = []
  progressListArray = []
  completeListArray = []
  onHoldListArray = []
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent)
  }
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent)
  }
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent)
  }
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent)
  }
  updateDOM()
}
//When item starts dragging
function drag(e) {
  draggedItem = e.target;

}

// When the item enters the column area
function dragEnter(column) {
  listColumns[column].classList.add('over')
  currentColumn = column;
}

// Column Allows for the column to drop
function allowDrop(e) {
  e.preventDefault()

}

//Dropping Item in Column
function drop(e) {
  e.preventDefault()
  //Remove background color/padding
  listColumns.forEach((column) => {
    column.classList.remove('over')
  })
  //Add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem)
  rebuildArrays();
}

//on Load
updateDOM()

