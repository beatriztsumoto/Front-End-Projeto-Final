function removerRepetidosPorLoja(lista) {
  const lojasVistas = new Set();
  return lista.filter((item) => {
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
    const descontosSemRepetir = removerRepetidosPorLoja(listaDescontos).slice(
      0,
      10
    );

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

    alternados.forEach((item) => {
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
            <span class="cashback">${
              d.CASHBACK ? d.CASHBACK : "Sem cashback"
            }</span>
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
            <span class="valor-desconto">- R$ ${parseFloat(
              d.VALOR_DESCONTO
            ).toFixed(2)}</span>
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
