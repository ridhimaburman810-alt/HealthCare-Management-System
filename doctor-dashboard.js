const doctorName = document.getElementById("doctorName");
const profileName = document.getElementById("profileName");
const specialization = document.getElementById("specialization");

const todayCount = document.getElementById("todayCount");
const patientCount = document.getElementById("patientCount");
const pendingCount = document.getElementById("pendingCount");

const appointmentTable = document.getElementById("appointmentTable");
const logoutBtn = document.getElementById("logoutBtn");

// Sample data for the frontend demonstration
const appointments = [];
const patients = [];

const savedName = sessionStorage.getItem("doctorName");
const savedSpecialization = sessionStorage.getItem("doctorSpecialization");

if (savedName) {
    doctorName.textContent = savedName;
    profileName.textContent = savedName;
}

if (savedSpecialization) {
    specialization.textContent = savedSpecialization;
}

function updateSummary() {
    todayCount.textContent = appointments.length;
    patientCount.textContent = patients.length;

    const pendingAppointments = appointments.filter(function (appointment) {
        return appointment.status === "Pending";
    });

    pendingCount.textContent = pendingAppointments.length;
}

function displayAppointments() {
    appointmentTable.replaceChildren();

    if (appointments.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 4;
        cell.className = "empty-message";
        cell.textContent = "No appointments scheduled yet.";

        row.appendChild(cell);
        appointmentTable.appendChild(row);

        return;
    }

    appointments.forEach(function (appointment) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = appointment.patientName;

        const timeCell = document.createElement("td");
        timeCell.textContent = appointment.time;

        const reasonCell = document.createElement("td");
        reasonCell.textContent = appointment.reason;

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.textContent = appointment.status;
        statusBadge.className = "status";

        if (appointment.status === "Confirmed") {
            statusBadge.classList.add("confirmed");
        } else {
            statusBadge.classList.add("pending");
        }

        statusCell.appendChild(statusBadge);

        row.appendChild(nameCell);
        row.appendChild(timeCell);
        row.appendChild(reasonCell);
        row.appendChild(statusCell);

        appointmentTable.appendChild(row);
    });
}

logoutBtn.addEventListener("click", function () {
    sessionStorage.removeItem("doctorName");
    sessionStorage.removeItem("doctorSpecialization");

    window.location.href = "login.html";
});

updateSummary();
displayAppointments();