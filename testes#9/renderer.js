const { ipcRenderer } = require('electron');
let balanceChart, expenseChart, monthlyChart;

// Initialize charts
function initializeCharts() {
    balanceChart = new Chart(document.getElementById('balanceChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Account Balance History',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    expenseChart = new Chart(document.getElementById('expenseChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    monthlyChart = new Chart(document.getElementById('monthlyChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#4BC0C0', '#FF6384']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Account Management
async function saveAccount() {
    const name = document.getElementById('accountName').value;
    const type = document.getElementById('accountType').value;
    const balance = parseFloat(document.getElementById('initialBalance').value);
    
    const account = {
        name: name,
        type: type,
        balance: balance,
        currency: 'USD'
    };

    await ipcRenderer.invoke('add-account', account);
    loadDashboardData();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addAccountModal'));
    modal.hide();
}

// Transaction Management
async function addTransaction() {
    const accountId = document.getElementById('transactionAccount').value;
    const type = document.getElementById('transactionType').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const description = document.getElementById('transactionDescription').value;
    const category = document.getElementById('transactionCategory').value;

    const transaction = {
        accountId: parseInt(accountId),
        type: type,
        amount: amount,
        description: description,
        category: category,
        date: new Date().toISOString()
    };

    await ipcRenderer.invoke('add-transaction', transaction);
    loadTransactions();
    updateCharts();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTransactionModal'));
    modal.hide();
}

async function loadTransactions() {
    const transactions = await ipcRenderer.invoke('get-transactions');
    const transactionsList = document.getElementById('transactionsList');
    
    transactionsList.innerHTML = transactions.map(t => `
        <div class="transaction-item ${t.type}">
            <div class="d-flex justify-content-between">
                <strong>${t.description}</strong>
                <span>${t.type === 'income' ? '+' : '-'}$${Math.abs(t.amount).toFixed(2)}</span>
            </div>
            <div class="text-muted small">${new Date(t.date).toLocaleDateString()} - ${t.category}</div>
        </div>
    `).join('');
}

async function updateCharts() {
    const transactions = await ipcRenderer.invoke('get-transactions');
    const accounts = await ipcRenderer.invoke('get-accounts');
    
    // Update Balance Chart
    const balanceData = accounts.map(a => a.balance);
    const accountLabels = accounts.map(a => a.name);
    balanceChart.data.labels = accountLabels;
    balanceChart.data.datasets[0].data = balanceData;
    balanceChart.update();

    // Update Expense Chart
    const categories = {};
    transactions.forEach(t => {
        if (t.type === 'expense') {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        }
    });
    expenseChart.data.labels = Object.keys(categories);
    expenseChart.data.datasets[0].data = Object.values(categories);
    expenseChart.update();

    // Update Monthly Chart
    const monthlyData = {
        income: Array(6).fill(0),
        expense: Array(6).fill(0)
    };
    
    transactions.forEach(t => {
        const month = new Date(t.date).getMonth();
        if (month < 6) {
            if (t.type === 'income') {
                monthlyData.income[month] += t.amount;
            } else {
                monthlyData.expense[month] += Math.abs(t.amount);
            }
        }
    });

    monthlyChart.data.datasets[0].data = monthlyData.income;
    monthlyChart.data.datasets[1].data = monthlyData.expense;
    monthlyChart.update();
}
// Modal handling functions
function showAddAccountModal() {
    document.getElementById('accountForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('addAccountModal'));
    modal.show();
}

function showAddTransactionModal() {
    document.getElementById('transactionForm').reset();
    updateAccountSelect();
    const modal = new bootstrap.Modal(document.getElementById('addTransactionModal'));
    modal.show();
}

async function updateAccountSelect() {
    const accounts = await ipcRenderer.invoke('get-accounts');
    const select = document.getElementById('transactionAccount');
    select.innerHTML = accounts.map(account => 
        `<option value="${account.id}">${account.name} (Balance: $${account.balance.toFixed(2)})</option>`
    ).join('');
}

async function saveAccount() {
    const nameInput = document.getElementById('accountName');
    const typeInput = document.getElementById('accountType');
    const balanceInput = document.getElementById('initialBalance');

    if (!nameInput.value || !balanceInput.value) {
        alert('Please fill in all required fields');
        return;
    }

    const account = {
        name: nameInput.value,
        type: typeInput.value,
        balance: parseFloat(balanceInput.value),
        currency: 'USD'
    };

    try {
        await ipcRenderer.invoke('add-account', account);
        const modal = bootstrap.Modal.getInstance(document.getElementById('addAccountModal'));
        modal.hide();
        document.getElementById('accountForm').reset();
        updateDashboard();
    } catch (error) {
        alert('Error adding account: ' + error.message);
    }
}

async function addTransaction() {
    const accountInput = document.getElementById('transactionAccount');
    const typeInput = document.getElementById('transactionType');
    const amountInput = document.getElementById('transactionAmount');
    const descriptionInput = document.getElementById('transactionDescription');
    const categoryInput = document.getElementById('transactionCategory');

    if (!accountInput.value || !amountInput.value || !descriptionInput.value) {
        alert('Please fill in all required fields');
        return;
    }

    const transaction = {
        accountId: parseInt(accountInput.value),
        type: typeInput.value,
        amount: parseFloat(amountInput.value),
        description: descriptionInput.value,
        category: categoryInput.value,
        date: new Date().toISOString()
    };

    try {
        await ipcRenderer.invoke('add-transaction', transaction);
        const modal = bootstrap.Modal.getInstance(document.getElementById('addTransactionModal'));
        modal.hide();
        document.getElementById('transactionForm').reset();
        updateDashboard();
    } catch (error) {
        alert('Error adding transaction: ' + error.message);
    }
}

// Add event listeners when document loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    updateDashboard();
    // Add button event listeners
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-bs-target');
            if (target === '#addAccountModal') {
                showAddAccountModal();
            } else if (target === '#addTransactionModal') {
                showAddTransactionModal();
            }
        });
    });

    // Form submission prevention
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    });
});