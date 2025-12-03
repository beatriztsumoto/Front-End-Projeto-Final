const containerDescontos = document.getElementById("lista-descontos");

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
