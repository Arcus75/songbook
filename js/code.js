import Song from './model/Song.js';

import WebLoader from './class/WebLoader.js';
import { getInterpretDb, createInterpretDb, getInterpretsDb } from './class/InterpretDB.js';
import { createSongDb, updateSongDb, getSongsDb } from './class/SongDB.js';

window.addEventListener("load", siteLoaded)
var debug = false

var data = [];
var diplayData = [];
var authors = new Set();
var chosenSong = null;
var chosenText = "";
var viableSongbooks = ["Default_full.xml"];

var Loader = null;

var songs = [];

async function fillSite() {
    try {
        let response = await fetch("../html_sections/chords.html");
        let text = await response.text();
        document.getElementById("div-chords").innerHTML = text;

        response = await fetch("../html_sections/songbook.html");
        text = await response.text();
        document.getElementById("div-songbook").innerHTML = text;

        response = await fetch("../html_sections/editor.html");
        text = await response.text();
        document.getElementById("div-editor").innerHTML = text;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function siteLoaded() {
    await fillSite();

    Loader = new WebLoader();
    Loader.addListeners();

    songs = await getSongsDb();
    populateSongs()

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

    document.getElementById('new-song-btn').addEventListener('click', addSong)
    document.getElementById('update-song-btn').addEventListener('click', updateSong)
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

// -------------------------------------- Songs --------------------------------------

async function addSong(e) {
    e.preventDefault();
    const name_in = document.getElementById('song-name')
    const text_in = document.getElementById('song-text');
    const interpret_in = document.getElementById('song-interpret');

    const name = name_in.value;
    const text = text_in.value;
    let interpret = interpret_in.value;

    // Get the id of the interpret
    let interpretId = await getInterpretDb(interpret);
    // If the interpret doesn't exist, create it and get the id
    if (!interpretId) {
        interpretId = await createInterpretDb(interpret);
    }

    createSongDb(name, text, interpretId);
    name_in.value = '';
    text_in.value = '';
    interpret_in.value = '';
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
    let interpretId = await getInterpretDb(interpret);
    // If the interpret doesn't exist, create it and get the id
    if (!interpretId) {
        interpretId = createInterpretDb(interpret);
    }

    updateSongDb(id, name, text, interpretId);
    id_in = '';
    name_in.value = '';
    text_in.value = '';
    interpret_in.value = '';
}

async function populateSongs() {
    const ul = document.getElementById('songbook-list-ul')
    const datalist = document.getElementById('possible_inputs');
    ul.innerHTML = '';

    songs.sort((a, b) => a.name.localeCompare(b.name));

    songs.forEach((song) => {
        const li = document.createElement('li');
        li.innerHTML = song.name; //TODO add author
        li.addEventListener('click', function () {
            displaySong(song);
        });
        ul.append(li);

        datalist.innerHTML += `<option value="${song.name}">`
    });

    const interprets = await getInterpretsDb();
    interprets.forEach((interpret) => {
        datalist.innerHTML += `<option value="${interpret}">`
    });

    return
}

function displaySong(song) {
    document.getElementById('songbook-text').innerHTML = song.parseText()
    document.getElementById('songbook-author').innerHTML = song.author
    document.getElementById('songbook-name').innerHTML = song.name
}

// -------------------------------------- Backend --------------------------------------

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

function keyHandler(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        return
    }

}
