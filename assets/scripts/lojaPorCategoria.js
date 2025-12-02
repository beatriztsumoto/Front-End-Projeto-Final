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
    // Chama o endpoint correto do seu backend
    const response = await fetch(
      `http://localhost:3000/lojas?categoria=${encodeURIComponent(categoria)}`
    );

    const json = await response.json();
    const lojas = json.lojas; // { status, success, lojas:[...] }

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

// Renderiza os cards
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
      <p>${loja.ENDERECO ?? "Endereço não informado"}</p>
    `;

    // Vai para a página detalhes da loja
    card.addEventListener("click", () => {
      window.location.href = `/assets/pages/paginaLojas.html?id=${loja.ID_LOJA}`;
    });

    container.appendChild(card);
  });
}

// Executa ao carregar a página
carregarLojasPorCategoria();