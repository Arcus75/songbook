import Song from './class/Song.js';

window.addEventListener("load", siteLoaded)
var debug = false

var data = [];
var diplayData = [];
var authors = new Set();
var chosenSong = null;
var chosenText = "";
var viableSongbooks = ["Default_full.xml"];

var songs = [];

function siteLoaded() {

    //setBackground()
    addListeners()
}

function addListeners() {
    //document.getElementById('song-list').addEventListener('input', chooseNew);
    //document.querySelector('#main-menu-btn').addEventListener('click', menuToggle);
    //document.getElementById('author-input').addEventListener('input', searchChange);
    //document.getElementById('autor-clear').addEventListener('click', clearAuthor);
    //document.getElementById('song-input').addEventListener('input', searchChange);
    //document.getElementById('song-clear').addEventListener('click', clearSong);
    document.addEventListener('keypress', keyHandler);
    document.getElementById('songbook-menu-btn').addEventListener('click', menuToggle);
    document.getElementById('songbook-btn').addEventListener('click', toggleSongbook);
    document.getElementById('songbook-close').addEventListener('click', toggleSongbook);

    document.getElementById('chords-btn').addEventListener('click', toggleChords)
    document.getElementById('chords-close').addEventListener('click', toggleChords)

    document.getElementById('editor-btn').addEventListener('click', toggleEditor)
    document.getElementById('editor-close').addEventListener('click', toggleEditor)
    document.getElementById('new-song-btn').addEventListener('click', addSong)
    document.getElementById('update-song-btn').addEventListener('click', updateSong)
}

function toggleSongbook() {
    document.getElementById('div-songbook').classList.toggle('hidden')
    document.getElementById('div-menu').classList.toggle('hidden')
    getSongs()
}

function toggleChords() {
    document.getElementById('div-chords').classList.toggle('hidden')
    document.getElementById('div-menu').classList.toggle('hidden')
}

function toggleEditor() {
    document.getElementById('div-editor').classList.toggle('hidden')
    document.getElementById('div-menu').classList.toggle('hidden')
}

function menuToggle() {
    const menu = document.getElementById('div-songbook-menu')
    const button = document.getElementById('div-songbook-menu-icon');
    const content = document.getElementById('div-songbook-content');

    menu.classList.toggle('open');
    //menu.classList.toggle('hidden');
    button.classList.toggle('open');

    content.classList.toggle('open');
}

function setBackground() {
    const background = document.getElementById('div-menu');
    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    background.appendChild(canvas);

    const topColor = '#F0F0F0';
    const bottomColor = '#D0D0D0';
    const curveHeight = 100;
    const curveSpeed = 2;

    let curveOffset = 0;

    function drawBackground() {
        ctx.clearRect(0, 0, width, height);

        // Draw top color
        ctx.fillStyle = topColor;
        ctx.fillRect(0, 0, width, height - curveHeight);

        // Draw bottom color
        ctx.fillStyle = bottomColor;
        ctx.beginPath();
        ctx.moveTo(0, height - curveHeight);
        ctx.quadraticCurveTo(width / 2, height - curveHeight + curveOffset, width, height - curveHeight);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        curveOffset += curveSpeed;
        if (curveOffset > width) {
            curveOffset = 0;
        }

        requestAnimationFrame(drawBackground);
    }

    drawBackground();
}

// -------------------------------------- Login --------------------------------------

function redirectToLogin() {
    if (!localStorage.getItem('user')) {
        window.location.href = 'login.html'
    } else {
        var user = JSON.parse(localStorage.getItem('user'));
    }
}


// -------------------------------------- Chords --------------------------------------

// -------------------------------------- Editor --------------------------------------

async function addSong(e) {
    e.preventDefault();

    const name_in = document.getElementById('song-name')
    const text_in = document.getElementById('song-text');
    const interpret_in = document.getElementById('song-interpret');

    const name = name_in.value;
    const text = text_in.value;
    let interpret = interpret_in.value;

    // Get the id of the interpret
    let interpretId = await getInterpret(interpret);
    // If the interpret doesn't exist, create it and get the id
    if (!interpretId) {
        interpretId = await createInterpret(interpret);
    }

    const data = JSON.stringify({
        data: {
            name: name, text: text, interpret: interpretId
        }
    })

    fetch('http://127.0.0.1:1337/api/songs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Song created:', data);
            // Clear the input fields
            name_in.value = '';
            text_in.value = '';
            interpret_in.value = '';
            // Show a popup message
            alert('Song created successfully!');
        })
        .catch((error) => console.error('Error:', error));
}

async function updateSong(e) {
    e.preventDefault();

    const id_in = document.getElementById('song-id');
    const name_in = document.getElementById('song-name')
    const text_in = document.getElementById('song-text');
    const interpret_in = document.getElementById('song-interpret');

    const id = id_in.value;
    const name = name_in.value;
    const text = text_in.value;
    let interpret = interpret_in.value;

    // Get the id of the interpret
    let interpretId = await getInterpret(interpret);

    // If the interpret doesn't exist, create it and get the id
    if (!interpretId) {
        interpretId = createInterpret(interpret);
    }

    const data = JSON.stringify({
        data: {
            name: name, text: text, interpret: interpretId.value
        }
    })
    if (id) {
        fetch(`http://127.0.0.1:1337/api/songs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Song created:', data);
                // Clear the input fields
                id_in = '';
                name_in.value = '';
                text_in.value = '';
                interpret_in.value = '';
                // Show a popup message
                alert('Song created successfully!');
            })
            .catch((error) => console.error('Error:', error));
    }
}

// -------------------------------------- Backend --------------------------------------

async function getInterpret(name) {
    const response = await fetch('http://127.0.0.1:1337/api/interprets?filters[name][$eqi]=' + name);
    const data = await response.json();

    if (data.data.length > 0) {
        return data.data[0].id;
    } else {
        return null
    }
}

async function createInterpret(name) {
    const formattedName = name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
    const data = JSON.stringify({
        data: { name: formattedName }
    })

    const response = await fetch('http://127.0.0.1:1337/api/interprets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
    });

    const result = await response.json();

    console.log('Interpret created:', result);

    if (result.data) {
        return result.data.id;
    } else {
        console.error('Error:', result.error);
        return null;
    }
}

function getSongs() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(this.responseText);
            songs = response.data.map(songData => {
                const attrs = songData.attributes;
                console.log(attrs);
                return new Song(songData.id, attrs.name, attrs.deleted, attrs.public, attrs.createdAt, attrs.updatedAt, attrs.author, attrs.text)
            })
            populateSongs()
        }
    };
    xhr.open("GET", "http://127.0.0.1:1337/api/songs?populate=*")
    xhr.send()
}

function getInterprets() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            data = JSON.parse(this.responseText);
            console.log(data)
        }
    };
    xhr.open("GET", "http://127.0.0.1:1337/api/interprets")
    xhr.send()
}

function populateSongs() {
    // const listDiv = document.getElementById('songbook-songlist');
    // listDiv.innerHTML = '';

    //const ul = document.createElement('ul');
    const ul = document.getElementById('songbook-list-ul')
    ul.innerHTML = '';

    songs.sort((a, b) => a.name.localeCompare(b.name));

    songs.forEach((song) => {
        const li = document.createElement('li');
        li.innerHTML = song.name; //TODO add author
        li.addEventListener('click', function () {
            displaySong(song);
        });
        ul.append(li);

    });

    return
    const list = document.getElementById('songbook-list');
    list.innerHTML = '';
    songs.forEach((song) => {
        const option = document.createElement('option');
        option.value = song.id
        option.innerHTML = song.name
        console.log(song);
        list.append(option);
    })
}

function onSongbookChange() {
    const chosenId = document.getElementById('songbook-list').value;
    songs.forEach((song) => {
        if (song.id == chosenId) {
            displaySong(song);
            return;
        }
    });
}

function displaySong(song) {
    document.getElementById('songbook-text').innerHTML = song.parseText()
    document.getElementById('songbook-author').innerHTML = song.author
    document.getElementById('songbook-name').innerHTML = song.name
}


function displaySongbook() {
    displayAuthors()
    displaySongs()
}

function displayAuthors() {
    const datalist = document.querySelector('#possible_authors');
    songbook._authorList.forEach((author) => {
        const option = document.createElement('option');
        option.value = author;
        datalist.appendChild(option);
    })
}

function displaySongs() {
    const list = document.querySelector('#song-list');
    list.innerHTML = '';
    songbook._filteredSongs.forEach((song) => {
        const option = document.createElement('option');
        option.value = song.title
        option.innerHTML = song.title
        list.add(option);
    })
}

function chooseNew(event) {
    const chosenName = document.getElementById('song-list').value;
    songbook._filteredSongs.forEach((song) => {
        if (song.title == chosenName) {
            chosenSong = song;
            displaySong();
            return;
        }
    });
}



function searchChange() {
    let authorText = document.getElementById('author-input').value
    let songText = document.getElementById('song-input').value

    songbook.applyFilter(authorText, songText)
    displaySongs()
}

function clearAuthor(event) {
    event.preventDefault()
    let input = document.getElementById('author-input')

    if (input.value != "") {
        input.value = ""
        searchChange()
    }
}

function clearSong(event) {
    event.preventDefault()
    let input = document.getElementById('song-input')

    if (input.value != "") {
        input.value = ""
        searchChange()
    }
}

function keyHandler(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        return
    }

}

function loadFiles() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var fileList = JSON.parse(this.responseText);
            // Zpracování seznamu souborů
        }
    };
    xhr.open("GET", "https://zpevnik.arcusvault.synology.me:8000", true);
    xhr.send();
}
