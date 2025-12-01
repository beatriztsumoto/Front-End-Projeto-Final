import { buscarLojasPorNome, buscarLojasPorEndereco } from "./lojas.js";

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

  // Coletar apenas os endereços únicos
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
