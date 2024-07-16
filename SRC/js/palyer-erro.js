// Inicializa o Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC2U69m-BT92vckB_wzziSJB9F8cCB0YBo",
    authDomain: "filme-terror.firebaseapp.com",
    databaseURL: "https://filme-terror-default-rtdb.firebaseio.com",
    projectId: "filme-terror",
    storageBucket: "filme-terror.appspot.com",
    messagingSenderId: "700657136479",
    appId: "1:700657136479:web:6c42f535edd24bd25f7cea"
};

// Verifica se o Firebase já está inicializado antes de inicializá-lo novamente
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Função para enviar erro específico do filme ao Firebase
function enviarErro(filme) {
    const errosRef = firebase.database().ref('erros');

    errosRef.push({
        filmeId: filme.id,
        titulo: filme.titulo,
        mensagem: 'Ocorreu um erro neste filme. Por favor, verifique.'
    }).then(() => {
        // Mostrar mensagem de sucesso
        const mensagemEnviado = document.getElementById('mensagemEnviado');
        mensagemEnviado.style.display = 'block';

        // Limpar sessionStorage do filme selecionado após enviar o erro
        sessionStorage.removeItem('filmeSelecionado');

        // Esconder a mensagem após 3 segundos
        setTimeout(() => {
            mensagemEnviado.style.display = 'none';
        }, 3000);

    }).catch(error => {
        console.error('Erro ao enviar erro:', error);
    });
}

// Evento de clique no botão "Enviar erro"
document.addEventListener('DOMContentLoaded', function() {
    const enviarErroButton = document.getElementById('enviarErro');
    enviarErroButton.addEventListener('click', function() {
        // Verifica se há um filme selecionado armazenado no sessionStorage
        const filmeSelecionado = sessionStorage.getItem('filmeSelecionado');

        if (filmeSelecionado) {
            const filme = JSON.parse(filmeSelecionado);
            enviarErro(filme);
        }
    });
});
// Inicializa o Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC2U69m-BT92vckB_wzziSJB9F8cCB0YBo",
    authDomain: "filme-terror.firebaseapp.com",
    databaseURL: "https://filme-terror-default-rtdb.firebaseio.com",
    projectId: "filme-terror",
    storageBucket: "filme-terror.appspot.com",
    messagingSenderId: "700657136479",
    appId: "1:700657136479:web:6c42f535edd24bd25f7cea"
};

// Verifica se o Firebase já está inicializado antes de inicializá-lo novamente
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Função para enviar erro específico do filme ao Firebase
function enviarErro(filme) {
    const errosRef = firebase.database().ref('erros');

    errosRef.push({
        filmeId: filme.id,
        titulo: filme.titulo,
        mensagem: 'Ocorreu um erro neste filme. Por favor, verifique.'
    }).then(() => {
        // Mostrar mensagem de sucesso
        const mensagemEnviado = document.getElementById('mensagemEnviado');
        mensagemEnviado.style.display = 'block';

        // Limpar sessionStorage do filme selecionado após enviar o erro
        sessionStorage.removeItem('filmeSelecionado');

        // Esconder a mensagem após 3 segundos
        setTimeout(() => {
            mensagemEnviado.style.display = 'none';
        }, 3000);

    }).catch(error => {
        console.error('Erro ao enviar erro:', error);
    });
}

// Evento de clique no botão "Enviar erro"
document.addEventListener('DOMContentLoaded', function() {
    const enviarErroButton = document.getElementById('enviarErro');
    enviarErroButton.addEventListener('click', function() {
        // Verifica se há um filme selecionado armazenado no sessionStorage
        const filmeSelecionado = sessionStorage.getItem('filmeSelecionado');

        if (filmeSelecionado) {
            const filme = JSON.parse(filmeSelecionado);
            enviarErro(filme);
        }
    });
});
