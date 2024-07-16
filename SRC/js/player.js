document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há um filme selecionado armazenado no sessionStorage
    const filmeSelecionado = sessionStorage.getItem('filmeSelecionado');
    
    if (filmeSelecionado) {
        const filme = JSON.parse(filmeSelecionado);

        // Atualiza o título da página com o título do filme
        document.title = filme.titulo;

        // Atualiza o texto do <h1> com o título do filme
        const tituloElement = document.querySelector('h1');
        tituloElement.textContent = filme.titulo;

        // Atualiza o src do iframe com o link do vídeo do filme
        const iframeElement = document.querySelector('iframe');
        iframeElement.src = filme.video;

        // Adicionar evento quando o iframe terminar de carregar para iniciar o vídeo e colocar em fullscreen
        iframeElement.addEventListener('load', function() {
            // Iniciar a reprodução do vídeo
            iframeElement.play();

            // Entrar em modo fullscreen
            if (iframeElement.requestFullscreen) {
                iframeElement.requestFullscreen();
            } else if (iframeElement.webkitRequestFullscreen) { /* Safari */
                iframeElement.webkitRequestFullscreen();
            } else if (iframeElement.msRequestFullscreen) { /* IE11 */
                iframeElement.msRequestFullscreen();
            }
        });

        // Adicionar evento ao botão de enviar erro do filme
        const enviarErroButton = document.getElementById('enviarErro');
        enviarErroButton.addEventListener('click', function() {
            enviarErro(filme);
        });

    } else {
        // Caso não haja filme selecionado, redireciona de volta para index.html
        window.location.href = './index.html';
    }
});

// Função para enviar erro específico do filme ao Firebase
function enviarErro(filme) {
    const errosRef = firebase.database().ref('erros');

    errosRef.push({
        filmeId: filme.id,
        titulo: filme.titulo,
        mensagem: 'Ocorreu um erro neste filme. Por favor, verifique.'
    }).then(() => {
        // Mostrar mensagem de sucesso
        mostrarMensagem('Erro enviado com sucesso para o administrador.');

        // Limpar sessionStorage do filme selecionado após enviar o erro
        sessionStorage.removeItem('filmeSelecionado');
    }).catch(error => {
        console.error('Erro ao enviar erro:', error);
    });
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
