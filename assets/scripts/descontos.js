const btnCep = document.getElementById("btn-cep");
const popupCep = document.getElementById("popup-cep");
const btnPronto = document.querySelector(".btn-pronto");
const popupOverlay = document.querySelector(".popup-overlay");
const inputCep = document.querySelector(".input-cep");

inputCep.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 5) {
    value = value.slice(0, 5) + "-" + value.slice(5, 8);
  }
  e.target.value = value;
});

btnCep.addEventListener("click", () => {
  popupCep.style.display = "flex";
});

btnPronto.addEventListener("click", () => {
  popupCep.style.display = "none";
});

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

    li.textContent = loja.NOME_FANTASIA;

    li.addEventListener("click", () => {
      window.location.href = `/assets/pages/paginaLojas.html?id=${loja.ID_LOJA}`
    });

    listaLojas.appendChild(li);
  });
}

carregarCategorias();

const containerDescontos = document.getElementById("lista-descontos");

console.log("Função carregarDescontos iniciou!");

async function carregarDescontos() {
  try {
    const resp = await fetch("http://localhost:3000/descontos");
    const data = await resp.json();

    console.log("API RETORNOU:", data);

    const descontos = data.data; 

    containerDescontos.innerHTML = "";

    const unicos = [];
    const lojasVistas = new Set();

    descontos.forEach((item) => {
      if (!lojasVistas.has(item.LOJA.ID_LOJA)) {
        lojasVistas.add(item.LOJA.ID_LOJA);
        unicos.push(item);
      }
    });

    const listaFinal = unicos.slice(0, 100);

    listaFinal.forEach((d) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="card-header"><span>${d.TITULO}</span></div>

        <div class="card-body">
          <img src="${d.FOTO_ITEM}" class="desconto-img">

          <h3 class = nome-desconto>${d.LOJA.NOME_FANTASIA}</h3>

          <p class = descricao>${d.DESCRICAO}</p>

          <span class="valor-desconto">
            - R$ ${parseFloat(d.VALOR_DESCONTO).toFixed(2)}
          </span>
        </div>
      `;

      containerDescontos.appendChild(card);
    });

  } catch (erro) {
    console.error("Erro ao carregar descontos:", erro);
  }
}

carregarDescontos();

