document.addEventListener('DOMContentLoaded', () => {
    const esqueceuSenha = document.querySelector('.forgot-password');
    const popupOverlay = document.getElementById('popupOverlay');
    const btnOk = document.getElementById('btnOk');

    esqueceuSenha.addEventListener('click', function(e) {
        e.preventDefault();
        popupOverlay.classList.add('active');
    });

    btnOk.addEventListener('click', function() {
        popupOverlay.classList.remove('active');
    });

    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove('active');
        }
    });

    const loginForm = document.getElementById('loginEmpresaForm');
    const nomeFantasiaInput = document.getElementById('nomeFantasia');
    const senhaInput = document.getElementById('senha');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nomeFantasia = nomeFantasiaInput.value.trim();
        const senha = senhaInput.value;
        const rememberMe = document.getElementById('lembrar').checked;

        console.log('Tentativa de Login de Empresa:');
        console.log(`Nome Fantasia: ${nomeFantasia}`);
        console.log(`Senha: [PROTEGIDA]`);
        console.log(`Lembrar de mim: ${rememberMe}`);

        if (nomeFantasia === '' || senha === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const NOME_TESTE = 'Minha Loja';
        const SENHA_TESTE = 'loja123';

        if (nomeFantasia === NOME_TESTE && senha === SENHA_TESTE) {
            alert(`Bem-vindo(a), ${nomeFantasia}! Login de empresa realizado com sucesso!`);
            
            window.location.href = '/index.html'; 

        } else {
            alert('Erro: Nome Fantasia ou senha incorretos. (Apenas simulação)');
            
            senhaInput.value = '';
        }
    });
});