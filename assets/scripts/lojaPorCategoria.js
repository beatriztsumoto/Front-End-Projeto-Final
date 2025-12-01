async function carregarLojasDaCategoria() {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (!categoria) return;

  // pega lojas do backend filtrando já pela categoria
  const response = await fetch(`http://localhost:3000/lojas?categoria=${categoria}`);
  const lojas = await response.json();

  exibirLojas(lojas);
}

function exibirLojas(lojas) {
  const container = document.getElementById("lista-lojas");
  container.innerHTML = "";

  lojas.forEach(loja => {
    const card = document.createElement("div");
    card.classList.add("card-loja");

    card.innerHTML = `
      <img src="${loja.LOGO}" alt="${loja.NOME_FANTASIA}">
      <h3>${loja.NOME_FANTASIA}</h3>
      <p>${loja.ENDERECO}</p>
    `;

    // clique para ir para a página da loja
    card.addEventListener("click", () => {
      window.location.href = `./paginaLojas.html?id=${loja.ID_LOJA}`;
    });

    container.appendChild(card);
  });
}

carregarLojasDaCategoria();
