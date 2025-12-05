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

      containerCupons.appendChild(card);
    });
  } catch (erro) {
    console.error("Erro ao carregar cupons:", erro);
  }
}

carregarCupons();
