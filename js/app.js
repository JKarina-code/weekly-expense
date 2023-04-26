const expenseForm = document.querySelector("#add-expense");
const expenseList = document.querySelector("#expenses ul");

evenetListener();
function evenetListener() {
  document.addEventListener("DOMContentLoaded", budgetAsk);
  expenseForm.addEventListener("submit", expenseAdd);
}

class Budget {
  constructor(budget) {
    this.budget = Number(budget);
    this.residuary = Number(budget);
    this.expenses = [];
  }

  expenseNew(expense) {
    this.expenses = [...this.expenses, expense];
    this.residuaryCalculate();
  }
  residuaryCalculate() {
    const spent = this.expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    this.residuary = this.budget - spent;
  }
  deleteExpense(id) {
    this.expenses = this.expenses.filter((expense) => expense.id !== id);

    this.residuaryCalculate();
  }
}

class UI {
  budgetAdd(amount) {
    const { budget, residuary } = amount;
    document.querySelector("#total").textContent = budget;
    document.querySelector("#residuary").textContent = residuary;
  }
  alertPrint(message, type) {
    const divMessage = document.createElement("div");
    divMessage.classList.add("text-center", "alert");
    if (type === "error") {
      divMessage.classList.add("alert-danger");
    } else {
      divMessage.classList.add("alert-success");
    }

    divMessage.textContent = message;
    document.querySelector(".primary").insertBefore(divMessage, expenseForm);
    setTimeout(() => {
      divMessage.remove();
    }, 3000);
  }

  expenseAddList(expenses) {
    this.cleanHTML();
    expenses.forEach((expense) => {
      const { amount, expenseName, id } = expense;

      const newExpense = document.createElement("li");
      newExpense.className =
        "list-group-item d-flex justify-content-between align-items-center";
      //newExpense.setAttribute('data-id', id)
      newExpense.dataset.id = id;
      newExpense.innerHTML = `
      ${expenseName}
      <span class="badge badge-primary badge-pill">$ ${amount}</span>
  `;
      expenseList.appendChild(newExpense);

      const btnDelete = document.createElement("button");
      btnDelete.classList.add("btn", "btn-danger", "delete-expense");
      btnDelete.textContent = "Delete";
      btnDelete.onclick = () => deleteExpense(id);

      newExpense.appendChild(btnDelete);
    });
  }

  listUpdate(residuary) {
    document.querySelector("#residuary").textContent = residuary;
  }

  cleanHTML() {
    while (expenseList.firstChild) {
      expenseList.removeChild(expenseList.firstChild);
    }
  }

  checkingBudget(budgetObj) {
    const { budget, residuary } = budgetObj;
    const residuaryDiv = document.querySelector(".residuary");

    if (budget / 4 > residuary) {
      residuaryDiv.classList.remove("alert-success", "alert-warning");
      residuaryDiv.classList.add("alert-danger");
    } else if (budget / 2 > residuary) {
      residuaryDiv.classList.remove("alert-success");
      residuaryDiv.classList.add("alert-warning");
    } else {
      residuaryDiv.classList.remove("alert-danger", "alert-warning");
      residuaryDiv.classList.add("alert-success");
    }

    if (residuary <= 0) {
      ui.alertPrint(" The budget has run out", "error");
      expenseForm.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

const ui = new UI();

let budget;
function budgetAsk() {
  const userBudget = prompt("How much budget do you  have?");

  if (
    userBudget === "" ||
    userBudget === null ||
    isNaN(userBudget) ||
    userBudget <= 0
  ) {
    window.location.reload();
  }

  budget = new Budget(userBudget);

  ui.budgetAdd(budget);
}

function expenseAdd(e) {
  e.preventDefault();

  const expenseName = document.querySelector("#expense").value;
  const amount = Number(document.querySelector("#amount").value);

  if (expenseName === "" || amount === "") {
    ui.alertPrint("Both fields are required", "error");
    return;
  } else if (amount <= 0 || isNaN(amount)) {
    ui.alertPrint("Invalid amount", "error");

    return;
  }

  const expense = { expenseName, amount, id: Date.now() };
  budget.expenseNew(expense);

  ui.alertPrint("Expense added successfully");

  const { expenses } = budget;
  ui.expenseAddList(expenses);

  const { residuary } = budget;
  ui.listUpdate(residuary);

  ui.checkingBudget(budget);

  expenseForm.reset();
}

function deleteExpense(id) {
  budget.deleteExpense(id);
  const { expenses, residuary } = budget;
  ui.alertPrint("Expense deleted successfully");
  ui.expenseAddList(expenses);
  ui.listUpdate(residuary);
  ui.checkingBudget(budget);
}
