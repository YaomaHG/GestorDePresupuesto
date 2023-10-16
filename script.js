// Define variables
let categories = [];
let transactions = [];
let summaryData = [];

// Get DOM elements
const categoryList = document.getElementById('category-list');
const addCategoryForm = document.getElementById('add-category-form');
const transactionType = document.getElementById('transaction-type');
const transactionDescription = document.getElementById('transaction-description');
const transactionAmount = document.getElementById('transaction-amount');
const transactionDate = document.getElementById('transaction-date');
const transactionCategory = document.getElementById('transaction-category');
const transactionTable = document.getElementById('transaction-table').getElementsByTagName('tbody')[0];
const summaryForm = document.getElementById('summary-form');
const summaryTable = document.getElementById('summary-table').getElementsByTagName('tbody')[0];

// Add event listeners
addCategoryForm.addEventListener('submit', addCategory);
transactionType.addEventListener('change', updateTransactionCategoryOptions);
addTransactionForm.addEventListener('submit', addTransaction);
summaryForm.addEventListener('submit', showSummary);

// Define functions
function addCategory(event) {
    event.preventDefault();
    const categoryName = document.getElementById('category-name').value;
    if (categoryName) {
        categories.push({
            name: categoryName,
            budget: 0,
            transactions: []
        });
        updateCategoryList();
        updateTransactionCategoryOptions();
        document.getElementById('category-name').value = '';
    }
}

function updateCategoryList() {
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.textContent = category.name;
        categoryList.appendChild(categoryItem);
    });
}

function updateTransactionCategoryOptions() {
    transactionCategory.innerHTML = '';
    const selectedType = transactionType.value;
    categories.forEach(category => {
        if (selectedType === 'income' || category.budget > 0) {
            const categoryOption = document.createElement('option');
            categoryOption.value = category.name;
            categoryOption.textContent = category.name;
            transactionCategory.appendChild(categoryOption);
        }
    });
}

function addTransaction(event) {
    event.preventDefault();
    const selectedCategory = categories.find(category => category.name === transactionCategory.value);
    if (selectedCategory) {
        const transaction = {
            type: transactionType.value,
            description: transactionDescription.value,
            amount: parseFloat(transactionAmount.value),
            date: transactionDate.value,
            category: selectedCategory
        };
        transactions.push(transaction);
        selectedCategory.transactions.push(transaction);
        updateTransactionTable();
        updateSummaryData();
        document.getElementById('transaction-description').value = '';
        document.getElementById('transaction-amount').value = '';
        document.getElementById('transaction-date').value = '';
    }
}

function updateTransactionTable() {
    transactionTable.innerHTML = '';
    transactions.forEach(transaction => {
        const row = transactionTable.insertRow();
        row.insertCell().textContent = transaction.date;
        row.insertCell().textContent = transaction.description;
        row.insertCell().textContent = transaction.amount.toFixed(2);
        row.insertCell().textContent = transaction.category.name;
    });
}

function showSummary(event) {
    event.preventDefault();
    const startDate = new Date(summaryStartDate.value);
    const endDate = new Date(summaryEndDate.value);
    summaryData = [];
    categories.forEach(category => {
        const categorySummary = {
            category: category.name,
            income: 0,
            expense: 0,
            balance: 0
        };
        category.transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            if (transactionDate >= startDate && transactionDate <= endDate) {
                if (transaction.type === 'income') {
                    categorySummary.income += transaction.amount;
                } else {
                    categorySummary.expense += transaction.amount;
                }
            }
        });
        categorySummary.balance = categorySummary.income - categorySummary.expense;
        summaryData.push(categorySummary);
    });
    updateSummaryTable();
}

function updateSummaryTable() {
    summaryTable.innerHTML = '';
    summaryData.forEach(categorySummary => {
        const row = summaryTable.insertRow();
        row.insertCell().textContent = categorySummary.category;
        row.insertCell().textContent = categorySummary.income.toFixed(2);
        row.insertCell().textContent = categorySummary.expense.toFixed(2);
        row.insertCell().textContent = categorySummary.balance.toFixed(2);
    });
}

// Export data
function exportData(format) {
    let data = '';
    if (format === 'csv') {
        data += 'Categoría,Ingresos,Gastos,Balance\n';
        summaryData.forEach(categorySummary => {
            data += `${categorySummary.category},${categorySummary.income.toFixed(2)},${categorySummary.expense.toFixed(2)},${categorySummary.balance.toFixed(2)}\n`;
        });
    } else if (format === 'pdf') {
        // Code to export data as PDF
    }
    return data;
}

// Set up budget limit notifications
categories.forEach(category => {
    Object.defineProperty(category, 'budget', {
        get: function() {
            return this._budget;
        },
        set: function(value) {
            this._budget = value;
            if (this.balance < 0) {
                console.log(`¡Cuidado! La categoría ${this.name} ha excedido su presupuesto.`);
            }
        }
    });
});

// Example usage
addCategory({ preventDefault: function() {} });
addCategory({ preventDefault: function() {} });
categories[0].budget = 100;
categories[1].budget = 50;
addTransaction({ preventDefault: function() {} });
addTransaction({ preventDefault: function() {} });
addTransaction({ preventDefault: function() {} });
addTransaction({ preventDefault: function() {} });
addTransaction({ preventDefault: function() {} });
addTransaction({ preventDefault: function() {} });
addTransaction({ preventDefault: function() {} });
addTransaction({ preventDefault: function() {} });
addTransaction({ preventDefault: function() {} });
addTransaction({ preventDefault: function() {} });
addTransaction({ preventDefault: function() {} });
addTransaction({ preventDefault: function() {} });
categories[0].budget = 200;
console.log(exportData('csv'));
