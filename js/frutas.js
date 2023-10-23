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

    // Recupera los productos del almacenamiento local
    const savedCart = localStorage.getItem('cart');
    listCards = savedCart ? JSON.parse(savedCart) : [];
        // Recupera la cantidad del carrito desde LocalStorage y muestra en todas las páginas
    const savedCartQuantity = localStorage.getItem('cartQuantity');
    if (savedCartQuantity) {
        quantity.innerText = savedCartQuantity;
    }
    // Mostrar los productos en la página
    listado.innerHTML = "";
    let total = 0;

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
                    <button style="background-color: #b3db6b; padding: 10px;" class="cardButton" onclick="changeQuantity(${key}, ${product.quantity - 1})">-</button>
                    <span style="color: black; margin: 10px;">${product.quantity}</span>
                    <button style="background-color: #b3db6b; padding: 10px;" class="cardButton" onclick="changeQuantity(${key}, ${product.quantity + 1})">+</button>
                    <button style="background-color: #ff6b6b; padding: 10px; margin-left: 5px;" class="cardButton" onclick="removeProduct(${key})">x</button>
                </div>
            `;
            listado.appendChild(itemDiv);
        }
    });

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `
        <p class="cardTotal">Total a pagar:</p>
        <p class="cardTotalPrice">$${total.toFixed(2)}</p>
    `;
    listado.appendChild(totalDiv);

    // Botón para eliminar todos los elementos del carrito
    const removeAllButton = document.createElement("button");
    removeAllButton.textContent = "Eliminar Todos";
    removeAllButton.classList.add("removeAllButton");
    removeAllButton.addEventListener("click", removeAllProducts);
    listado.appendChild(removeAllButton);

    // Actualizar la cantidad de productos en el carrito
    updateCartQuantity();


    

});

const initApp = () => {
    // Cargar datos del carrito desde LocalStorage

    const savedCart = localStorage.getItem('cart');
    listCards = savedCart ? JSON.parse(savedCart) : [];

    const path = window.location.pathname; // Obtenemos la ruta de la URL
    const pathSegments = path.split("/");
    const currentPage = pathSegments[pathSegments.length - 1];

    // Mapeamos el nombre del archivo actual a la categoría correspondiente
    const categorias = {
        "frutas.html": "frutas",
        "verduras.html": "verduras",
        "ensaladas.html": "ensaladas",
        "index.html": "home",
        "checkout.html": "check",
    };

    selectedCategoria = categorias[currentPage] || "frutas"; 

    // Cargar productos desde JSON
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
            <button onclick="addToCart(${value.id})">Add to Cart</button>
            <a href="#" class="details-link" data-product-id="${value.id}" onclick="showProductDetails(event, ${value.id});">Ver detalles</a>
        `;

        list.appendChild(newDiv);
    });
};
const showProductDetails = (event, productId) => {
    event.preventDefault(); // Evita que el enlace redireccione

    console.log("showProductDetails se está ejecutando con el ID:", productId);

    // Encuentra el producto seleccionado en el array de productos
    const selectedProduct = products.find(product => product.id === productId);

    // Verifica si el producto se encontró
    if (selectedProduct) {
        // Crea un elemento div para mostrar los detalles del producto
        const detailsDiv = document.createElement("div");
        detailsDiv.classList.add("product-details");

        // Agrega contenido al div de detalles del producto
        detailsDiv.innerHTML = `
            <img src="../assets/frutas/${selectedProduct.imagen}" alt="Producto">
            <h1 class="product-title">${selectedProduct.name}</h1>
            <p class="product-description">${selectedProduct.descripcion}</p>
            <p class="product-price">$${selectedProduct.price.toFixed(2)}</p>
            <button onclick="addToCart(${selectedProduct.id})">Agregar al Carrito</button>
        `;

        // Obtén el elemento donde deseas mostrar los detalles (por ejemplo, 'product-details-container')
        const detailsContainer = document.getElementById("product-details-container");

        // Limpia el contenido actual en el div de detalles y agrega los nuevos detalles
        detailsContainer.innerHTML = "";
        detailsContainer.appendChild(detailsDiv);
    } else {
        console.error("Producto no encontrado");
    }
};






const addToCart = (productId) => {
    const product = products.find((p) => p.id === productId);

    if (!product) {
        console.error(`Product with id ${productId} not found.`);
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

    // Actualiza la cantidad en el carrito
    updateCartQuantity();
};








const changeQuantity = (key, newQuantity) => {
    if (newQuantity < 1) {
        return;
    }

    listCards[key].quantity = newQuantity;
    listCards[key].price = newQuantity * products[listCards[key].id - 1].price;
    localStorage.setItem('cart', JSON.stringify(listCards));
    updateCart();

    // Actualizar el total a pagar después de cambiar la cantidad
    const total = listCards.reduce((total, product) => total + product.price, 0);
    const totalDiv = document.querySelector(".cardTotalPrice");
    totalDiv.textContent = `$${total.toFixed(2)}`;
};








const removeProduct = (key) => {
    listCards.splice(key, 1);
    localStorage.setItem('cart', JSON.stringify(listCards));
    updateCart();
};

const removeAllProducts = () => {
    listCards = [];
    localStorage.removeItem('cart');
    updateCart();
};

const updateCart = () => {
    location.reload(); 
};