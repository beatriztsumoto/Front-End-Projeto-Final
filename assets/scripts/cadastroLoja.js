document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.querySelector('form');
    
    const inputs = cadastroForm.querySelectorAll('input');
    
    const nomeLegalInput = inputs[0];
    const nomePublicoInput = inputs[1];
    const cnpjInput = inputs[2];
    const emailInput = inputs[3];
    const telefoneInput = inputs[4];
    const representanteInput = inputs[5];
    const senhaInput = inputs[6];
    const lembrarInput = inputs[7]; // checkbox

    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nomeLegal = nomeLegalInput.value.trim();
        const nomePublico = nomePublicoInput.value.trim();
        const cnpj = cnpjInput.value.trim();
        const email = emailInput.value.trim();
        const telefone = telefoneInput.value.trim();
        const representante = representanteInput.value.trim();
        const senha = senhaInput.value;
        const lembrar = lembrarInput.checked;

        if (nomeLegal === '' || nomePublico === '' || cnpj === '' || email === '' || representante === '' || senha === '') {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        console.log('Dados do Cadastro de Loja Coletados:');
        console.log({
            nomeLegal: nomeLegal, 
            nomePublico: nomePublico, 
            cnpj: cnpj, 
            email: email, 
            telefone: telefone, 
            representante: representante,
            senha: '[PROTEGIDA]',
            lembrar: lembrar
        });

        
        console.log('Simulando envio dos dados de cadastro da loja para o servidor...');
        
        setTimeout(() => {
            alert('🎉 Cadastro de Empresa realizado com sucesso! Você será redirecionado para a página inicial.');
            
            window.location.href = '/index.html'; 
            
        }, 1000); 
    });
});