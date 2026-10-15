const userTable = document.getElementById("userTable");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const statusFilter = document.getElementById("statusFilter");
const emptyMessage = document.getElementById("emptyMessage");

// Temporary frontend data.
// These users are examples, not actual registered hospital users.
const users = [];

const appointmentCount = document.getElementById("appointmentCount");

function updateSummary() {
    document.getElementById("patientCount").textContent =
        users.filter(function (user) {
            return user.role === "Patient";
        }).length;

    document.getElementById("doctorCount").textContent =
        users.filter(function (user) {
            return user.role === "Doctor";
        }).length;

    document.getElementById("accountantCount").textContent =
        users.filter(function (user) {
            return user.role === "Accountant";
        }).length;

    // Appointment data will be connected later.
    appointmentCount.textContent = "0";
}

function displayUsers() {
    userTable.replaceChildren();

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedRole = roleFilter.value;
    const selectedStatus = statusFilter.value;

    const filteredUsers = users.filter(function (user) {
        const matchesSearch =
            user.name.toLowerCase().includes(searchText) ||
            user.email.toLowerCase().includes(searchText);

        const matchesRole =
            selectedRole === "All" || user.role === selectedRole;

        const matchesStatus =
            selectedStatus === "All" || user.status === selectedStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    emptyMessage.style.display =
        filteredUsers.length === 0 ? "block" : "none";

    if (users.length === 0) {
        emptyMessage.textContent = "No users are available yet.";
    } else if (filteredUsers.length === 0) {
        emptyMessage.textContent = "No users match your search or filters.";
    }

    filteredUsers.forEach(function (user) {
        const row = document.createElement("tr");

        const values = [
            user.id,
            user.name,
            user.email
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const roleCell = document.createElement("td");
        const roleBadge = document.createElement("span");

        roleBadge.className = "role-badge";
        roleBadge.textContent = user.role;

        roleCell.appendChild(roleBadge);
        row.appendChild(roleCell);

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className = "user-status " +
            (user.status === "Active" ? "active-status" : "inactive-status");

        statusBadge.textContent = user.status;

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        const actionCell = document.createElement("td");
        const actionButton = document.createElement("button");

        actionButton.type = "button";
        actionButton.className = "table-action";

        if (user.status === "Active") {
            actionButton.textContent = "Deactivate";
            actionButton.classList.add("deactivate-btn");
        } else {
            actionButton.textContent = "Activate";
            actionButton.classList.add("activate-btn");
        }

        actionButton.addEventListener("click", function () {
            toggleUserStatus(user);
        });

        actionCell.appendChild(actionButton);
        row.appendChild(actionCell);

        userTable.appendChild(row);
    });

    updateSummary();
}

function toggleUserStatus(user) {
    if (user.role === "Admin") {
        alert("Administrator accounts cannot be changed from this demo.");
        return;
    }

    user.status = user.status === "Active" ? "Inactive" : "Active";

    displayUsers();
}

document.getElementById("addUserBtn").addEventListener("click", function () {
    const name = prompt("Enter the user's full name:");

    if (name === null) {
        return;
    }

    if (name.trim() === "") {
        alert("Please enter a name.");
        return;
    }

    const email = prompt("Enter the user's email address:");

    if (email === null) {
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        alert("Please enter a valid email address.");
        return;
    }

    const role = prompt(
        "Enter the user's role: Patient, Doctor, Accountant, or Admin"
    );

    if (role === null) {
        return;
    }

    const validRoles = ["Patient", "Doctor", "Accountant", "Admin"];

    const matchedRole = validRoles.find(function (validRole) {
        return validRole.toLowerCase() === role.trim().toLowerCase();
    });

    if (!matchedRole) {
        alert("Please enter a valid role.");
        return;
    }

    const emailExists = users.some(function (user) {
        return user.email.toLowerCase() === email.trim().toLowerCase();
    });

    if (emailExists) {
        alert("A user with this email already exists in this demo.");
        return;
    }

    const user = {
        id: "U" + String(Date.now()),
        name: name.trim(),
        email: email.trim(),
        role: matchedRole,
        status: "Active"
    };

    users.push(user);

    displayUsers();

    alert("The user was added to the temporary frontend list.");
});

searchInput.addEventListener("input", displayUsers);
roleFilter.addEventListener("change", displayUsers);
statusFilter.addEventListener("change", displayUsers);

document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "login.html";
});

displayUsers();