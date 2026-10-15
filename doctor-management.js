const doctorForm = document.getElementById("doctorForm");
const doctorModal = document.getElementById("doctorModal");
const deleteModal = document.getElementById("deleteModal");

const doctorTable = document.getElementById("doctorTable");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const availabilityFilter = document.getElementById("availabilityFilter");

const totalDoctors = document.getElementById("totalDoctors");
const availableDoctors = document.getElementById("availableDoctors");
const totalSpecializations = document.getElementById("totalSpecializations");

const formMessage = document.getElementById("formMessage");
const pageMessage = document.getElementById("pageMessage");

const doctors = [];

let nextDoctorId = 1;
let deleteDoctorId = null;

document.getElementById("addDoctorBtn").addEventListener("click", function () {
    doctorForm.reset();

    document.getElementById("doctorId").value = "";
    document.getElementById("modalTitle").textContent = "Add New Doctor";

    formMessage.textContent = "";
    formMessage.className = "form-message";

    doctorModal.classList.add("show");
});

function closeDoctorModal() {
    doctorModal.classList.remove("show");
    doctorForm.reset();
}

document.getElementById("closeModalBtn").addEventListener("click", closeDoctorModal);
document.getElementById("cancelBtn").addEventListener("click", closeDoctorModal);

function showPageMessage(message, type) {
    pageMessage.textContent = message;
    pageMessage.className = "page-message " + type;

    setTimeout(function () {
        pageMessage.textContent = "";
        pageMessage.className = "page-message";
    }, 3000);
}

function updateSummary() {
    totalDoctors.textContent = doctors.length;

    availableDoctors.textContent = doctors.filter(function (doctor) {
        return doctor.availability === "Available";
    }).length;

    const specializations = new Set(
        doctors.map(function (doctor) {
            return doctor.specialization;
        })
    );

    totalSpecializations.textContent = specializations.size;
}

function displayDoctors() {
    doctorTable.replaceChildren();

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedAvailability = availabilityFilter.value;

    const filteredDoctors = doctors.filter(function (doctor) {
        const matchesSearch =
            doctor.name.toLowerCase().includes(searchText) ||
            doctor.specialization.toLowerCase().includes(searchText) ||
            doctor.email.toLowerCase().includes(searchText);

        const matchesAvailability =
            selectedAvailability === "All" ||
            doctor.availability === selectedAvailability;

        return matchesSearch && matchesAvailability;
    });

    emptyMessage.style.display = filteredDoctors.length === 0 ? "block" : "none";

    if (doctors.length === 0) {
        emptyMessage.textContent =
            "No doctors added yet. Select \"Add Doctor\" to get started.";
    } else if (filteredDoctors.length === 0) {
        emptyMessage.textContent = "No doctors match your search.";
    }

    filteredDoctors.forEach(function (doctor) {
        const row = document.createElement("tr");

        const doctorCell = document.createElement("td");
        const doctorInfo = document.createElement("div");
        const avatar = document.createElement("div");
        const name = document.createElement("span");

        doctorInfo.className = "doctor-cell";
        avatar.className = "doctor-avatar";
        avatar.textContent = doctor.name.charAt(0).toUpperCase();

        name.className = "doctor-name";
        name.textContent = doctor.name;

        doctorInfo.appendChild(avatar);
        doctorInfo.appendChild(name);
        doctorCell.appendChild(doctorInfo);

        const specializationCell = document.createElement("td");
        specializationCell.textContent = doctor.specialization;

        const emailCell = document.createElement("td");
        emailCell.textContent = doctor.email;

        const phoneCell = document.createElement("td");
        phoneCell.textContent = doctor.phone;

        const availabilityCell = document.createElement("td");
        const badge = document.createElement("span");

        badge.className = "availability";

        if (doctor.availability === "Available") {
            badge.classList.add("available");
        } else {
            badge.classList.add("unavailable");
        }

        badge.textContent = doctor.availability;
        availabilityCell.appendChild(badge);

        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");

        actions.className = "action-buttons";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editDoctor(doctor.id);
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-btn";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function () {
            openDeleteModal(doctor.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(removeButton);
        actionsCell.appendChild(actions);

        row.appendChild(doctorCell);
        row.appendChild(specializationCell);
        row.appendChild(emailCell);
        row.appendChild(phoneCell);
        row.appendChild(availabilityCell);
        row.appendChild(actionsCell);

        doctorTable.appendChild(row);
    });

    updateSummary();
}

doctorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = document.getElementById("doctorId").value;
    const name = document.getElementById("doctorName").value.trim();
    const specialization = document.getElementById("doctorSpecialization").value;
    const email = document.getElementById("doctorEmail").value.trim();
    const phone = document.getElementById("doctorPhone").value.trim();
    const availability = document.getElementById("doctorAvailability").value;

    if (!/^[0-9]{10}$/.test(phone)) {
        formMessage.textContent = "Please enter a valid 10-digit phone number.";
        formMessage.className = "form-message error-message";
        return;
    }

    const duplicateEmail = doctors.some(function (doctor) {
        return doctor.email.toLowerCase() === email.toLowerCase() &&
            doctor.id !== Number(id);
    });

    if (duplicateEmail) {
        formMessage.textContent = "A doctor with this email already exists.";
        formMessage.className = "form-message error-message";
        return;
    }

    if (id) {
        const doctor = doctors.find(function (item) {
            return item.id === Number(id);
        });

        if (doctor) {
            doctor.name = name;
            doctor.specialization = specialization;
            doctor.email = email;
            doctor.phone = phone;
            doctor.availability = availability;
        }

        closeDoctorModal();
        displayDoctors();
        showPageMessage("Doctor details updated successfully.", "success-message");

    } else {
        const newDoctor = {
            id: nextDoctorId++,
            name: name,
            specialization: specialization,
            email: email,
            phone: phone,
            availability: availability
        };

        doctors.push(newDoctor);

        closeDoctorModal();
        displayDoctors();
        showPageMessage("Doctor added successfully.", "success-message");
    }
});

function editDoctor(id) {
    const doctor = doctors.find(function (item) {
        return item.id === id;
    });

    if (!doctor) {
        return;
    }

    document.getElementById("doctorId").value = doctor.id;
    document.getElementById("doctorName").value = doctor.name;
    document.getElementById("doctorSpecialization").value = doctor.specialization;
    document.getElementById("doctorEmail").value = doctor.email;
    document.getElementById("doctorPhone").value = doctor.phone;
    document.getElementById("doctorAvailability").value = doctor.availability;

    document.getElementById("modalTitle").textContent = "Edit Doctor";

    formMessage.textContent = "";
    formMessage.className = "form-message";

    doctorModal.classList.add("show");
}

function openDeleteModal(id) {
    deleteDoctorId = id;
    deleteModal.classList.add("show");
}

function closeDeleteModal() {
    deleteModal.classList.remove("show");
    deleteDoctorId = null;
}

document.getElementById("cancelDeleteBtn").addEventListener("click", closeDeleteModal);

document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    if (deleteDoctorId === null) {
        return;
    }

    const index = doctors.findIndex(function (doctor) {
        return doctor.id === deleteDoctorId;
    });

    if (index !== -1) {
        doctors.splice(index, 1);
    }

    closeDeleteModal();
    displayDoctors();

    showPageMessage("Doctor removed from the current list.", "success-message");
});

searchInput.addEventListener("input", displayDoctors);
availabilityFilter.addEventListener("change", displayDoctors);

document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.removeItem("doctorName");
    sessionStorage.removeItem("doctorSpecialization");

    window.location.href = "login.html";
});

displayDoctors();