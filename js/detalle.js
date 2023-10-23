document.addEventListener("DOMContentLoaded", function () {
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Obtener el ID del producto de la URL
    var productId = getParameterByName("id");

    // Cargar productos desde productos.json
    fetch('../productos.json')
        .then(response => response.json())
        .then(data => {
            // buscar el producto por ID
            var product = data.find(item => item.id === parseInt(productId));
            
            if (product) {
                document.getElementById("product-image").src = "../assets/frutas/" + product.imagen;
                document.getElementById("product-name").textContent = product.name;
                document.getElementById("product-price").textContent = "PRECIO $" + product.price.toFixed(2);
                document.getElementById("product-desc").textContent= product.descripcion2;
            } else {
                document.getElementById("product-details").innerHTML = "Producto no encontrado.";
            }
        })
        .catch(error => {
            console.error('Error al cargar los productos: ', error);
            document.getElementById("product-details").innerHTML = "Error al cargar los productos.";
        });

    var goBackButton = document.getElementById("go-back-button");
    goBackButton.addEventListener("click", function() {
        // el objeto history para regresar a la página anterior
        window.history.back();
    });
});