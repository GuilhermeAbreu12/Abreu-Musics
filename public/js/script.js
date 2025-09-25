const audioPlayer = document.getElementById('audio-player');
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');

let allSongs = [];
let currentSongIndex = -1;

async function fetchSongs(searchTerm = ''){
    let url = 'http://localhost/Abreu-Musics/src/list_songs.php';
    if (searchTerm){
        url += `?search=${encodeURIComponent(searchTerm)}`;
    }

    const response = await fetch(url);
    const result = await response.json();
    const tableBody = document.getElementById('songs-table-body');
    tableBody.innerHTML = '';

    if (result.status === 'sucesso' && result.data.length > 0){
        allSongs = result.data;

        result.data.forEach(song => {
            const row = document.createElement('tr');
        
            row.className = 'border-b border-gray-600 hover:bg-gray-600'; 
            row.innerHTML = `
                <td class="p-3">${song.titulo}</td>
                <td class="p-3">${song.artista}</td>
                <td class="p-3">${song.album || 'N/A'}</td>
                <td class="p-3">
                    <button onclick="editSong(${song.id})" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-xs transition-colors duration-200">Editar</button>
                    <button onclick="deleteSong(${song.id})" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs transition-colors duration-200">Excluir</button>
                    <button onclick="playSong(${song.id})" class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-1 px-2 rounded text-xs transition-colors duration-200">Play</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center p-4 text-gray-500">Nenhuma música encontrada.</td></tr>';
    }
}

async function deleteSong(id) {
    if (!confirm('Tem certeza que deseja excluir esta música?')){
        return;
    }
    const response = await fetch(`http://localhost/Abreu-Musics/src/delete_song.php?id=${id}`, {
        method: 'DELETE'
    });

    const result = await response.json();
    alert(result.mensagem);
    fetchSongs();
}
async function editSong(id){
    const response = await fetch(`http://localhost/Abreu-Musics/src/get_song.php?id=${id}`);
    const result = await response.json();

    if (result.status === 'sucesso'){
        const song = result.data;
        document.getElementById('edit-id').value = song.id;
        document.getElementById('edit-titulo').value = song.titulo;
        document.getElementById('edit-artista').value = song.artista;
        document.getElementById('edit-album').value = song.album;
        document.getElementById('edit-caminho').value = song.caminho_arquivo;
        document.getElementById('edit-modal').classList.remove('hidden');
    } else {
        alert(result.mensagem);
    }
}
document.getElementById('close-edit-modal').addEventListener('click', () => {
    document.getElementById('edit-modal').classList.add('hidden');
});

document.getElementById('edit-song-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const data = {
        id: id,
        titulo: document.getElementById('edit-titulo').value,
        artista: document.getElementById('edit-artista').value,
        album: document.getElementById('edit-album').value,
        caminho_arquivo: document.getElementById('edit-caminho').value
    };

    const response = await fetch('http://localhost/Abreu-Musics/src/update_song.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.mensagem);
    document.getElementById('edit-modal').classList.add('hidden');
    fetchSongs();
});
async function playSong(id){
    const song = allSongs.find(s => s.id === id);
    if (song) {
        currentSongIndex = allSongs.indexOf(song);
        // Define a URL do arquivo de áudio
        audioPlayer.src = `../music_files/${song.caminho_arquivo}`;
        // Toca a música
        audioPlayer.play();

        // Atualiza as informações exibidas no player
        playerTitle.textContent = song.titulo;
        playerArtist.textContent = `- ${song.artista}`;
        
        // Mostra o botão de pause e esconde o de Play
        playButton.classList.add('hidden');
        pauseButton.classList.remove('hidden');
    }
}
function nextSong(){
    if (allSongs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % allSongs.length;
    playSong(allSongs[currentSongIndex].id);
}

function prevSong(){
    if (allSongs.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + allSongs.length) % allSongs.length;
    playSong(allSongs[currentSongIndex].id);
}

function pauseSong() {
    audioPlayer.pause();
    playButton.classList.remove('hidden');
    pauseButton.classList.add('hidden');
}

// Conecta os botões de play e pause com as funções
playButton.addEventListener('click', ()=>{
    audioPlayer.play();
    playButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
});

pauseButton.addEventListener('click', pauseSong);

document.addEventListener('DOMContentLoaded', () => {
    fetchSongs();
    document.getElementById('search-input').addEventListener('input', (event) => {
        fetchSongs(event.target.value);
    });
});

// Exemplo de validação
document.getElementById('add-song-form').addEventListener('submit', async (e) =>{
    e.preventDefault();
    const form = e.target;
    const data = {
        titulo: form.titulo.value,
        artista: form.artista.value,
        album: form.album.value,
        caminho_arquivo: form.caminho.value
    };

    const response = await fetch('http://localhost/Abreu-Musics/src/create_song.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.mensagem);
    form.reset();
});