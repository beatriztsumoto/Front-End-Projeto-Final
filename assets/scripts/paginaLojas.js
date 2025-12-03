function removerRepetidosPorLoja(lista) {
  const lojasVistas = new Set();
  return lista.filter((item) => {
    if (lojasVistas.has(item.LOJA.ID_LOJA)) return false;
    lojasVistas.add(item.LOJA.ID_LOJA);
    return true;
  });
}

async function carregarPaginaLoja() {
  const params = new URLSearchParams(window.location.search);
  const idLoja = params.get("id");

  if (!idLoja) {
    console.error("Nenhum ID de loja informado na URL.");
    return;
  }

  try {
    // Busca loja + cupons + descontos
    const res = await fetch(
      `http://localhost:3000/lojas/${idLoja}/relacionados`
    );

    if (!res.ok) {
      console.error(`Falha ao buscar dados. Status: ${res.status}`);
      return;
    }

    const data = await res.json();
    const loja = data.loja;

    if (!loja) {
      console.error("Loja não encontrada na resposta da API");
      return;
    }

    // Preenche dados da loja
    document.getElementById("loja-nome").textContent = loja.NOME_FANTASIA;
    document.getElementById(
      "loja-title"
    ).textContent = `Cupons e Descontos ${loja.NOME_FANTASIA}`;
    document.getElementById("featured-logo").src = loja.LOGO;

    // CUPOM EM DESTAQUE — agora vem de loja.CUPONS
    if (loja.CUPONS && loja.CUPONS.length > 0) {
      const destaque = loja.CUPONS[0];

      document.getElementById("featured-title").textContent = destaque.TITULO;
      document.getElementById("featured-description").textContent =
        destaque.DESCRICAO;
    }
  } catch (erro) {
    console.error("Erro geral durante o carregamento da página:", erro);
  }
}

carregarPaginaLoja();

const params = new URLSearchParams(window.location.search);
const idLoja = params.get("id");
async function carregarDescontos(lojaId) {
  const res = await fetch(`http://localhost:3000/lojas/${lojaId}/relacionados`);
  const data = await res.json();

  // AGORA CERTO
  const descontos = data.loja.DESCONTOS || [];

  const grid = document.getElementById("descontos-grid");

  grid.innerHTML = ""; // limpar antes de preencher

  descontos.forEach((item, index) => {
    let tag = "";
    if (index === 0) tag = `<div class="coupon-tag hot">HOT</div>`;
    else if (index === 1) tag = `<div class="coupon-tag new">NOVO</div>`;

    const html = `
            <div class="coupon-item">
                ${tag}
                <div class="coupon-discount">
                    <img src="${item.FOTO_ITEM}" class="discount-image" alt="Produto">
                </div>
                <div class="coupon-body">
                    <h4>${item.TITULO}</h4>
                    <p>${item.DESCRICAO}</p>
                    <div class="coupon-validity">
                        <span>${item.CATEGORIA}</span>
                    </div>
                    <div class="coupon-category">
                        <span>Por apenas R$${item.VALOR_DESCONTO}</span>
                    </div>
                </div>
                <button class="btn-coupon">Ver Oferta</button>
            </div>
        `;

    grid.insertAdjacentHTML("beforeend", html);
  });
}

carregarDescontos(idLoja);

async function carregarCupons(lojaId) {
  const res = await fetch(`http://localhost:3000/lojas/${lojaId}/relacionados`);
  const data = await res.json();

  const cupons = data && data.loja && data.loja.CUPONS ? data.loja.CUPONS : [];
  const loja = data.loja;

  const grid = document.querySelector(".coupons-grid");
  grid.innerHTML = "";

  cupons.forEach((cupom, index) => {
    // TAGS HOT / NOVO
    let tag = "";
    if (index === 0) tag = `<div class="coupon-tag hot">HOT</div>`;
    else if (index === 1) tag = `<div class="coupon-tag new">NOVO</div>`;

    // Formatar data dd/mm
    const validade = new Date(cupom.VALIDADE);
    const validadeFormatada = validade.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });

    const html = `
            <div class="coupon-item">
                ${tag}

                <!-- QUADRADO AZUL: agora tem LOGO e TÍTULO DO CUPOM -->
                <div class="coupon-container">
                    <img src="${loja.LOGO}" class="discount-logo" alt="Logo da loja">
                    <span class="discount-label">${cupom.TITULO}</span>
                </div>

                <div class="coupon-body">
                    <h4>${cupom.CODIGO}</h4> <!-- Código do cupom -->
                    <p>${cupom.DESCRICAO}</p> <!-- Descrição -->
                    <div class="coupon-validity">
                        <span>Válido até ${validadeFormatada}</span>
                    </div>
                </div>

                <button class="btn-coupon">Ver Oferta</button>
            </div>
        `;

    grid.insertAdjacentHTML("beforeend", html);
  });
}

carregarCupons(idLoja);
