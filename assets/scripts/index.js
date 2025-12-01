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

    li.innerHTML = `<img src="${loja.LOGO || ""}" class="logo-loja">
    <span>${loja.NOME_FANTASIA}</span>`;
    li.textContent = loja.NOME_FANTASIA;
    listaLojas.appendChild(li);
  });
}

carregarCategorias();

function removerRepetidosPorLoja(lista) {
  const lojasVistas = new Set();
  return lista.filter(item => {
    if (lojasVistas.has(item.LOJA.ID_LOJA)) return false;
    lojasVistas.add(item.LOJA.ID_LOJA);
    return true;
  });
}

async function carregarHome() {
  try {

    const cuponsReq = await fetch("http://localhost:3000/cupons");
    const descontosReq = await fetch("http://localhost:3000/descontos");

    const cuponsJson = await cuponsReq.json();
const descontosJson = await descontosReq.json();

const listaCupons = cuponsJson.cupons;  
const listaDescontos = descontosJson.data; 


    const cuponsSemRepetir = removerRepetidosPorLoja(listaCupons).slice(0, 10);
    const descontosSemRepetir = removerRepetidosPorLoja(listaDescontos).slice(0, 10);

    let alternados = [];
    let i = 0;

    while (i < cuponsSemRepetir.length || i < descontosSemRepetir.length) {
      if (i < cuponsSemRepetir.length)
        alternados.push({ tipo: "cupom", data: cuponsSemRepetir[i] });

      if (i < descontosSemRepetir.length)
        alternados.push({ tipo: "desconto", data: descontosSemRepetir[i] });

      i++;
    }

    const container = document.querySelector(".grid");

    alternados.forEach(item => {
      const d = item.data;

      const card = document.createElement("div");
      card.classList.add("card");

      if (item.tipo === "cupom") {
        card.innerHTML = `
          <div class="card-header">
            <img src="${d.LOJA.LOGO}" alt="Logo da loja">
          </div>

          <div class="card-body">
            <p>${d.TITULO}</p>
            <span class="cashback">${d.CASHBACK ? d.CASHBACK : "Sem cashback"}</span>
          </div>
        `;
      }

      if (item.tipo === "desconto") {
        card.innerHTML = `
          <div class="card-header">
            <img src="${d.FOTO_ITEM}" class="desconto-img" alt="Imagem item">
          </div>

          <div class="card-body">
            <p>${d.TITULO}</p>
            <span class="valor-desconto">- R$ ${parseFloat(d.VALOR_DESCONTO).toFixed(2)}</span>
          </div>
        `;
      }

      container.appendChild(card);
    });

  } catch (erro) {
    console.error("Erro ao carregar home:", erro);
  }
}

carregarHome();
