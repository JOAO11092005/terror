const username = 'JOAO11092005'; // Seu nome de usuário no GitHub
const repo = 'terror'; // Nome do seu repositório onde está o filmes.json
const path = 'filmes.json'; // Caminho para o arquivo filmes.json
const token = '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'; // Seu token de acesso pessoal do GitHub

// Função para carregar os filmes atuais do arquivo filmes.json
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
            return {
                filmes: JSON.parse(conteudo),
                sha: data.sha // Salva o sha do arquivo para ser usado ao atualizar
            };
        } else {
            throw new Error(`Erro ao carregar filmes: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        throw error;
    }
}

// Função para verificar se um filme já existe pelo título
function filmeExiste(filmes, titulo) {
    return filmes.some(filme => filme.titulo === titulo);
}

// Função para adicionar um novo filme ao arquivo filmes.json
async function adicionarFilme(novoFilme) {
    try {
        const { filmes, sha } = await loadFilmes(); // Carrega os filmes atuais e o sha do arquivo

        // Verifica se o filme já existe pelo título
        if (filmeExiste(filmes, novoFilme.titulo)) {
            throw new Error(`O filme "${novoFilme.titulo}" já existe.`);
        }

        console.log('Filme não encontrado, adicionando novo filme...');

        filmes.push({
            titulo: novoFilme.titulo,
            descricao: novoFilme.descricao,
            logo: novoFilme.logo,
            video: novoFilme.video
        });

        const conteudo = JSON.stringify(filmes, null, 2); // Converte para JSON formatado

        // Codifica o conteúdo em base64
        const conteudoBase64 = btoa(unescape(encodeURIComponent(conteudo)));

        // Faz o commit da atualização para o GitHub
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Adiciona novo filme via API',
                content: conteudoBase64, // Envia diretamente o conteúdo base64
                sha: sha // Usa o sha do arquivo obtido na carga inicial do arquivo
            })
        });

        if (response.status === 200) {
            console.log('Filme adicionado com sucesso!');
            // Recarrega a lista de filmes após adição bem-sucedida
            carregarListaFilmes();
        } else {
            throw new Error(`Erro ao adicionar filme: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Erro ao adicionar filme:', error);
        throw error;
    }
}

// Função para carregar e exibir a lista de filmes
async function carregarListaFilmes() {
    try {
        const { filmes } = await loadFilmes();

        const filmesContainer = document.getElementById('movie-list-container');
        filmesContainer.innerHTML = ''; // Limpa o conteúdo atual da lista

        filmes.forEach(filme => {
            const filmeElement = document.createElement('div');
            filmeElement.classList.add('movie-item');

            const logoImg = document.createElement('img');
            logoImg.src = filme.logo;
            logoImg.alt = filme.titulo;

            const tituloElement = document.createElement('h3');
            tituloElement.textContent = filme.titulo;

            const descricaoElement = document.createElement('p');
            descricaoElement.textContent = filme.descricao;

            filmeElement.appendChild(logoImg);
            filmeElement.appendChild(tituloElement);
            filmeElement.appendChild(descricaoElement);

            filmesContainer.appendChild(filmeElement);
        });
    } catch (error) {
        console.error('Erro ao carregar lista de filmes:', error);
    }
}

// Captura o evento de submissão do formulário
const addMovieForm = document.getElementById('add-movie-form');
addMovieForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const logo = document.getElementById('logo').value;
    const video = document.getElementById('video').value;

    // Cria um objeto com os dados do novo filme
    const novoFilme = {
        titulo: title,
        descricao: description,
        logo: logo,
        video: video
    };

    // Adiciona o novo filme
    adicionarFilme(novoFilme);

    // Limpa o formulário após adicionar o filme
    addMovieForm.reset();
});

// Carrega a lista de filmes ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarListaFilmes();
});
