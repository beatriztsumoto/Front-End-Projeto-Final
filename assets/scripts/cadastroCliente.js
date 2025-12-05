document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.querySelector('form');
    
    const inputs = cadastroForm.querySelectorAll('input');
    
    const nomeInput = inputs[0];
    const emailInput = inputs[1];
    const telefoneInput = inputs[2];
    const senhaInput = inputs[3];
    const confirmarSenhaInput = inputs[4];
    const cepInput = inputs[5];
    const lembrarInput = inputs[6];

    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const telefone = telefoneInput.value.trim();
        const senha = senhaInput.value;
        const confirmarSenha = confirmarSenhaInput.value;
        const cep = cepInput.value.trim();
        const lembrar = lembrarInput.checked;

        if (senha !== confirmarSenha) {
            alert('Erro: As senhas não coincidem. Por favor, verifique.');
            senhaInput.value = '';
            confirmarSenhaInput.value = '';
            return;
        }

        if (nome === '' || email === '' || senha === '' || confirmarSenha === '' || cep === '') {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        console.log('Dados do Cadastro de Cliente Coletados:');
        console.log({ 
            nome: nome, 
            email: email, 
            telefone: telefone, 
            cep: cep, 
            lembrar: lembrar,
            senha: '[PROTEGIDA]' 
        });
        
        console.log('Simulando envio dos dados de cadastro para o servidor...');
        
        setTimeout(() => {
            alert('🎉 Cadastro de Cliente realizado com sucesso! Você será redirecionado para a página inicial.');
            
            window.location.href = '/index.html'; 
            
        }, 1000); 
    });
});