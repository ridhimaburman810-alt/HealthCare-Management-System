const medicineTable = document.getElementById("medicineTable");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const stockFilter = document.getElementById("stockFilter");

const totalMedicines = document.getElementById("totalMedicines");
const totalStock = document.getElementById("totalStock");
const lowStockCount = document.getElementById("lowStockCount");
const expiredCount = document.getElementById("expiredCount");

const emptyMessage = document.getElementById("emptyMessage");
const alertSection = document.getElementById("alertSection");
const alertList = document.getElementById("alertList");

const billingMedicine = document.getElementById("billingMedicine");
const medicineQuantity = document.getElementById("medicineQuantity");
const billingResult = document.getElementById("billingResult");

const LOW_STOCK_LIMIT = 10;

// Temporary frontend inventory.
const medicines = [];

let editingMedicineId = null;

function getToday() {
    const today = new Date();

    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");
}

function isExpired(medicine) {
    return medicine.expiryDate < getToday();
}

function getMedicineStatus(medicine) {
    if (isExpired(medicine)) {
        return {
            text: "Expired",
            className: "stock-expired"
        };
    }

    if (medicine.stock === 0) {
        return {
            text: "Out of Stock",
            className: "stock-out"
        };
    }

    if (medicine.stock <= LOW_STOCK_LIMIT) {
        return {
            text: "Low Stock",
            className: "stock-low"
        };
    }

    return {
        text: "Available",
        className: "stock-available"
    };
}

function updateSummary() {
    totalMedicines.textContent = medicines.length;

    totalStock.textContent = medicines.reduce(function (total, medicine) {
        return total + medicine.stock;
    }, 0);

    lowStockCount.textContent = medicines.filter(function (medicine) {
        return !isExpired(medicine) &&
            medicine.stock > 0 &&
            medicine.stock <= LOW_STOCK_LIMIT;
    }).length;

    expiredCount.textContent = medicines.filter(function (medicine) {
        return isExpired(medicine);
    }).length;
}

function displayAlerts() {
    alertList.replaceChildren();

    const alerts = [];

    medicines.forEach(function (medicine) {
        if (isExpired(medicine)) {
            alerts.push(medicine.name + " has expired. Do not dispense it.");
        } else if (medicine.stock === 0) {
            alerts.push(medicine.name + " is out of stock.");
        } else if (medicine.stock <= LOW_STOCK_LIMIT) {
            alerts.push(
                medicine.name + " has only " + medicine.stock +
                " units remaining."
            );
        }
    });

    alertSection.style.display = alerts.length > 0 ? "block" : "none";

    alerts.forEach(function (message) {
        const paragraph = document.createElement("p");

        paragraph.className = "alert-item";
        paragraph.textContent = "• " + message;

        alertList.appendChild(paragraph);
    });
}

function updateBillingMedicineList() {
    const selectedValue = billingMedicine.value;

    billingMedicine.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select medicine";

    billingMedicine.appendChild(defaultOption);

    medicines.forEach(function (medicine) {
        if (medicine.stock > 0 && !isExpired(medicine)) {
            const option = document.createElement("option");

            option.value = medicine.id;
            option.textContent = medicine.name + " — ₹" +
                medicine.price.toFixed(2) + " per unit";

            billingMedicine.appendChild(option);
        }
    });

    const matchingOption = Array.from(billingMedicine.options).find(
        function (option) {
            return option.value === selectedValue;
        }
    );

    if (matchingOption) {
        billingMedicine.value = selectedValue;
    }
}

function displayMedicines() {
    medicineTable.replaceChildren();

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedStock = stockFilter.value;

    const filteredMedicines = medicines.filter(function (medicine) {
        const matchesSearch = medicine.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            medicine.category === selectedCategory;

        let matchesStock = true;

        if (selectedStock === "Low") {
            matchesStock =
                !isExpired(medicine) &&
                medicine.stock > 0 &&
                medicine.stock <= LOW_STOCK_LIMIT;
        } else if (selectedStock === "Available") {
            matchesStock =
                !isExpired(medicine) &&
                medicine.stock > LOW_STOCK_LIMIT;
        } else if (selectedStock === "Expired") {
            matchesStock = isExpired(medicine);
        }

        return matchesSearch && matchesCategory && matchesStock;
    });

    emptyMessage.style.display =
        filteredMedicines.length === 0 ? "block" : "none";

    if (medicines.length === 0) {
        emptyMessage.textContent = "No medicines have been added yet.";
    } else if (filteredMedicines.length === 0) {
        emptyMessage.textContent = "No medicines match your filters.";
    }

    filteredMedicines.forEach(function (medicine) {
        const row = document.createElement("tr");

        const values = [
            medicine.id,
            medicine.name,
            medicine.category,
            "₹" + medicine.price.toFixed(2),
            medicine.stock,
            medicine.expiryDate
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");

            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");
        const status = getMedicineStatus(medicine);

        statusBadge.className = "stock-badge " + status.className;
        statusBadge.textContent = status.text;

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");

        actions.className = "table-actions";

        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.className = "table-btn edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editMedicine(medicine);
        });

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "table-btn delete-btn";
        deleteButton.textContent = "Remove";

        deleteButton.addEventListener("click", function () {
            removeMedicine(medicine);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        actionsCell.appendChild(actions);
        row.appendChild(actionsCell);

        medicineTable.appendChild(row);
    });

    updateSummary();
    displayAlerts();
    updateBillingMedicineList();
}

function addOrUpdateMedicine() {
    const name = prompt("Enter the medicine name:");

    if (name === null) {
        return;
    }

    if (name.trim() === "") {
        alert("Medicine name cannot be empty.");
        return;
    }

    const category = prompt(
        "Enter category: Tablet, Capsule, Syrup, Injection, Ointment, Other"
    );

    if (category === null) {
        return;
    }

    const validCategories = [
        "Tablet", "Capsule", "Syrup", "Injection", "Ointment", "Other"
    ];

    const matchedCategory = validCategories.find(function (item) {
        return item.toLowerCase() === category.trim().toLowerCase();
    });

    if (!matchedCategory) {
        alert("Please enter a valid medicine category.");
        return;
    }

    const priceText = prompt("Enter the price per unit in rupees:");

    if (priceText === null) {
        return;
    }

    const price = Number(priceText);

    if (!Number.isFinite(price) || price <= 0) {
        alert("Price must be greater than zero.");
        return;
    }

    const stockText = prompt("Enter available stock quantity:");

    if (stockText === null) {
        return;
    }

    const stock = Number(stockText);

    if (!Number.isSafeInteger(stock) || stock < 0) {
        alert("Stock must be a whole number and cannot be negative.");
        return;
    }

    const expiryDate = prompt("Enter expiry date in YYYY-MM-DD format:");

    if (expiryDate === null) {
        return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(expiryDate)) {
        alert("Please use the YYYY-MM-DD date format.");
        return;
    }

    const parsedDate = new Date(expiryDate + "T00:00:00");

    if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== expiryDate
    ) {
        alert("Please enter a valid expiry date.");
        return;
    }

    if (editingMedicineId !== null) {
        const medicine = medicines.find(function (item) {
            return item.id === editingMedicineId;
        });

        if (!medicine) {
            editingMedicineId = null;
            alert("This medicine could not be found.");
            return;
        }

        medicine.name = name.trim();
        medicine.category = matchedCategory;
        medicine.price = price;
        medicine.stock = stock;
        medicine.expiryDate = expiryDate;

        editingMedicineId = null;

        alert("Medicine details updated in the temporary list.");
    } else {
        const duplicate = medicines.some(function (medicine) {
            return medicine.name.toLowerCase() === name.trim().toLowerCase();
        });

        if (duplicate) {
            alert("A medicine with this name already exists in this demo.");
            return;
        }

        const medicine = {
            id: "MED" + String(Date.now()),
            name: name.trim(),
            category: matchedCategory,
            price: price,
            stock: stock,
            expiryDate: expiryDate
        };

        medicines.push(medicine);

        alert("Medicine added to the temporary inventory.");
    }

    displayMedicines();
}

function editMedicine(medicine) {
    editingMedicineId = medicine.id;
    addOrUpdateMedicine();
}

function removeMedicine(medicine) {
    const confirmed = confirm(
        "Remove " + medicine.name + " from the temporary inventory?"
    );

    if (!confirmed) {
        return;
    }

    const index = medicines.findIndex(function (item) {
        return item.id === medicine.id;
    });

    if (index !== -1) {
        medicines.splice(index, 1);
    }

    displayMedicines();
}

document.getElementById("addMedicineBtn").addEventListener(
    "click",
    function () {
        editingMedicineId = null;
        addOrUpdateMedicine();
    }
);

searchInput.addEventListener("input", displayMedicines);
categoryFilter.addEventListener("change", displayMedicines);
stockFilter.addEventListener("change", displayMedicines);

document.getElementById("billingForm").addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const patientId = document.getElementById("patientId").value.trim();
        const medicineId = billingMedicine.value;
        const quantityText = medicineQuantity.value;
        const quantity = Number(quantityText);

        if (!patientId || !medicineId || !quantityText) {
            billingResult.textContent =
                "Please complete all billing fields.";
            return;
        }

        if (!Number.isSafeInteger(quantity) || quantity < 1) {
            billingResult.textContent =
                "Quantity must be a whole number greater than zero.";
            return;
        }

        const medicine = medicines.find(function (item) {
            return item.id === medicineId;
        });

        if (!medicine) {
            billingResult.textContent =
                "Please select a valid medicine.";
            return;
        }

        if (isExpired(medicine)) {
            billingResult.textContent =
                "This medicine has expired and cannot be billed for dispensing.";
            return;
        }

        if (quantity > medicine.stock) {
            billingResult.textContent =
                "Insufficient stock. Available quantity: " + medicine.stock;
            return;
        }

        const total = medicine.price * quantity;

        billingResult.replaceChildren();

        const patientLine = document.createElement("p");
        patientLine.textContent = "Patient ID: " + patientId;

        const medicineLine = document.createElement("p");
        medicineLine.textContent = "Medicine: " + medicine.name;

        const quantityLine = document.createElement("p");
        quantityLine.textContent = "Quantity: " + quantity;

        const priceLine = document.createElement("p");
        priceLine.textContent =
            "Price per unit: ₹" + medicine.price.toFixed(2);

        const totalLine = document.createElement("p");
        const totalLabel = document.createElement("strong");

        totalLabel.textContent =
            "Calculated medicine charge: ₹" + total.toFixed(2);

        totalLine.appendChild(totalLabel);

        billingResult.appendChild(patientLine);
        billingResult.appendChild(medicineLine);
        billingResult.appendChild(quantityLine);
        billingResult.appendChild(priceLine);
        billingResult.appendChild(totalLine);

        const note = document.createElement("p");

        note.textContent =
            "Calculation only. No stock has been deducted and no patient bill has been saved.";

        billingResult.appendChild(note);
    }
);

document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "login.html";
});

displayMedicines();