document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');


    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        const rememberMe = document.getElementById('lembrar').checked;

        console.log('Tentativa de Login:');
        console.log(`Usuário: ${username}`);
        console.log(`Senha: ${password}`);
        console.log(`Lembrar de mim: ${rememberMe}`);

        if (username === '' || password === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const USUARIO_TESTE = 'cliente@teste.com';
        const SENHA_TESTE = '123456';

        if (username === USUARIO_TESTE && password === SENHA_TESTE) {
            alert(`Bem-vindo, ${username}! Login realizado com sucesso!`);
            
            window.location.href = '/index.html'; 

        } else {
            alert('Erro: Usuário ou senha incorretos. (Apenas simulação)');
            
            passwordInput.value = '';
        }
    });
});