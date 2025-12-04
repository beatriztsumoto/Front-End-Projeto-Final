async function carregarLojasPorCategoria() {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (!categoria) {
    console.error("Nenhuma categoria informada na URL.");
    return;
  }

  // Atualiza o título da página
  document.getElementById("titulo-categoria").textContent =
    `Lojas da categoria: ${categoria}`;

  try {
    const response = await fetch(
      `http://localhost:3000/lojas?categoria=${encodeURIComponent(categoria)}`
    );

    const json = await response.json();
    const lojas = json.lojas; 

    if (!lojas || lojas.length === 0) {
      document.getElementById("lista-lojas").innerHTML =
        "<p>Nenhuma loja encontrada nessa categoria.</p>";
      return;
    }

    exibirLojas(lojas);

  } catch (error) {
    console.error("Erro ao carregar lojas:", error);
  }
}

// cards
function exibirLojas(lojas) {
  const container = document.getElementById("lista-lojas-categoria");

  if (!container) {
    console.error("Elemento #lista-lojas não encontrado no HTML.");
    return;
  }

  container.innerHTML = "";

  lojas.forEach(loja => {
    const card = document.createElement("div");
    card.classList.add("card-loja");

    card.innerHTML = `
      <img src="${loja.LOGO}" alt="${loja.NOME_FANTASIA}">
      <h3>${loja.NOME_FANTASIA}</h3>
      <p>${loja.CATEGORIA}</p>
    `;

    // Vai para a página detalhes da loja
    card.addEventListener("click", () => {
      window.location.href = `/assets/pages/paginaLojas.html?id=${loja.ID_LOJA}`;
    });

    container.appendChild(card);
  });
}

carregarLojasPorCategoria();