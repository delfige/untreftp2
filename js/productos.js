const list = document.querySelector(".list");
const quantity = document.querySelector(".quantity");
const categoriaItems = document.querySelectorAll('.despleg');

let products = [];
let listCards = []; 
let selectedCategoria = null;

const updateCartQuantity = () => {
    const uniqueProducts = new Set(listCards.map((product) => product.id));
    quantity.innerText = uniqueProducts.size;
    localStorage.setItem('cartQuantity', quantity.innerText);
};

document.addEventListener("DOMContentLoaded", function () {
    const listado = document.getElementById("listado");
    const agregar = document.getElementById("add-to-cart-button");

    const carrito = localStorage.getItem('cart');
    listCards = carrito ? JSON.parse(carrito) : [];
    
    const carritoQuantity = localStorage.getItem('cartQuantity');
    if (carritoQuantity) {
        quantity.innerText = carritoQuantity;
    }

    listado.innerHTML = "";
    let total = 0;
    const eliminarTodo = document.createElement("button");
    eliminarTodo.textContent = "Eliminar Todos";
    eliminarTodo.classList.add("removeAllButton");
    eliminarTodo.addEventListener("click", Eliminartodos);
    listado.appendChild(eliminarTodo);
    listCards.forEach((product, key) => {
        if (product != null) {
            total += product.price;
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");
            
            itemDiv.innerHTML = `
                <div><img src="../assets/frutas/${product.imagen}"></div>
                <div class="cardTitle">${product.name}</div>
                <div class="cardPrice">$${product.price.toFixed(2)}</div>
                <div>
                    <button style="background-color: #b3db6b; padding: 10px;" class="cardButton" onclick="cambiarCantidad(${key}, ${product.quantity - 1})">-</button>
                    <span style="color: black; margin: 10px;">${product.quantity}</span>
                    <button style="background-color: #b3db6b; padding: 10px;" class="cardButton" onclick="cambiarCantidad(${key}, ${product.quantity + 1})">+</button>
                    <button style="background-color: #ff6b6b; padding: 10px; margin-left: 10px;" class="cardButton" onclick="EliminarProducto(${key})">x</button>
                </div>
            `;
            listado.appendChild(itemDiv);
        }
    });

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `
        <p class "cardTotal">Total a pagar:</p>
        <p class="cardTotalPrice">$${total.toFixed(2)}</p>
    `;
    listado.appendChild(totalDiv);
    updateCartQuantity();

    const productId = getParameterByName("id");

    agregar.addEventListener("click", function () {
        addToCart(productId);
    });
});

const initApp = () => {

    const carrito = localStorage.getItem('cart');
    listCards = carrito ? JSON.parse(carrito) : [];

    const path = window.location.pathname;
    const pathSegments = path.split("/");
    const currentPage = pathSegments[pathSegments.length - 1];

    const categorias = {
        "frutas.html": "frutas",
        "verduras.html": "verduras",
        "ensaladas.html": "ensaladas",
        "index.html": "home",
        "checkout.html": "check",
    };

    selectedCategoria = categorias[currentPage] || "frutas"; 

    fetch('../productos.json')
        .then((response) => response.json())
        .then((data) => {
            products = data;
            renderProductList();
        })
        .catch((error) => console.error('Error al cargar los productos: ', error));
};
    
initApp();

categoriaItems.forEach((item) => {
    item.addEventListener('click', (event) => {
        event.preventDefault();
        selectedCategoria = event.currentTarget.getAttribute('data-categoria');
        renderProductList();
    });
});

const renderProductList = () => {
    list.innerHTML = "";

    const filteredProducts = products.filter((product) => product.categoria === selectedCategoria);

    filteredProducts.forEach((value, key) => {
        let newDiv = document.createElement("div");
        newDiv.classList.add("item");
        newDiv.innerHTML = `
            <img src="../assets/frutas/${value.imagen}">
            <div class="title">${value.name}</div>
            <div class="descripcion">${value.descripcion}</div>
            <div class="price">$${value.price.toFixed(2)}</div>
            <button onclick="addToCart(${value.id})">Agregar al carrito</button>
            <a href="detalle.html?id=${value.id}" class="details-link" data-product-id="${value.id}">Ver detalles</a>
        `;

        list.appendChild(newDiv);
    });
};


const addToCart = (productId) => {
    const product = products.find((p) => p.id === productId);

    if (!product) {
        console.error(`Producto ${productId} no encontrado.`);
        return;
    }

    let cartProduct = listCards.find((item) => item.id === productId);

    if (!cartProduct) {
        cartProduct = { ...product, quantity: 1 };
        listCards.push(cartProduct);
    } else {
        cartProduct.quantity++;
    }

    localStorage.setItem('cart', JSON.stringify(listCards));
    updateCartQuantity();
};



const cambiarCantidad = (key, newQuantity) => {
    if (newQuantity < 1) {
        return;
    }

    listCards[key].quantity = newQuantity;
    listCards[key].price = newQuantity * products[listCards[key].id - 1].price;
    localStorage.setItem('cart', JSON.stringify(listCards));
    updateCart();

    const total = listCards.reduce((total, product) => total + product.price, 0);
    const totalDiv = document.querySelector(".cardTotalPrice");
    totalDiv.textContent = `$${total.toFixed(2)}`;
};



const EliminarProducto = (key) => {
    listCards.splice(key, 1);
    localStorage.setItem('cart', JSON.stringify(listCards));
    updateCart();
};

const Eliminartodos = () => {
    listCards = [];
    localStorage.removeItem('cart');
    updateCart();
};

const updateCart = () => {
    location.reload(); 
};


categoriaItems.forEach(item => {
    const categoria = item.getAttribute('data-categoria');
    item.onclick = function() {
        window.location.href = `${categoria}.html`;
    };
});