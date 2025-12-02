import { buscarLojasPorNome, buscarLojasPorEndereco } from "./lojas.js";

// Carregar pesquisa de descontos por título e cupons por código e tótilo em placeholder
const input = document.getElementById("input-busca");
const dropdown = document.getElementById("dropdown-resultados");

input.addEventListener("input", async () => {
  const termo = input.value.trim();

  if (termo.length === 0) {
    dropdown.classList.remove("show");
    return;
  }

  try {
    // BUSCA EM DESCONTOS + CUPONS EM PARALELO
    const [resDescontos, resCupons] = await Promise.all([
      fetch(
        `http://localhost:3000/descontos?modo=autocomplete&busca=${encodeURIComponent(
          termo
        )}`
      ),
      fetch(
        `http://localhost:3000/cupons?modo=autocomplete&busca=${encodeURIComponent(
          termo
        )}`
      ),
    ]);

    let descontos = [];
    let cupons = [];

    if (resDescontos.ok) {
      const jsonDescontos = await resDescontos.json();
      descontos = jsonDescontos.data || [];
    }

    if (resCupons.ok) {
      cupons = await resCupons.json(); // já retorna array direto
    }

    const resultados = [
      ...descontos.map((d) => ({
        tipo: "desconto",
        texto: d.TITULO,
      })),
      ...cupons.map((c) => ({
        tipo: "cupom",
        texto: `${c.TITULO} (${c.CODIGO})`,
      })),
    ];

    if (resultados.length === 0) {
      dropdown.innerHTML = `<div class="dropdown-item">Nenhum resultado encontrado</div>`;
      dropdown.classList.add("show");
      return;
    }

    dropdown.innerHTML = resultados
      .map(
        (r) => `
        <div class="dropdown-item">
          <strong>${r.tipo === "cupom" ? "Cupom" : "Desconto"}:</strong> ${
          r.texto
        }
        </div>
      `
      )
      .join("");

    dropdown.classList.add("show");
  } catch (err) {
    console.error("Erro na busca:", err);
  }
});

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
      window.location.href = `/assets/pages/paginaLojas.html?id=${loja.ID_LOJA}`;
    });

    listaLojas.appendChild(li);
  });
}

// Barra de pesquisa por endereço
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

    listaEndereco.appendChild(li);
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
