const username = 'JOAO11092005'; // Seu nome de usuário no GitHub
const repo = 'terror'; // Nome do seu repositório onde está o arquivo filmes.json
const path = 'filmes.json'; // Caminho para o arquivo filmes.json
const token = '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'; // Seu token de acesso pessoal do GitHub

// Função para carregar os filmes do arquivo filmes.json
async function loadFilmes() {
    try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
            headers: {
                Authorization: `token ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            // Decodifica o conteúdo do arquivo base64
            const conteudo = atob(data.content);
            const filmes = JSON.parse(conteudo);
            return filmes;
        } else {
            throw new Error(`Erro ao carregar filmes: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        throw error;
    }
}

// Função para exibir os filmes na página inicial
async function exibirFilmes() {
    try {
        const filmes = await loadFilmes();
        const movieContainer = document.getElementById('movie-container');

        filmes.forEach(filme => {
            const filmeElement = document.createElement('div');
            filmeElement.classList.add('filme');

            const logoImg = document.createElement('img');
            logoImg.src = filme.logo;
            logoImg.alt = filme.titulo;

            const tituloElement = document.createElement('h3');
            tituloElement.textContent = filme.titulo;

            const descricaoElement = document.createElement('p');
            descricaoElement.textContent = filme.descricao;

            // Adiciona um evento de clique para redirecionar para player.html com os detalhes do filme
            filmeElement.addEventListener('click', function() {
                sessionStorage.setItem('filmeSelecionado', JSON.stringify(filme));
                window.location.href = './player.html';
            });

            filmeElement.appendChild(logoImg);
            filmeElement.appendChild(tituloElement);
            filmeElement.appendChild(descricaoElement);

            movieContainer.appendChild(filmeElement);
        });
    } catch (error) {
        console.error('Erro ao exibir filmes:', error);
    }
}

// Função para pesquisar filmes
async function pesquisarFilmes() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const movieContainer = document.getElementById('movie-container');
    const loadingElement = document.createElement('div');
    loadingElement.classList.add('loading');
    loadingElement.innerHTML = '<div class="loading-circle"></div><p class="p-loading" >Carregando filmes...</p>';
    movieContainer.innerHTML = '';
    movieContainer.appendChild(loadingElement);

    try {
        // Simulando um atraso de 6 segundos para o efeito de loading
        await new Promise(resolve => setTimeout(resolve, 6000));

        const filmes = await loadFilmes();
        const filmesFiltrados = filmes.filter(filme =>
            filme.titulo.toLowerCase().includes(searchInput)
        );

        movieContainer.innerHTML = '';

        if (filmesFiltrados.length > 0) {
            filmesFiltrados.forEach(filme => {
                const filmeElement = document.createElement('div');
                filmeElement.classList.add('filme');

                const logoImg = document.createElement('img');
                logoImg.src = filme.logo;
                logoImg.alt = filme.titulo;

                const tituloElement = document.createElement('h3');
                tituloElement.textContent = filme.titulo;

                const descricaoElement = document.createElement('p');
                descricaoElement.textContent = filme.descricao;

                // Adiciona um evento de clique para redirecionar para player.html com os detalhes do filme
                filmeElement.addEventListener('click', function() {
                    sessionStorage.setItem('filmeSelecionado', JSON.stringify(filme));
                    window.location.href = './player.html';
                });

                filmeElement.appendChild(logoImg);
                filmeElement.appendChild(tituloElement);
                filmeElement.appendChild(descricaoElement);

                movieContainer.appendChild(filmeElement);
            });
        } else {
            const mensagemElement = document.createElement('p');
            mensagemElement.textContent = 'Nenhum filme encontrado.';
            movieContainer.appendChild(mensagemElement);
        }
    } catch (error) {
        console.error('Erro ao pesquisar filmes:', error);
    }
}

// Carrega e exibe os filmes ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    exibirFilmes();

    // Adiciona um listener para o input de pesquisa
    document.getElementById('searchInput').addEventListener('input', pesquisarFilmes);
});
