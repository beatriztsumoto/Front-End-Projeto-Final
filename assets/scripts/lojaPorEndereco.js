async function carregarLojasPorEndereco() {
  const params = new URLSearchParams(window.location.search);
  const endereco = params.get("endereco");

  if (!endereco) {
    console.error("Nenhum endereco informado na URL.");
    return;
  }

  // Atualiza o título da página
  document.getElementById("titulo-endereco").textContent =
    `Lojas do endereco: ${endereco}`;

  try {
    const response = await fetch(
      `http://localhost:3000/lojas?endereco=${encodeURIComponent(endereco)}`
    );

    const json = await response.json();
    const lojas = json.lojas; 

    if (!lojas || lojas.length === 0) {
      document.getElementById("lista-lojas").innerHTML =
        "<p>Nenhuma loja encontrada nesse endereco.</p>";
      return;
    }

    exibirLojas(lojas);

  } catch (error) {
    console.error("Erro ao carregar lojas:", error);
  }
}

// cards
function exibirLojas(lojas) {
  const container = document.getElementById("lista-lojas-endereco");

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

carregarLojasPorEndereco();