const btnCep = document.getElementById("btn-cep");
const popupCep = document.getElementById("popup-cep");
const btnPronto = document.querySelector(".btn-pronto");
const popupOverlay = document.querySelector(".popup-overlay");
const inputCep = document.querySelector(".input-cep");

// Máscara de CEP
inputCep.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 5) {
    value = value.slice(0, 5) + "-" + value.slice(5, 8);
  }
  e.target.value = value;
});

// Abre o popup
btnCep.addEventListener("click", () => {
  popupCep.style.display = "flex";
});

// Fecha o popup
btnPronto.addEventListener("click", () => {
  popupCep.style.display = "none";
});

// Fecha ao clicar fora
popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) {
    popupCep.style.display = "none";
  }
});

// Submenu Categorias
const listaCategorias = document.getElementById("lista-categorias");

// Carrega categorias do backend
async function carregarCategorias() {
  const response = await fetch("http://localhost:3000/categorias");
  const categorias = await response.json();

  listaCategorias.innerHTML = "";

  categorias.forEach((categoria) => {
    const item = document.createElement("div");
    item.classList.add("categoria-item");
    item.textContent = categoria;
    listaCategorias.appendChild(item);
  });
}

carregarCategorias();
