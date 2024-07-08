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

// Função para buscar detalhes do filme na API do TMDb
async function buscarDetalhesFilme(nomeFilme) {
    const apiKey = 'b973c7ca178790420b1b57f2e3ee0149';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(nomeFilme)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Falha ao buscar detalhes do filme');
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const filmeEncontrado = data.results[0];
            const filmeInfo = {
                titulo: filmeEncontrado.title,
                logo: `https://image.tmdb.org/t/p/w500${filmeEncontrado.poster_path}`,
                video: '', // Será preenchido com o URL do vídeo se disponível
                descricao: '' // Você pode adicionar uma descrição padrão ou deixar vazio
            };
            return filmeInfo;
        } else {
            throw new Error('Filme não encontrado na API do TMDb');
        }
    } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
        throw error;
    }
}

// Função para adicionar um filme
async function adicionarFilme(title, videoURL) {
    try {
        const filmeInfo = await buscarDetalhesFilme(title);
        filmeInfo.video = videoURL; // Define o URL do vídeo
        await database.ref('filmes').push().set(filmeInfo);
        console.log('Filme adicionado com sucesso!');
        carregarListaFilmes();
    } catch (error) {
        console.error('Erro ao adicionar filme:', error);
        throw error;
    }
}

// Função para carregar os filmes
async function loadFilmes() {
    try {
        const snapshot = await database.ref('filmes').once('value');
        return snapshot.val();
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        throw error;
    }
}

// Função para carregar e exibir a lista de filmes
async function carregarListaFilmes() {
    try {
        const filmes = await loadFilmes();
        const filmesContainer = document.getElementById('movie-list-container');
        filmesContainer.innerHTML = ''; // Limpa o conteúdo atual da lista

        for (const key in filmes) {
            if (Object.hasOwnProperty.call(filmes, key)) {
                const filme = filmes[key];
                const filmeElement = document.createElement('div');
                filmeElement.classList.add('movie-item');

                const logoImg = document.createElement('img');
                logoImg.src = filme.logo;
                logoImg.alt = filme.titulo;

                const tituloElement = document.createElement('h3');
                tituloElement.textContent = filme.titulo;

                const descricaoElement = document.createElement('p');
                descricaoElement.textContent = filme.descricao;

                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.addEventListener('click', () => abrirModalEdicao(key, filme.video));

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remover';
                removeButton.addEventListener('click', () => removerFilme(key));

                filmeElement.appendChild(logoImg);
                filmeElement.appendChild(tituloElement);
                filmeElement.appendChild(descricaoElement);
                filmeElement.appendChild(editButton);
                filmeElement.appendChild(removeButton);

                filmesContainer.appendChild(filmeElement);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar lista de filmes:', error);
    }
}

// Função para remover um filme
async function removerFilme(key) {
    try {
        await database.ref('filmes/' + key).remove();
        console.log('Filme removido com sucesso!');
        carregarListaFilmes();
    } catch (error) {
        console.error('Erro ao remover filme:', error);
    }
}

// Função para abrir o modal de edição
function abrirModalEdicao(key, currentVideoURL) {
    const modal = document.getElementById('editModal');
    const closeModal = document.getElementsByClassName('close')[0];

    modal.style.display = 'block';

    const editVideoInput = document.getElementById('edit-video');
    editVideoInput.value = currentVideoURL;

    const editForm = document.getElementById('edit-movie-form');
    editForm.onsubmit = async function(event) {
        event.preventDefault();
        const newVideoURL = editVideoInput.value;
        await editarFilme(key, newVideoURL);
        modal.style.display = 'none';
    };

    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// Função para editar um filme
async function editarFilme(key, newVideoURL) {
    try {
        await database.ref('filmes/' + key).update({ video: newVideoURL });
        console.log('Filme editado com sucesso!');
        carregarListaFilmes();
    } catch (error) {
        console.error('Erro ao editar filme:', error);
    }
}

// Captura o evento de submissão do formulário
const addMovieForm = document.getElementById('add-movie-form');
addMovieForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const videoURL = document.getElementById('video').value;

    // Adiciona o novo filme
    adicionarFilme(title, videoURL);

    // Limpa o formulário após adicionar o filme
    addMovieForm.reset();
});

// Carrega a lista de filmes ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarListaFilmes();
});
