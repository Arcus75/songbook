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
    document.getElementById('songbook-list').addEventListener('change', onSongbookChange);
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

function menuToggle() {
    const menu = document.getElementById('div-songbook-menu')
    const button = document.getElementById('div-songbook-menu-icon');
    const content = document.getElementById('div-songbook-content');

    menu.classList.toggle('open');
    //menu.classList.toggle('hidden');
    button.classList.toggle('open');

    content.classList.toggle('open');
}

// -------------------------------------- Backend --------------------------------------

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
