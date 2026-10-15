// Get dashboard elements
const patientName = document.getElementById("patientName");
const welcomeName = document.getElementById("welcomeName");
const upcomingCount = document.getElementById("upcomingCount");
const recordsCount = document.getElementById("recordsCount");
const pendingCount = document.getElementById("pendingCount");
const appointmentTable = document.getElementById("appointmentTable");
const logoutBtn = document.getElementById("logoutBtn");

// Sample information for frontend testing
let appointments = [];
const medicalRecords = [];

// Display the patient's name
const savedName = null;

if (savedName) {
    patientName.textContent = savedName;
    welcomeName.textContent = savedName.split(" ")[0];
}

// Update dashboard summary cards
function updateSummary() {
    upcomingCount.textContent = appointments.filter(
        appointment => appointment.status !== "Cancelled"
    ).length;

    recordsCount.textContent = medicalRecords.length;

    pendingCount.textContent = appointments.filter(
        appointment => appointment.status === "Pending"
    ).length;
}

// Display appointments
function displayAppointments() {
    appointmentTable.replaceChildren();

    if (appointments.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.className = "empty-message";
        cell.textContent =
            "No appointments to display yet. Book an appointment to get started.";

        row.appendChild(cell);
        appointmentTable.appendChild(row);
        return;
    }

    appointments.forEach(function (appointment) {
        const row = document.createElement("tr");

        [
            appointment.doctor,
            appointment.specialization,
            appointment.date,
            appointment.time,
            appointment.status
        ].forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        appointmentTable.appendChild(row);
    });
}

// Log out of this device without deleting the saved account or appointments.
logoutBtn.addEventListener('click',async()=>{await fetch('api/logout',{method:'POST'});window.location.assign('login.html');});
async function loadDashboard(){
 try{
  const userResponse=await fetch('api/me');
  if(!userResponse.ok){window.location.replace('login.html');return;}
  const {user}=await userResponse.json();
  patientName.textContent=user.fullName;welcomeName.textContent=user.fullName.split(' ')[0];
  const response=await fetch('api/appointments');
  if(response.ok){const result=await response.json();appointments=result.appointments;}
  updateSummary();displayAppointments();
 }catch(err){console.error('Could not load account',err);}
}
loadDashboard();
