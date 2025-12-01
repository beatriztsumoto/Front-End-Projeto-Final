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

import { buscarLojasPorNome } from "./lojas.js";

const dropdownLojas = document.getElementById("dropdown-lojas");
const inputBuscaLojas = document.getElementById("input-busca-lojas");
const listaLojas = document.getElementById("lista-lojas");
const btnLojas = document.getElementById("btn-lojas");

// Abre/Fecha dropdown lojas
btnLojas.addEventListener("click", () => {
  dropdownLojas.classList.toggle("show");
});

// Buscar enquanto digita
inputBuscaLojas.addEventListener("input", async () => {
  const termo = inputBuscaLojas.value.trim();

  if (termo.length < 2) {
    listaLojas.innerHTML = "<li>Digite ao menos 2 caracteres</li>";
  }

  try {
    const lojas = await buscarLojasPorNome(termo);
    preencherListaLojas(lojas);
  } catch (error) {
    listaLojas.innerHTML = "<li>Erro ao buscar lojas</li>";
  }
});

function preencherListaLojas(lojas) {
  listaLojas.innerHTML = "";

  if (!lojas || lojas.length === 0) {
    listaLojas.innerHTML = "<li>Nenhuma loja encontrada</li>";
    return;
  }

  lojas.forEach((loja) => {
    const li = document.createElement("li");

    li.innerHTML = `<img src="${loja.LOGO || ""}" class="logo-loja">
    <span>${loja.NOME_FANTASIA}</span>`;
    li.textContent = loja.NOME_FANTASIA;
    listaLojas.appendChild(li);
  });
}

carregarCategorias();

const containerCupons = document.getElementById("lista-cupons");


async function carregarCupons() {
  try {
    const response = await fetch("http://localhost:3000/cupons");
    const data = await response.json();


    const cupons = data.cupons;


    containerCupons.innerHTML = "";


    const cuponsUnicos = [];
    const lojasVistas = new Set();


    cupons.forEach(c => {
      if (!lojasVistas.has(c.LOJA.ID_LOJA)) {
        lojasVistas.add(c.LOJA.ID_LOJA);
        cuponsUnicos.push(c);
      }
    });

    cuponsUnicos.forEach((cupom) => {
      const card = document.createElement("div");
      card.classList.add("card");


      card.innerHTML = `
        <div class="card-header">
          <span class="badge">TOP</span>
          <img src="${cupom.LOJA.LOGO}" alt="${cupom.LOJA.NOME_FANTASIA}">
        </div>


        <div class="card-body">
          <p>${cupom.TITULO}</p>
          <p class="cashback">${cupom.DESCRICAO}</p>
        </div>
      `;

      containerCupons.appendChild(card);
    });


  } catch (erro) {
    console.error("Erro ao carregar cupons:", erro);
  }
}


carregarCupons();
