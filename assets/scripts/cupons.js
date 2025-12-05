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
          <p class="codigo">${cupom.CODIGO}</p>

        </div>
      `;

      card.addEventListener("click", () => {
        window.location.href = `/assets/pages/cupomId.html?id=${cupom.ID_CUPOM}`;
      });

      containerCupons.appendChild(card);
    });
  } catch (erro) {
    console.error("Erro ao carregar cupons:", erro);
  }
}

async function carregarCuponsComFiltro(dataInicio) {
  try {
    const response = await fetch(
      `http://localhost:3000/cupons?data_inicio_filtro=${encodeURIComponent(dataInicio)}`
    );

    const data = await response.json();
    const cupons = data.cupons || [];

    containerCupons.innerHTML = "";

    if (cupons.length === 0) {
      containerCupons.innerHTML = `<p>Nenhum cupom encontrado para esta data.</p>`;
      return;
    }

    cupons.forEach((cupom) => {
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
          <p class="codigo">${cupom.CODIGO}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        window.location.href = `/assets/pages/cupomId.html?id=${cupom.ID_CUPOM}`;
      });

      containerCupons.appendChild(card);
    });

  } catch (erro) {
    console.error("Erro ao filtrar cupons:", erro);
  }
}

const params = new URLSearchParams(window.location.search);
const dataFiltro = params.get("data_inicio_filtro");
const tituloPagina = document.getElementById("titulo-cupons");

if (dataFiltro) {
  tituloPagina.textContent = `Cupons com início a partir de: ${dataFiltro}`;
  console.log("Filtro de data detectado:", dataFiltro);
  carregarCuponsComFiltro(dataFiltro);
} else {
  tituloPagina.textContent = "Cupons";
  carregarCupons();
}
