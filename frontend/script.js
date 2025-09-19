const API_URL = "http://localhost:3000";
let currentUser = null;
let editingExpenseId = null;

// Show/hide sections
function showPage(pageId) {
    document.getElementById('authPage').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById(pageId).classList.remove('hidden');
}

function showSignup() {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("signup").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("signup").classList.add("hidden");
    document.getElementById("login").classList.remove("hidden");
}

// Signup
async function signup() {
    const u = document.getElementById("signupUsername").value;
    const e = document.getElementById("signupEmail").value;
    const p = document.getElementById("signupPassword").value;
    if (!u || !e || !p) return alert("Fill all fields");

    const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, email: e, password: p })
    });

    if (res.ok) {
        alert("Signup successful! Please login.");
        showLogin();
    } else {
        alert("Signup failed!");
    }
}

// Login
async function login() {
    const u = document.getElementById("loginUsername").value;
    const p = document.getElementById("loginPassword").value;
    const res = await fetch(`${API_URL}/users?username=${u}&password=${p}`);
    const users = await res.json();

    if (users.length > 0) {
        currentUser = users[0];
        localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
        showPage("dashboard");
        loadExpenses();
    } else {
        alert("Invalid credentials!");
    }
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", function() {
    localStorage.removeItem("loggedInUser");
    currentUser = null;
    showPage("authPage");
});

// Load on refresh
window.onload = function() {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showPage("dashboard");
        loadExpenses();
    }
};

// Add Expense
async function addExpense() {
    const title = document.getElementById("expenseTitle").value;
    const amount = document.getElementById("expenseAmount").value;
    const date = document.getElementById("expenseDate").value;

    if (!title || !amount || !date) return alert("Fill all fields");

    await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            amount: parseFloat(amount),
            date,
            userId: currentUser.id
        })
    });

    document.getElementById("expenseTitle").value = "";
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseDate").value = "";
    loadExpenses();
}

// Load Expenses
async function loadExpenses() {
    const res = await fetch(`${API_URL}/expenses?userId=${currentUser.id}`);
    const expenses = await res.json();

    const tbody = document.getElementById("expenseTable");
    tbody.innerHTML = "";
    expenses.forEach(exp => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${exp.title}</td>
            <td>$${exp.amount.toFixed(2)}</td>
            <td>${exp.date}</td>
            <td>
                <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
                <button class="edit-btn" onclick='editExpense(${JSON.stringify(exp)})'>Edit</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    drawCharts(expenses);
}

// Delete Expense
async function deleteExpense(id) {
    await fetch(`${API_URL}/expenses/${id}`, { method: "DELETE" });
    loadExpenses();
}

// Edit Expense
function editExpense(expense) {
    editingExpenseId = expense.id;
    document.getElementById("editTitle").value = expense.title;
    document.getElementById("editAmount").value = expense.amount;
    document.getElementById("editDate").value = expense.date;
    document.getElementById("editForm").classList.remove("hidden");
}

// Cancel Edit
function cancelEdit() {
    editingExpenseId = null;
    document.getElementById("editForm").classList.add("hidden");
}

// Update Expense
async function updateExpense() {
    const title = document.getElementById("editTitle").value;
    const amount = document.getElementById("editAmount").value;
    const date = document.getElementById("editDate").value;

    if (!title || !amount || !date) return alert("Fill all fields");

    await fetch(`${API_URL}/expenses/${editingExpenseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            amount: parseFloat(amount),
            date,
            userId: currentUser.id
        })
    });

    cancelEdit();
    loadExpenses();
}

// Charting
let totalChartObj;
let avgChartObj;

function drawCharts(expenses) {
    const monthlyTotals = {};
    const monthlyCounts = {};

    expenses.forEach(exp => {
        const month = exp.date.substring(0, 7); // YYYY-MM
        const amount = exp.amount;

        if (!monthlyTotals[month]) {
            monthlyTotals[month] = 0;
            monthlyCounts[month] = 0;
        }
        monthlyTotals[month] += amount;
        monthlyCounts[month] += 1;
    });

    const monthlyAverages = {};
    for (const month in monthlyTotals) {
        monthlyAverages[month] = monthlyTotals[month] / monthlyCounts[month];
    }
    
    // Destroy old charts to prevent redraw errors
    if (totalChartObj) totalChartObj.destroy();
    if (avgChartObj) avgChartObj.destroy();

    // Monthly Total Chart (Bar)
    const totalCtx = document.getElementById("totalChart").getContext("2d");
    totalChartObj = new Chart(totalCtx, {
        type: "bar",
        data: {
            labels: Object.keys(monthlyTotals).sort(),
            datasets: [{
                label: "Total Expenses per Month",
                data: Object.values(monthlyTotals),
                backgroundColor: "#7cf5ff"
            }]
        }
    });

    // Monthly Average Chart (Pie)
    const avgCtx = document.getElementById("avgChart").getContext("2d");
    avgChartObj = new Chart(avgCtx, {
        type: "pie",
        data: {
            labels: Object.keys(monthlyAverages).sort(),
            datasets: [{
                data: Object.values(monthlyAverages),
                backgroundColor: ["#ff6ad5", "#7b6cff", "#7cf5ff", "#ffe66d", "#a3ffb0"]
            }]
        }
    });
}