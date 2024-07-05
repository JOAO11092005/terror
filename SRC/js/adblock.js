document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário já instalou o AdBlock
    const adBlockInstalled = getCookie('adBlockInstalled');

    if (!adBlockInstalled) {
        // Mostra a mensagem para instalar o AdBlock
        const adBlockInstallMessage = document.createElement('div');
        adBlockInstallMessage.classList.add('adblock-install-message');
        adBlockInstallMessage.innerHTML = `
            <p>Para assistir aos filmes sem anúncios, instale o AdBlock.</p>
            <p>Para instalar o AdBlock, <a href="https://chromewebstore.google.com/detail/adblock-plus-bloqueador-d/cfhdojbkjhnklbpkdaibdccddilifddb" target="_blank">clique aqui</a>.</p>
            <p>Após instalar, aguarde e recarregue a página.</p>
            <button onclick="installAdBlock()">Concluir</button>
        `;
        document.body.appendChild(adBlockInstallMessage);
    }
});

// Função para definir um cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
}

// Função para obter o valor de um cookie
function getCookie(name) {
    const cookieName = name + '=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}

// Função para instalar o AdBlock (simulação)
function installAdBlock() {
    // Simulação de instalação do AdBlock
    setCookie('adBlockInstalled', 'true', 365); // Define o cookie por 1 ano
    // Remove a mensagem de instalação do AdBlock
    const adBlockInstallMessage = document.querySelector('.adblock-install-message');
    if (adBlockInstallMessage) {
        adBlockInstallMessage.remove();
    }
}