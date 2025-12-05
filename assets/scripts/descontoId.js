async function carregarDesconto() {
    const params = new URLSearchParams(window.location.search);
    const idDesconto = params.get("id");
  
    if (!idDesconto) {
      console.error("Nenhum ID de desconto informado na URL");
      return;
    }
  
    try {
      // Buscar desconto por ID
      const resp = await fetch(`http://localhost:3000/descontos/${idDesconto}`);
      const data = await resp.json();
  
      if (!data.desconto) {
        console.error("Desconto não encontrado");
        return;
      }
  
      const desconto = data.desconto;
  
      // Buscar a loja do desconto
      const respLoja = await fetch(`http://localhost:3000/lojas/${desconto.ID_LOJA}`);
      const dataLoja = await respLoja.json();
  
      const loja = dataLoja.loja;
  
      // Renderizar tudo
      renderizarDesconto(desconto, loja);
  
    } catch (erro) {
      console.error("Erro ao carregar desconto:", erro);
    }
  }
  
  function renderizarDesconto(d, loja) {
    const container = document.getElementById("desconto");
  
    container.innerHTML = `
      <div class="desconto-card">
  
        <div class="loja-info">
          <img src="${loja.LOGO}" class="logo-loja" alt="Logo da loja">
          <h2>${loja.NOME_FANTASIA}</h2>
        </div>
  
        <h1>${d.TITULO}</h1>
  
        <img src="${d.FOTO_ITEM}" class="foto-desconto">
  
        <p class="descricao">${d.DESCRICAO}</p>
  
        <p class="valor">
          <strong>Valor do desconto:</strong> R$ ${parseFloat(d.VALOR_DESCONTO).toFixed(2)}
        </p>
  
      </div>
    `;
  }
  
  carregarDesconto();
  