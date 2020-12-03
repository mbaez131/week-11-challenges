// BUDGET CONTROLLER
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
    /*
    0
    [200, 400, 100]
    sum = 0 + 200
    sum = 200 + 400
    sum = 600 + 100 = 700
    */
  };

  // var allExpenses = [];
  // var allIncomes = [];
  // var totalExpenses = 0;

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      // [1 2 3 4 5], next ID = 6
      // [1 2 4 6 8], next ID = 9
      // ID = last ID + 1

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id;
      } else {
        ID = 0;
      }
      // Create new item based on "inc" or "exp" type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      // Push it into our data structure
      data.allItems[type].push(newItem);
      // Return the new element
      return newItem;
    },

    deleteItem: function (type, id) {
      var ids, index;

      // id = 6
      //data.allItems[type][id];
      //ids = [1 2 4 6 8]
      // index = 3

      var ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of the income that was spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
      // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 *100
    },

    calculatePercentages: function () {
      /*
      a=20
      b=10
      c=40
      income = 100
      a=20/100=20%
      b=10/100=10%
      c=40/100=40%
      */
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();

// UI CONTROLLER
var UIController = (function () {
  // Making an object to store all strings being used so if need be you can change them in one place
  var domStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var formatNumber = function (num, type) {
    var numSplit, int, dec;
    /*
    + or - before number
    exactly 2 decimal points
    comma seperating the thousands

    2310.4567 -> + 2,310.46
    2000 -> + 2,000.00
    */
  //  Make this function work for any number. Breaks after 7 integers. 

    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");

    int = numSplit[0];
    let number = int

const addCommas = num => {
  let commer = int.split("")
  commer = commer.reverse()
  commer = commer.map((i, index) => {
    if((index) % 3 || index === 0){
      return i
    } else {
      return `${i},`
    }
  })
  commer = commer.reverse()
  commer = commer.join("")
  return commer
}
console.log((1 + 2) % 3)
  
    // if (int.length > 3) {
    //   int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3); // input 23510, output 23,510
    // }

    dec = numSplit[1];

    type === "exp" ? (sign = "-") : (sign = "+");

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  return {
    getInput: function () {
      return {
        // Will either be inc or exp
        type: document.querySelector(domStrings.inputType).value,
        description: document.querySelector(domStrings.inputDescription).value,
        value: parseFloat(document.querySelector(domStrings.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
      var html, newHtml, element;
      newHtml;
      // Create HTML string with placeholder text
      if (type === "inc") {
        element = domStrings.incomeContainer;

        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = domStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Replace the placeholder text with actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        domStrings.inputDescription + ", " + domStrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },

    alertBudget: function (obj) {
      if(obj.budget < obj.totalExp){
        alert("You are over budget sir.")
      }
      this.alertBudget()
    },
    
    displayBudget: function (obj) {
      var type;
      obj.budget >= 0 ? (type = "inc") : (type = "exp");
      document.querySelector(domStrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(domStrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        domStrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, "exp");
      document.querySelector(domStrings.percentageLabel).textContent =
        obj.percentage;

      if (obj.percentage > 0) {
        document.querySelector(domStrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(domStrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(domStrings.expensesPercLabel);

      var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };
      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    displayMonth: function() {
      var now, month, year, months;

      now = new Date();
      //var christmas = new Date(2016, 11, 25);
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(domStrings.dateLabel).textContent = months[month] + ' ' + year;
    },
  


    getDomStrings: function () {
      return domStrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UIController.getDomStrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updatePercentages = function () {
    // Calculate Percentages
    budgetCtrl.calculatePercentages();
    // Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    // Update the UI with the new percentages
    UIController.displayPercentages(percentages);
  };

  var updateBudget = function () {
    // 1. Calculate the budget
    budgetController.calculateBudget();
    // 2. Return the budget
    var budget = budgetController.getBudget();
    // 5. Display the budget on the UI
    UIController.displayBudget(budget);
  };

  var ctrlAddItem = function () {
    var input, newItem;
    // 1. Get the field input data
    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      UIController.addListItem(newItem, input.type);
      // 4. Clear the fields
      UIController.clearFields();

      // 5. Calculate and update budget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemId, splitID, type, ID;
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemId) {
      //inc-1
      splitID = itemId.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete the item from the data structure
      budgetController.deleteItem(type, ID);
      // 2. Delete the item from the UI
      UIController.deleteListItem(itemId);
      // 3. Update and show the new budget
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("Application has started");
      UIController.displayMonth();
      UIController.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
