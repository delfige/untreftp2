const boton = document.getElementById("miboton");
const textoEmergente = document.getElementById("textoEmergente");

boton.addEventListener("mouseover", () => {
    textoEmergente.style.display = "block";
});

boton.addEventListener("mouseout", () => {
    textoEmergente.style.display = "none";
});
boton.addEventListener("click", function() {
    window.location.href = 'verduras.html';
});
const boton1 = document.getElementById("miboton1");
const textoEmergente1 = document.getElementById("textoEmergente1");

boton1.addEventListener("mouseover", () => {
    textoEmergente1.style.display = "block";
});

boton1.addEventListener("mouseout", () => {
    textoEmergente1.style.display = "none";
});
boton1.addEventListener("click", function() {
    window.location.href = 'frutas.html';
});
const boton2 = document.getElementById("miboton2");
const textoEmergente2 = document.getElementById("textoEmergente2");

boton2.addEventListener("mouseover", () => {
    textoEmergente2.style.display = "block";
});

boton2.addEventListener("mouseout", () => {
    textoEmergente2.style.display = "none";
});
boton2.addEventListener("click", function() {
    window.location.href = 'ensaladas.html';
});

