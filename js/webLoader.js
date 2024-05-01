import Songbook from "./songbook.js";

window.addEventListener("load", siteLoaded)
var debug = false

var data = [];
var diplayData = [];
var authors = new Set();
var chosenSong = null; 
var chosenText = "";
var viableSongbooks = ["Default_full.xml"];
var songbook = new Songbook();

function siteLoaded() {
    songbook = new Songbook(viableSongbooks[0]);
    songbook.loadSongs(displaySongbook)


    addListeners()
}

function addListeners() {
    document.getElementById('song-list').addEventListener('input', chooseNew);
    document.querySelector('#main-menu-btn').addEventListener('click', menuToggle);
    document.getElementById('author-input').addEventListener('input', searchChange);
    document.getElementById('autor-clear').addEventListener('click', clearAuthor);
    document.getElementById('song-input').addEventListener('input', searchChange);
    document.getElementById('song-clear').addEventListener('click', clearSong);
    document.addEventListener('keypress', keyHandler);
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

function displaySong() {
    document.querySelector('#song-text').innerHTML = chosenSong.parseText()
    document.querySelector('#song-author').innerHTML = chosenSong.author
    document.querySelector('#song-name').innerHTML = chosenSong.title
}

function chooseNew(event) {
    const chosenName = document.getElementById('song-list').value;
    songbook._filteredSongs.forEach((song) => {
        if(song.title == chosenName) {
            chosenSong = song;
            displaySong();
            return;
        }
    });
}

function menuToggle() {
    const menu = document.querySelector('#menu');
    const content =document.querySelector('#right-side');

    menu.classList.toggle('open');
    content.classList.toggle('open');
}

function searchChange() {
    let authorText = document.getElementById('author-input').value
    let songText = document.getElementById('song-input').value

    songbook.applyFilter(authorText, songText)
    displaySongs()
}

function clearAuthor (event) {
    event.preventDefault()
    let input = document.getElementById('author-input')

    if(input.value != "") {
        input.value = ""
        searchChange()
    }
}

function clearSong (event) {
    event.preventDefault()
    let input = document.getElementById('song-input')

    if(input.value != "") {
        input.value = ""
        searchChange()
    }
}

function keyHandler(event) {
	
	if(event.key === "Enter") {
		event.preventDefault();
		return
	}
	
}

function loadFiles() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var fileList = JSON.parse(this.responseText);
            // Zpracování seznamu souborů
        }
    };
    xhr.open("GET", "https://zpevnik.arcusvault.synology.me:8000", true);
    xhr.send();
}
