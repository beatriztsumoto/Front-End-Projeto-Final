async function carregarCupom() {
    const params = new URLSearchParams(window.location.search);
    const idCupom = params.get("id");
  
    if (!idCupom) {
      console.error("Nenhum ID informado na URL");
      return;
    }
  
    try {
      // 👉 1) Buscar o cupom
      const resp = await fetch(`http://localhost:3000/cupons/${idCupom}`);
      const data = await resp.json();
  
      if (!data.cupom) {
        console.error("Cupom não encontrado");
        return;
      }
  
      const cupom = data.cupom;
  
      // 👉 2) Buscar a loja referente ao cupom
      const respLoja = await fetch(`http://localhost:3000/lojas/${cupom.ID_LOJA}`);
      const dataLoja = await respLoja.json();
  
      const loja = dataLoja.loja; // <-- CORRETO conforme sua API
  
      // 👉 3) Renderizar tudo
      renderizarCupom(cupom, loja);
  
    } catch (erro) {
      console.error("Erro ao carregar cupom:", erro);
    }
  }
  
  function renderizarCupom(c, loja) {
    const container = document.getElementById("cupom");
  
    const validadeFormatada = new Date(c.VALIDADE).toLocaleDateString("pt-BR");
    const dataInicioFormatado = new Date(c.DATA_INICIO).toLocaleDateString("pt-BR");
  
    container.innerHTML = `
      <div class="cupom-card">
  
        <div class="loja-info">
          <img src="${loja.LOGO}" class="logo-loja" alt="Logo da loja">
          <h2>${loja.NOME_FANTASIA}</h2>
        </div>
  
        <h1>${c.TITULO}</h1>
  
        <p class="descricao">${c.DESCRICAO}</p>
  
        <p class="codigo">
          <strong>Código:</strong> <span>${c.CODIGO}</span>
        </p>
  
        <p class="validade">
          <strong>Validade:</strong> ${validadeFormatada}
        </p>

        <p class="validade">
          <strong>Data Inicio:</strong> ${dataInicioFormatado}
        </p>
  
      </div>
    `;
  }
  
  carregarCupom();
  
  