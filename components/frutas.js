const openShopping = document.querySelector(".shopping");
const closeShopping = document.querySelector(".closeShopping");
const list = document.querySelector(".list");
const listCard = document.querySelector(".listCard");
const total = document.querySelector(".total");
const body = document.querySelector("body");
const quantity = document.querySelector(".quantity");
const categoriaItems = document.querySelectorAll('.despleg');

openShopping.addEventListener("click", () => {
    body.classList.add("active");
});

closeShopping.addEventListener("click", () => {
    body.classList.remove("active");
});

let products = [];
let listCards = [];
let selectedCategoria = null; 

const initApp = () => {
    // Cargar datos del carrito desde LocalStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        listCards = JSON.parse(savedCart);
    }

    const path = window.location.pathname; // Obtenemos la ruta de la URL
    const pathSegments = path.split("/"); // Dividimos la ruta en segmentos
    const currentPage = pathSegments[pathSegments.length - 1]; // Obtenemos la última parte de la ruta (nombre del archivo actual)
    
    // Mapeamos el nombre del archivo actual a la categoría correspondiente
    const categorias = {
        "frutas.html": "frutas",
        "verduras.html": "verduras",
        "ensaladas.html": "ensaladas",
        "home.html": "home"
    };

    selectedCategoria = categorias[currentPage] || "frutas"; // Establecemos la categoría basada en la página actual

    // Cargar productos desde JSON
    fetch('../productos.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProductList();
            reloadcard();
        })
        .catch(error => console.error('Error al cargar los productos: ', error));
};

initApp();

categoriaItems.forEach((item) => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Evita el comportamiento predeterminado del enlace
        selectedCategoria = event.currentTarget.getAttribute('data-categoria');
        renderProductList();
    });
});

const renderProductList = () => {
    list.innerHTML = "";

    const filteredProducts = products.filter(product => product.categoria === selectedCategoria);

    filteredProducts.forEach((value, key) => {
        let newDiv = document.createElement("div");
        newDiv.classList.add("item");
        newDiv.innerHTML = `
            <img src="../assets/frutas/${value.imagen}">
            <div class="title">${value.name}</div>
            <div class="price">$${value.price.toFixed(2)}</div>
            <button id="addToCartBtn${value.id}" onclick="addToCart(${value.id})">Add to Cart</button>
        `;

        list.appendChild(newDiv);
    });
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
        cartProduct.price = cartProduct.price * cartProduct.quantity;
    }

    localStorage.setItem('cart', JSON.stringify(listCards));
    reloadcard();
};








const reloadcard = () => {
    listCard.innerHTML = "";
    let count = 0;
    let totalPrice = 0;

    listCards.forEach((value, key) => {
        if (value != null) {
            totalPrice += value.price;
            count += value.quantity;

            let newDiv = document.createElement("li");
            newDiv.innerHTML = `
                <div><img src="../assets/frutas/${value.imagen}"></div>
                <div class="cardTitle">${value.name}</div>
                <div class="cardPrice">$${value.price.toFixed(2)}</div>
                <div>
                    <button style="background-color: #b3db6b; padding:15px;" class="cardButton" onclick="changeQuantity(${key}, ${value.quantity - 1})"> - </button>
                    <span style="color: black; margin:10px;">${value.quantity}</span>
                    <button style="background-color: #b3db6b; padding:15px;" class="cardButton" onclick="changeQuantity(${key}, ${value.quantity + 1})"> + </button>
                </div>
            `;
            listCard.appendChild(newDiv);
        }
    });
    total.innerText = `$${totalPrice.toFixed(2)}`;
    quantity.innerText = count;
};


const changeQuantity = (key, quantity) => {
    if (quantity === 0) {
       
        listCards = listCards.filter((item, index) => index !== key);
    } else {
        listCards[key].quantity = quantity;
        listCards[key].price = quantity * products[listCards[key].id - 1].price;
        localStorage.setItem('cart', JSON.stringify(listCards));
    }
    reloadcard();
};

renderProductList();

