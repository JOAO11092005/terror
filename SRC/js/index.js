// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC2U69m-BT92vckB_wzziSJB9F8cCB0YBo",
    authDomain: "filme-terror.firebaseapp.com",
    databaseURL: "https://filme-terror-default-rtdb.firebaseio.com",
    projectId: "filme-terror",
    storageBucket: "filme-terror.appspot.com",
    messagingSenderId: "700657136479",
    appId: "1:700657136479:web:6c42f535edd24bd25f7cea"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Referência ao Realtime Database
const database = firebase.database();

let filmes = [];

// Função para carregar os filmes do banco de dados
async function loadFilmes() {
    try {
        const snapshot = await database.ref('filmes').once('value');
        filmes = Object.values(snapshot.val());
        displayFilmes(filmes);
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
    }
}

// Função para exibir os filmes na página inicial
function displayFilmes(filmesParaExibir) {
    const movieContainer = document.getElementById('movie-container');
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    filmesParaExibir.forEach(filme => {
        const filmeElement = document.createElement('div');
        filmeElement.classList.add('filme');

        const logoImg = document.createElement('img');
        logoImg.src = filme.logo;
        logoImg.alt = filme.titulo;

        const tituloElement = document.createElement('h3');
        tituloElement.textContent = filme.titulo;

        const descricaoElement = document.createElement('p');
        descricaoElement.textContent = filme.descricao;

        filmeElement.addEventListener('click', function() {
            sessionStorage.setItem('filmeSelecionado', JSON.stringify(filme));
            window.location.href = './player.html';
        });

        filmeElement.appendChild(logoImg);
        filmeElement.appendChild(tituloElement);
        filmeElement.appendChild(descricaoElement);

        movieContainer.appendChild(filmeElement);
    });
}

// Função para pesquisar filmes com tradução
async function pesquisarFilmes() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const translatedInput = await traduzirTexto(searchInput); // Traduzir o texto digitado
    const movieContainer = document.getElementById('movie-container');
    movieContainer.innerHTML = '';

    const filmesFiltrados = filmes.filter(filme =>
        filme.titulo.toLowerCase().includes(translatedInput) ||
        filme.titulo.toLowerCase().includes(searchInput)
    );

    if (filmesFiltrados.length > 0) {
        displayFilmes(filmesFiltrados);
    } else {
        const mensagemElement = document.createElement('p');
        mensagemElement.textContent = 'Nenhum filme encontrado.';
        movieContainer.appendChild(mensagemElement);
    }
}

// Função para traduzir texto usando a API do Translated.net
async function traduzirTexto(texto) {
    return texto.toLowerCase(); // Agora simplesmente retorna o texto em minúsculas sem tradução
}

// Função para definir cookies
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Função para obter cookies
function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Exibir a mensagem do adblock apenas se o cookie não estiver definido
function checkAdblockMessage() {
    const adblockMessage = document.getElementById('adblock-message');
    const adblockCookie = getCookie("adblockMessageClosed");
    if (adblockCookie) {
        adblockMessage.style.display = "none";
    } else {
        adblockMessage.style.display = "flex";
    }
}

document.getElementById('close-adblock-message').addEventListener('click', function() {
    const adblockMessage = document.getElementById('adblock-message');
    adblockMessage.style.display = 'none';
    setCookie("adblockMessageClosed", "true", 30); // Define o cookie por 30 dias
});

// Adicionar evento para pesquisa ao pressionar Enter
document.getElementById('searchInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        pesquisarFilmes();
    }
});

// Adicionar evento para pesquisa ao clicar no ícone de busca
document.getElementById('searchButton').addEventListener('click', pesquisarFilmes);

// Carregar filmes ao carregar a página
window.onload = function() {
    loadFilmes();
    checkAdblockMessage();
};

// Adicionar evento ao botão de enviar pedido
document.getElementById('botaopedido').addEventListener('click', enviarPedido);

// Função para enviar o pedido de filme ao Firebase
function enviarPedido(event) {
    event.preventDefault();
    
    const pedidoInput = document.getElementById('pedido');
    const filmePedido = pedidoInput.value.trim();

    if (filmePedido !== '') {
        const pedidosRef = database.ref('pedidos');
        
        pedidosRef.push({
            filme: filmePedido,
            status: 'Pendente'
        }).then(() => {
            // Limpar o campo após enviar
            pedidoInput.value = '';

            // Mostrar modal de confirmação
            const confirmacaoModal = document.getElementById('confirmacaoModal');
            confirmacaoModal.style.display = 'block'; // Mostrar modal

            // Mostrar mensagem de sucesso
            mostrarMensagem('Pedido enviado com sucesso!');

            // Esconder modal após 5 segundos
            setTimeout(() => {
                confirmacaoModal.style.display = 'none';
            }, 5000); // 5000 milissegundos = 5 segundos
        }).catch(error => {
            console.error('Erro ao enviar pedido:', error);
        });
    } else {
        alert('Por favor, digite o nome do filme.');
    }
}

// Função para exibir mensagem na tela
function mostrarMensagem(mensagem) {
    const mensagemElement = document.createElement('div');
    mensagemElement.classList.add('mensagem');
    mensagemElement.textContent = mensagem;

    document.body.appendChild(mensagemElement);

    setTimeout(() => {
        mensagemElement.remove();
    }, 3000); // Remove a mensagem após 3 segundos
}
