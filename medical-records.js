const recordsTable = document.getElementById("recordsTable");
const searchInput = document.getElementById("searchInput");
const recordTypeFilter = document.getElementById("recordTypeFilter");

const totalRecords = document.getElementById("totalRecords");
const prescriptionCount = document.getElementById("prescriptionCount");
const visitCount = document.getElementById("visitCount");

const emptyMessage = document.getElementById("emptyMessage");
const prescriptionList = document.getElementById("prescriptionList");
const prescriptionEmpty = document.getElementById("prescriptionEmpty");

// Temporary sample data.
// Real patient records will be loaded from MySQL later.
const medicalRecords = [];

function updateSummary() {
    totalRecords.textContent = medicalRecords.length;

    prescriptionCount.textContent = medicalRecords.filter(function (record) {
        return record.type === "Prescription";
    }).length;

    visitCount.textContent = medicalRecords.filter(function (record) {
        return record.type === "Consultation";
    }).length;
}

function displayRecords() {
    recordsTable.replaceChildren();

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedType = recordTypeFilter.value;

    const filteredRecords = medicalRecords.filter(function (record) {
        const matchesSearch =
            record.diagnosis.toLowerCase().includes(searchText) ||
            record.doctor.toLowerCase().includes(searchText) ||
            record.id.toLowerCase().includes(searchText);

        const matchesType =
            selectedType === "All" || record.type === selectedType;

        return matchesSearch && matchesType;
    });

    emptyMessage.style.display =
        filteredRecords.length === 0 ? "block" : "none";

    if (medicalRecords.length === 0) {
        emptyMessage.textContent = "No medical records are available yet.";
    } else if (filteredRecords.length === 0) {
        emptyMessage.textContent = "No records match your search.";
    }

    filteredRecords.forEach(function (record) {
        const row = document.createElement("tr");

        const values = [
            record.id,
            record.date,
            record.doctor,
            record.diagnosis
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const typeCell = document.createElement("td");
        const typeBadge = document.createElement("span");

        typeBadge.className = "type-badge";
        typeBadge.textContent = record.type;

        typeCell.appendChild(typeBadge);
        row.appendChild(typeCell);

        const detailsCell = document.createElement("td");
        const detailsButton = document.createElement("button");

        detailsButton.type = "button";
        detailsButton.className = "details-btn";
        detailsButton.textContent = "View Details";

        detailsButton.addEventListener("click", function () {
            showRecordDetails(record);
        });

        detailsCell.appendChild(detailsButton);
        row.appendChild(detailsCell);

        recordsTable.appendChild(row);
    });

    updateSummary();
    displayPrescriptions();
}

function displayPrescriptions() {
    prescriptionList.replaceChildren();

    const prescriptions = medicalRecords.filter(function (record) {
        return record.type === "Prescription";
    });

    prescriptionEmpty.style.display =
        prescriptions.length === 0 ? "block" : "none";

    prescriptions.forEach(function (record) {
        const card = document.createElement("div");
        card.className = "prescription-card";

        const title = document.createElement("h3");
        title.textContent = record.diagnosis;

        const date = document.createElement("p");
        date.className = "prescription-date";
        date.textContent = "Date: " + record.date;

        const doctor = document.createElement("p");
        doctor.textContent = "Doctor: " + record.doctor;

        const details = document.createElement("p");
        details.textContent = "Details: " + record.details;

        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(doctor);
        card.appendChild(details);

        prescriptionList.appendChild(card);
    });
}

function showRecordDetails(record) {
    const modal = document.createElement("div");
    modal.className = "modal show";

    const content = document.createElement("div");
    content.className = "modal-content";

    const header = document.createElement("div");
    header.className = "modal-header";

    const title = document.createElement("h2");
    title.textContent = "Medical Record Details";

    const closeButton = document.createElement("button");
    closeButton.className = "close-btn";
    closeButton.type = "button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "Close details");

    closeButton.addEventListener("click", function () {
        modal.remove();
    });

    header.appendChild(title);
    header.appendChild(closeButton);
    content.appendChild(header);

    const details = [
        ["Record ID", record.id],
        ["Date", record.date],
        ["Doctor", record.doctor],
        ["Diagnosis", record.diagnosis],
        ["Record Type", record.type],
        ["Details", record.details]
    ];

    details.forEach(function (item) {
        const paragraph = document.createElement("p");
        const label = document.createElement("strong");

        label.textContent = item[0] + ": ";

        paragraph.appendChild(label);
        paragraph.appendChild(document.createTextNode(item[1]));

        content.appendChild(paragraph);
    });

    modal.appendChild(content);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.remove();
        }
    });

    document.body.appendChild(modal);
}

searchInput.addEventListener("input", displayRecords);
recordTypeFilter.addEventListener("change", displayRecords);

document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "login.html";
});

displayRecords();