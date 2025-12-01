import { buscarLojasPorNome, buscarLojasPorEndereco } from "./lojas.js";

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

    item.addEventListener("click", () => {
      window.location.href = `/assets/pages/lojaPorCategoria.html?categaria=${encodeURIComponent(categoria)}`
    })

    listaCategorias.appendChild(item);
  });
}

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

const btnEndereco = document.getElementById("btn-endereco");
const dropdownEndereco = document.getElementById("dropdown-endereco");
const listaEndereco = document.getElementById("lista-endereco");
const inputBuscaEndereco = document.getElementById("input-busca-endereco");

// 1. Abre/Fecha dropdown Endereço
btnEndereco.addEventListener("click", () => {
  dropdownEndereco.classList.toggle("show");
  if (dropdownEndereco.classList.contains("show")) {
    inputBuscaEndereco.value = "";
    listaEndereco.innerHTML =
      "<li>Digite ao menos 3 caracteres do endereço...</li>"; // Aumentei para 3, é mais eficiente
    inputBuscaEndereco.focus();
  }
});

// 2. Buscar enquanto digita
inputBuscaEndereco.addEventListener("input", async () => {
  const termo = inputBuscaEndereco.value.trim();

  if (termo.length < 3) {
    listaEndereco.innerHTML =
      "<li>Digite ao menos 3 caracteres do endereço...</li>";
    return;
  }

  try {
    const lojas = await buscarLojasPorEndereco(termo);
    preencherListaEnderecosUnicos(lojas); // 🎯 Mudança no nome da função para clareza
  } catch (error) {
    console.error("Não há lojas nesse local:", error);
    listaEndereco.innerHTML = "<li>Não há lojas nesse local </li>";
  }
});

// 3. Função para preencher a lista de resultados (AGRUPANDO ENDEREÇOS ÚNICOS)
function preencherListaEnderecosUnicos(lojas) {
  listaEndereco.innerHTML = "";

  if (!lojas || lojas.length === 0) {
    listaEndereco.innerHTML =
      "<li>Nenhuma loja encontrada para este endereço</li>";
    return;
  }

  // 🎯 Coletar apenas os endereços únicos
  const enderecosUnicos = new Set();
  lojas.forEach((loja) => {
    if (loja.ENDERECO) {
      enderecosUnicos.add(loja.ENDERECO);
    }
  });

  // Iterar e criar um item de lista para CADA ENDEREÇO ÚNICO
  enderecosUnicos.forEach((enderecoUnico) => {
    const li = document.createElement("li");
    li.classList.add("endereco-item");

    li.innerHTML = `<span>${enderecoUnico}</span>`;

    li.dataset.enderecoCompleto = enderecoUnico;

    li.addEventListener("click", () => {
      btnEndereco.querySelector("span").textContent =
        enderecoUnico.substring(0, 20) + "...";

      // Fecha o dropdown
      dropdownEndereco.classList.remove("show");

      const lojasNoEndereco = lojas.filter(
        (loja) => loja.ENDERECO === enderecoUnico
      );

      console.log(
        `Endereço selecionado. Total de lojas encontradas: ${lojasNoEndereco.length}`
      );
    });

    listaEndereco.appendChild(li);
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

    cupons.forEach((c) => {
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
