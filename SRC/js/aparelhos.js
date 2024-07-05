// Função para inicializar o carrossel
function initCarrossel() {
    const carrosselWrapper = document.querySelector('.carrossel-wrapper');
    const filmes = document.querySelectorAll('.filme');

    let currentIndex = 0;
    const totalFilmes = filmes.length;
    const slideWidth = filmes[0].offsetWidth;
    const slidesPerPage = Math.floor(carrosselWrapper.clientWidth / slideWidth);

    // Configura o tamanho do wrapper do carrossel
    carrosselWrapper.style.width = `${slideWidth * totalFilmes}px`;

    // Função para avançar o carrossel
    function nextSlide() {
        if (currentIndex < totalFilmes - slidesPerPage) {
            currentIndex++;
            carrosselWrapper.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        }
    }

    // Função para voltar o carrossel
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            carrosselWrapper.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        }
    }

    // Event listeners para os botões de navegação
    document.getElementById('prevBtn').addEventListener('click', prevSlide);
    document.getElementById('nextBtn').addEventListener('click', nextSlide);
}

// Carrega o carrossel ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    initCarrossel();
});
