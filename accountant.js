let bills = [];
let payments = [];

let billNumber = 1;
let paymentNumber = 1;

const billForm = document.getElementById("billForm");
const paymentForm = document.getElementById("paymentForm");

const billTable = document.getElementById("billTable");
const paymentTable = document.getElementById("paymentTable");

const paymentBill = document.getElementById("paymentBill");

function getValue(id) {
    return Number(document.getElementById(id).value) || 0;
}

function money(amount) {
    return "₹" + amount.toFixed(2);
}

function calculateTotal() {
    const consultation = getValue("consultation");
    const operation = getValue("operation");
    const medicine = getValue("medicine");
    const other = getValue("otherExpenses");

    const total = consultation + operation + medicine + other;

    document.getElementById("billTotal").textContent = money(total);

    return total;
}

document.getElementById("calculateBtn").addEventListener("click", function () {
    calculateTotal();
});

billForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const patientId = document.getElementById("patientId").value.trim();
    const patientName = document.getElementById("patientName").value.trim();

    const consultation = getValue("consultation");
    const operation = getValue("operation");
    const medicine = getValue("medicine");
    const other = getValue("otherExpenses");

    const total = calculateTotal();

    if (
        !patientId ||
        !patientName ||
        consultation < 0 ||
        operation < 0 ||
        medicine < 0 ||
        other < 0
    ) {
        alert("Please enter valid patient and billing details.");
        return;
    }

    if (total <= 0) {
        alert("The total bill must be greater than ₹0.");
        return;
    }

    const bill = {
        id: billNumber++,
        patientId: patientId,
        patientName: patientName,
        consultation: consultation,
        operation: operation,
        medicine: medicine,
        other: other,
        total: total,
        paid: 0
    };

    bills.push(bill);

    billForm.reset();

    document.getElementById("billTotal").textContent = money(0);

    displayBills();
    updateSummary();

    alert("Patient bill generated successfully!");
});

paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedBillId = Number(paymentBill.value);
    const amount = getValue("paymentAmount");
    const method = document.getElementById("paymentMethod").value;

    const bill = bills.find(function (item) {
        return item.id === selectedBillId;
    });

    if (!bill) {
        alert("Please select a valid bill.");
        return;
    }

    const pending = bill.total - bill.paid;

    if (amount <= 0 || amount > pending) {
        alert("Enter an amount greater than ₹0 and not more than the pending balance.");
        return;
    }

    const payment = {
        id: paymentNumber++,
        billId: bill.id,
        patientName: bill.patientName,
        amount: amount,
        method: method,
        date: new Date().toLocaleDateString("en-IN")
    };

    bill.paid += amount;
    payments.push(payment);

    paymentForm.reset();

    displayBills();
    displayPayments();
    updateSummary();

    alert("Payment recorded successfully!");
});

function displayBills() {
    billTable.innerHTML = "";
    paymentBill.innerHTML = '<option value="">Select a bill</option>';

    const search = document.getElementById("searchBill")
        .value.toLowerCase();

    bills.forEach(function (bill) {
        const matchesSearch =
            bill.patientName.toLowerCase().includes(search) ||
            bill.patientId.toLowerCase().includes(search) ||
            String(bill.id).includes(search);

        const pending = bill.total - bill.paid;

        const status = pending === 0 ? "Paid" : "Pending";

        if (matchesSearch) {
            const row = document.createElement("tr");

            const values = [
                "BILL-" + bill.id,
                bill.patientId,
                bill.patientName,
                money(bill.consultation),
                money(bill.operation),
                money(bill.medicine),
                money(bill.other),
                money(bill.total),
                money(bill.paid),
                money(pending)
            ];

            values.forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const statusCell = document.createElement("td");
            const statusLabel = document.createElement("span");

            statusLabel.textContent = status;
            statusLabel.className =
                status === "Paid" ? "status paid" : "status pending";

            statusCell.appendChild(statusLabel);
            row.appendChild(statusCell);

            const actionCell = document.createElement("td");
            const printButton = document.createElement("button");

            printButton.textContent = "Print";
            printButton.className = "action-btn";

            printButton.addEventListener("click", function () {
                printBill(bill);
            });

            actionCell.appendChild(printButton);
            row.appendChild(actionCell);

            billTable.appendChild(row);
        }

        if (pending > 0) {
            const option = document.createElement("option");

            option.value = bill.id;
            option.textContent =
                "BILL-" + bill.id + " - " +
                bill.patientName + " - Pending " + money(pending);

            paymentBill.appendChild(option);
        }
    });
}

function displayPayments() {
    paymentTable.innerHTML = "";

    payments.forEach(function (payment) {
        const row = document.createElement("tr");

        const values = [
            "PAY-" + payment.id,
            "BILL-" + payment.billId,
            payment.patientName,
            money(payment.amount),
            payment.method,
            payment.date
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        paymentTable.appendChild(row);
    });
}

function updateSummary() {
    const totalBills = bills.length;

    const totalRevenue = bills.reduce(function (sum, bill) {
        return sum + bill.total;
    }, 0);

    const received = payments.reduce(function (sum, payment) {
        return sum + payment.amount;
    }, 0);

    const pending = totalRevenue - received;

    document.getElementById("totalBills").textContent = totalBills;
    document.getElementById("totalRevenue").textContent = money(totalRevenue);
    document.getElementById("amountReceived").textContent = money(received);
    document.getElementById("pendingBalance").textContent = money(pending);
}

function printBill(bill) {
    const pending = bill.total - bill.paid;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CareNest Patient Bill</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 30px;
                    color: #263746;
                }

                h1, h2 {
                    color: #246b8b;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                th, td {
                    border: 1px solid #ccc;
                    padding: 12px;
                    text-align: left;
                }

                .total {
                    font-size: 18px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>CareNest Healthcare</h1>
            <h2>Patient Bill</h2>

            <p><strong>Bill ID:</strong> BILL-${bill.id}</p>
            <p><strong>Patient ID:</strong> ${escapeHTML(bill.patientId)}</p>
            <p><strong>Patient Name:</strong> ${escapeHTML(bill.patientName)}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN")}</p>

            <table>
                <tr><th>Description</th><th>Amount</th></tr>
                <tr><td>Consultation Fees</td><td>${money(bill.consultation)}</td></tr>
                <tr><td>Operation / Surgery</td><td>${money(bill.operation)}</td></tr>
                <tr><td>Medicine Charges</td><td>${money(bill.medicine)}</td></tr>
                <tr><td>Other Expenses</td><td>${money(bill.other)}</td></tr>
                <tr><td class="total">Total Bill</td><td class="total">${money(bill.total)}</td></tr>
                <tr><td>Amount Paid</td><td>${money(bill.paid)}</td></tr>
                <tr><td>Pending Balance</td><td>${money(pending)}</td></tr>
            </table>

            <p>Thank you for choosing CareNest.</p>

            <script>
                window.onload = function () {
                    window.print();
                };
            <\/script>
        </body>
        </html>
    `);

    printWindow.document.close();
}

function escapeHTML(value) {
    return value.replace(/[&<>"']/g, function (character) {
        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return characters[character];
    });
}

document.getElementById("searchBill").addEventListener("input", function () {
    displayBills();
});

document.getElementById("logoutBtn").addEventListener("click", function () {
    sessionStorage.clear();
});

displayBills();
displayPayments();
updateSummary();