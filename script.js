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
    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
    const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
    arrayNames.forEach((name, i) => [
      localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[i]))
    ])

  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}


// Set localStorage Arrays
function updateSavedColumns() {
  localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)')
  columnEl.appendChild(listEl)

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedonLoad) {
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
    createItemEl(progressList, 0, progressListItem, index)
  })
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeListItem, index) => {
    createItemEl(completeList, 0, completeListItem, index)
  })
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldListItem, index) => {
    createItemEl(onHoldList, 0, onHoldListItem, index)
  })
  // Run getSavedColumns only once, Update Local Storage


}

//When item starts dragging
function drag(e) {
  draggedItem = e.target;
  console.log(draggedItem)
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
}

//on Load
updateDOM()

