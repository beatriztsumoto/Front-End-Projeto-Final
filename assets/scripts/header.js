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

    item.addEventListener("click", () => {
      window.location.href = `/assets/pages/lojaPorCategoria.html?categoria=${encodeURIComponent(
        categoria
      )}`;
    });

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

const btnEndereco = document.getElementById("btn-endereco");
const dropdownEndereco = document.getElementById("dropdown-endereco");
const listaEndereco = document.getElementById("lista-endereco");
const inputBuscaEndereco = document.getElementById("input-busca-endereco");

// Abre/Fecha dropdown Endereço
btnEndereco.addEventListener("click", () => {
  dropdownEndereco.classList.toggle("show");
  if (dropdownEndereco.classList.contains("show")) {
    inputBuscaEndereco.value = "";
    listaEndereco.innerHTML =
      "<li>Digite ao menos 3 caracteres do endereço...</li>";
    inputBuscaEndereco.focus();
  }
});

// Buscar enquanto digita
inputBuscaEndereco.addEventListener("input", async () => {
  const termo = inputBuscaEndereco.value.trim();

  if (termo.length < 3) {
    listaEndereco.innerHTML =
      "<li>Digite ao menos 3 caracteres do endereço...</li>";
    return;
  }

  try {
    const lojas = await buscarLojasPorEndereco(termo);
    preencherListaEnderecosUnicos(lojas);
  } catch (error) {
    console.error("Não há lojas nesse local:", error);
    listaEndereco.innerHTML = "<li>Não há lojas nesse local </li>";
  }
});

// Função para preencher a lista de resultados
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

  // Criar um item de lista para cada endereco unico
  enderecosUnicos.forEach((enderecoUnico) => {
    const li = document.createElement("li");
    li.classList.add("endereco-item");

    li.innerHTML = `<span>${enderecoUnico}</span>`;

    li.dataset.enderecoCompleto = enderecoUnico;

    li.addEventListener("click", () => {
      dropdownEndereco.classList.remove("show");

      const lojasNoEndereco = lojas.filter(
        (loja) => loja.ENDERECO === enderecoUnico
      );

      console.log(
        `Endereço selecionado. Total de lojas encontradas: ${lojasNoEndereco.length}`
      );

      window.location.href = `/assets/pages/lojaPorEndereco.html?endereco=${encodeURIComponent(
        enderecoUnico
      )}`;
    });

    listaEndereco.appendChild(li);
  });
}

carregarCategorias();

function removerRepetidosPorLoja(lista) {
  const lojasVistas = new Set();
  return lista.filter((item) => {
    if (lojasVistas.has(item.LOJA.ID_LOJA)) return false;
    lojasVistas.add(item.LOJA.ID_LOJA);
    return true;
  });
}

// Filtro de cupons por data de início
const inputDataInicio = document.getElementById("input-data-inicio");

if (inputDataInicio) {
  inputDataInicio.addEventListener("input", () => {
    let valor = inputDataInicio.value.replace(/\D/g, "");

    // Formatação automática AAAA/MM/DD
    if (valor.length > 4 && valor.length <= 6) {
      valor = valor.replace(/(\d{4})(\d{1,2})/, "$1/$2");
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{4})(\d{2})(\d{1,2})/, "$1-$2-$3");
    }

    inputDataInicio.value = valor;
  });

  inputDataInicio.addEventListener("change", () => {
    const data = inputDataInicio.value.trim();
    if (!data) return;

    // Redireciona para página filtrada
    window.location.href = `/assets/pages/cupons.html?data_inicio_filtro=${data}`;
  });
}

// Carregar pesquisa de descontos por título e cupons por código e título em placeholder
function redirecionarParaLoja(idLoja) {
  const urlRedirecionamento = `/assets/pages/paginaLojas.html?id=${idLoja}`;

  dropdown.classList.remove("show");

  window.location.href = urlRedirecionamento;
}

document.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target) && event.target !== input) {
    dropdown.classList.remove("show");
  }
});

const input = document.getElementById("input-busca");
const dropdown = document.getElementById("dropdown-resultados");
let listaResultadosBusca = document.getElementById(
  "lista-resultados-busca-principal"
);
if (!listaResultadosBusca) {
  listaResultadosBusca = document.createElement("div"); // Usamos div para manter a classe 'dropdown-item'
  listaResultadosBusca.id = "lista-resultados-busca-principal";
  dropdown.appendChild(listaResultadosBusca);
}

input.addEventListener("input", async () => {
  const termo = input.value.trim();

  if (termo.length < 3) {
    listaResultadosBusca.innerHTML = `<div class="dropdown-item">Digite ao menos 3 caracteres...</div>`;
    dropdown.classList.add("show");
    return;
  }

  try {
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
      descontos = (await resDescontos.json()) || [];
    }

    if (resCupons.ok) {
      cupons = (await resCupons.json()) || [];
    }

    const resultadosMapeados = [
      ...descontos.map((d) => ({
        idLoja: d.ID_LOJA,
        tipo: "Desconto",
        texto: d.TITULO,
      })),
      ...cupons.map((c) => ({
        idLoja: c.ID_LOJA,
        tipo: "Cupom",
        texto: `${c.TITULO} (${c.CODIGO})`,
      })),
    ];

    renderizarResultados(resultadosMapeados);
  } catch (err) {
    console.error("Erro na busca:", err);
    listaResultadosBusca.innerHTML = `<div class="dropdown-item">Erro ao buscar dados.</div>`;
    dropdown.classList.add("show");
  }
});

function renderizarResultados(resultados) {
  listaResultadosBusca.innerHTML = ""; // Limpa resultados anteriores

  if (resultados.length === 0) {
    listaResultadosBusca.innerHTML = `<div class="dropdown-item">Nenhum resultado encontrado</div>`;
    dropdown.classList.add("show");
    return;
  }

  resultados.forEach((r) => {
    const item = document.createElement("div");
    item.classList.add("dropdown-item");

    item.innerHTML = `
            <strong>${r.tipo}:</strong> ${r.texto}
        `;

    item.addEventListener("click", () => {
      redirecionarParaLoja(r.idLoja);
    });

    listaResultadosBusca.appendChild(item);
  });

  dropdown.classList.add("show");
}
