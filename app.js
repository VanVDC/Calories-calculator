// Storage Controller
const StorageCtrl = (function () {
  //public methods
  return {
    storeItem: function (item) {
      let items;
      //Check if any items in ls
      if (localStorage.getItem("items") === null) {
        items = [];
        //push new item
        items.push(item);

        //set ls
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        //get what is already in ls
        items = JSON.parse(localStorage.getItem("items"));

        //push the new item

        items.push(item);

        //reset ls
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },

    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id == item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (item.id === id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    // items: [
    //   // { id: 0, name: "Steak Dinner", calories: 1200 },
    //   // { id: 1, name: "Cookie", calories: 400 },
    //   // { id: 2, name: "Eggs", calories: 300 },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  // Public methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      //create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //calories to number
      calories = parseInt(calories);

      //create new item
      newItem = new Item(ID, name, calories);
      //add to items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById: function (id) {
      let found = null;
      //loop through items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },
    updateItem: function (name, calories) {
      //calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function (id) {
      //get ids
      ids = data.items.map(function (item) {
        return item.id;
      });

      //get index
      const index = ids.indexOf(id);

      //remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;
      data.items.forEach(function (item) {
        total += item.calories;
      });
      //set total cal in data structure
      data.totalCalories = total;

      //return total
      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();
//====================

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
    clearBTN: ".clear-btn",
  };
  // Public methods

  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach(function (item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>
        
        `;
      });

      //insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemsInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      //show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      //create li element
      const li = document.createElement("li");
      //add class
      li.className = "collection-item";
      //add ID
      li.id = `item-${item.id}`;

      //add html
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;

      //insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function () {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //turn node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();
      });
    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();
//=====================

// App Controller
const App = (function (ItemCtrl, UICtrl, StorageCtrl) {
  //load event listeners
  const loadEventListeners = function () {
    //get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    //disable submit on enter
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // clear item event
    document
      .querySelector(UISelectors.clearBTN)
      .addEventListener("click", clearAllItemClick);
  };

  //add item submit
  const itemAddSubmit = function (e) {
    //get form input from UT controller
    const input = UICtrl.getItemsInput();
    // check for name and calories input
    if (input.name !== "" && input.calories !== "") {
      //add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      //add item to Ui list
      UICtrl.addListItem(newItem);

      //get total calories

      const totalCalories = ItemCtrl.getTotalCalories();
      //add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //store in localStorage
      StorageCtrl.storeItem(newItem);
      //clear fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  };

  //click edit item
  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      //Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      //break into an array
      const listIdArr = listId.split("-");

      //get the actual id
      const id = parseInt(listIdArr[1]);
      //get the item
      const itemToEdit = ItemCtrl.getItemById(id);
      //set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  //update item submit
  const itemUpdateSubmit = function (e) {
    //get item input
    const input = UICtrl.getItemsInput();

    //update item
    const updateItem = ItemCtrl.updateItem(input.name, input.calories);
    //update UI
    UICtrl.updateListItem(updateItem);
    const totalCalories = ItemCtrl.getTotalCalories();
    //add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    //update local storage
    StorageCtrl.updateItemStorage(updateItem);
    UICtrl.clearEditState();
    e.preventDefault();
  };

  // Delete button event

  const itemDeleteSubmit = function (e) {
    //get current item
    const currentItem = ItemCtrl.getCurrentItem();

    //delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    //Delete from UI
    UICtrl.deleteListItem(currentItem.id);
    const totalCalories = ItemCtrl.getTotalCalories();
    //add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    UICtrl.clearEditState();
    //clear fields
    // UICtrl.clearInput();

    e.preventDefault();
  };

  //clear item event
  const clearAllItemClick = function () {
    //delete all items from data structure
    ItemCtrl.clearAllItems();
    const totalCalories = ItemCtrl.getTotalCalories();
    //add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    UICtrl.clearEditState();

    //remove from UI

    UICtrl.removeItems();

    //clear from local storage
    StorageCtrl.clearItemsFromStorage();

    //hide Ul
    UICtrl.hideList();
  };

  // Public methods
  return {
    init: function () {
      //clear edit state / set initial set
      UICtrl.clearEditState();
      //fetch items from data structure
      const items = ItemCtrl.getItems();

      //check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }

      //then populate list with items
      UICtrl.populateItemList(items);
      //get total calories

      const totalCalories = ItemCtrl.getTotalCalories();
      //add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      //load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App
App.init();
