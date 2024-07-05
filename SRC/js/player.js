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
    } else {
        // Caso não haja filme selecionado, redireciona de volta para index.html
        window.location.href = './index.html';
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o elemento iframe
    const iframeElement = document.querySelector('iframe');

    // Reproduz o vídeo quando a página carrega
    iframeElement.addEventListener('load', function() {
        // Inicia a reprodução do vídeo
        iframeElement.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        
        // Ativa o modo de tela cheia após o vídeo iniciar
        iframeElement.contentWindow.postMessage('{"event":"command","func":"fullscreen","args":""}', '*');
    });
});
