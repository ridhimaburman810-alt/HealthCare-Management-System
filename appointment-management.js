const appointmentTable = document.getElementById("appointmentTable");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const dateFilter = document.getElementById("dateFilter");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const confirmedCount = document.getElementById("confirmedCount");
const completedCount = document.getElementById("completedCount");

// Temporary sample data for frontend testing.
const appointments = [];

function updateSummary() {
    totalCount.textContent = appointments.length;

    pendingCount.textContent = appointments.filter(function (appointment) {
        return appointment.status === "Pending";
    }).length;

    confirmedCount.textContent = appointments.filter(function (appointment) {
        return appointment.status === "Confirmed";
    }).length;

    completedCount.textContent = appointments.filter(function (appointment) {
        return appointment.status === "Completed";
    }).length;
}

function displayAppointments() {
    appointmentTable.replaceChildren();

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;
    const selectedDate = dateFilter.value;

    const filteredAppointments = appointments.filter(function (appointment) {
        const matchesSearch =
            appointment.patientName.toLowerCase().includes(searchText) ||
            appointment.doctor.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            appointment.status === selectedStatus;

        const matchesDate =
            selectedDate === "" ||
            appointment.date === selectedDate;

        return matchesSearch && matchesStatus && matchesDate;
    });

    emptyMessage.style.display =
        filteredAppointments.length === 0 ? "block" : "none";

    if (appointments.length === 0) {
        emptyMessage.textContent = "No appointments available yet.";
    } else if (filteredAppointments.length === 0) {
        emptyMessage.textContent = "No appointments match your filters.";
    }

    filteredAppointments.forEach(function (appointment) {
        const row = document.createElement("tr");

        const values = [
            appointment.patientName,
            appointment.doctor,
            appointment.specialization,
            appointment.date,
            appointment.time,
            appointment.reason
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const badge = document.createElement("span");

        badge.className = "status status-" + appointment.status.toLowerCase();
        badge.textContent = appointment.status;

        statusCell.appendChild(badge);
        row.appendChild(statusCell);

        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");

        actions.className = "action-buttons";

        if (appointment.status === "Pending") {
            const confirmButton = document.createElement("button");

            confirmButton.type = "button";
            confirmButton.className = "action-btn confirm-btn";
            confirmButton.textContent = "Confirm";

            confirmButton.addEventListener("click", function () {
                updateStatus(appointment, "Confirmed");
            });

            actions.appendChild(confirmButton);
        }

        if (appointment.status === "Confirmed") {
            const completeButton = document.createElement("button");

            completeButton.type = "button";
            completeButton.className = "action-btn complete-btn";
            completeButton.textContent = "Complete";

            completeButton.addEventListener("click", function () {
                updateStatus(appointment, "Completed");
            });

            actions.appendChild(completeButton);
        }

        if (
            appointment.status === "Pending" ||
            appointment.status === "Confirmed"
        ) {
            const cancelButton = document.createElement("button");

            cancelButton.type = "button";
            cancelButton.className = "action-btn cancel-btn";
            cancelButton.textContent = "Cancel";

            cancelButton.addEventListener("click", function () {
                updateStatus(appointment, "Cancelled");
            });

            actions.appendChild(cancelButton);
        }

        actionsCell.appendChild(actions);
        row.appendChild(actionsCell);

        appointmentTable.appendChild(row);
    });

    updateSummary();
}

function updateStatus(appointment, newStatus) {
    appointment.status = newStatus;
    displayAppointments();
}

searchInput.addEventListener("input", displayAppointments);
statusFilter.addEventListener("change", displayAppointments);
dateFilter.addEventListener("change", displayAppointments);

document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "login.html";
});

displayAppointments();