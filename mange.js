let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total"); 
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let tableBody = document.getElementById("table-body");
let btnDelete = document.getElementById("deleteAll");

function getTotal() {
    if (price.value != "") {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = result;
        total.style.background = "#2596be";
    } else {
        total.innerHTML = "";
        total.style.background = "";
    }
}

// Initialize data
let datapro = localStorage.product ? JSON.parse(localStorage.product) : [];

// Submit and create product
submit.onclick = function () {
    let newProduct = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value
    };

    // Add multiple copies if count > 1
    if (newProduct.count > 1) {
        for (let i = 0; i < newProduct.count; i++) {
            datapro.push(newProduct);
        }
    } else {
        datapro.push(newProduct);
    }

    // Save to localStorage
    localStorage.setItem("product", JSON.stringify(datapro));

    // Clear input fields
    clearInputs();

    // Update UI
    showData();
    checkDeleteButton();
};

// Clear inputs after submission
function clearInputs() {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    total.innerHTML = "";
    count.value = "";
    category.value = "";
}

// Display product data
function showData() {
    tableBody.innerHTML = "";  // Clear previous rows
    datapro.forEach((product, i) => {
        let row = `
            <tr>
                <td>${i + 1}</td>
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td>${product.taxes}</td>
                <td>${product.ads}</td>
                <td>${product.discount}</td>
                <td>${product.total}</td>
                <td>${product.category}</td> 
                <td><button onclick="updateData(${i})">Update</button></td>
                <td><button onclick="deleteData(${i})">Delete</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Delete single product
function deleteData(i) {
    datapro.splice(i, 1);
    localStorage.setItem("product", JSON.stringify(datapro));
    showData();
    checkDeleteButton();
}

// Delete all products
function deleteAll() {
    localStorage.clear();
    datapro = [];
    showData();
    checkDeleteButton();
}

// Check if 'Delete All' button should be shown
function checkDeleteButton() {
    if (datapro.length > 0) {
        btnDelete.innerHTML = `<button onclick="deleteAll()">Delete All</button>`;
    } else {
        btnDelete.innerHTML = "";
    }
}

// Update product data
function updateData(i) {
    title.value = datapro[i].title;
    price.value = datapro[i].price;
    taxes.value = datapro[i].taxes;
    ads.value = datapro[i].ads;
    discount.value = datapro[i].discount;
    getTotal();
    count.style.display = "none";
    category.value = datapro[i].category;
    submit.innerHTML = "Update";

    submit.onclick = function () {
        datapro[i].title = title.value;
        datapro[i].price = price.value;
        datapro[i].taxes = taxes.value;
        datapro[i].ads = ads.value;
        datapro[i].discount = discount.value;
        datapro[i].total = total.innerHTML;
        datapro[i].category = category.value;

        localStorage.setItem("product", JSON.stringify(datapro));
        clearInputs();
        submit.innerHTML = "Submit";
        count.style.display = "block";
        showData();
        checkDeleteButton();
    };
}

// Search functionality
let searchMode = "title";
function getSearchMode(id) {
    let search = document.getElementById("search");
    if (id === "searchTitle") {
        searchMode = "title";
        search.placeholder = "Search by Title";
    } else {
        searchMode = "category";
        search.placeholder = "Search by Category";
    }
    search.focus();
    search.value = "";
    showData();
}

function search(value) {
    tableBody.innerHTML = "";
    datapro.forEach((product, i) => {
        if (searchMode === "title" && product.title.includes(value)) {
            appendRow(i, product);
        } else if (searchMode === "category" && product.category.includes(value)) {
            appendRow(i, product);
        }
    });
}

// Helper to append a row to the table
function appendRow(i, product) {
    let row = `
        <tr>
            <td>${i + 1}</td>
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>${product.taxes}</td>
            <td>${product.ads}</td>
            <td>${product.discount}</td>
            <td>${product.total}</td>
            <td>${product.category}</td> 
            <td><button onclick="updateData(${i})">Update</button></td>
            <td><button onclick="deleteData(${i})">Delete</button></td>
        </tr>
    `;
    tableBody.innerHTML += row;
}

// Initial data load
showData();
checkDeleteButton();
