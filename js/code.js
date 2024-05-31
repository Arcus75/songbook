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
var filteredSongs = [];

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function () {
//         navigator.serviceWorker.register('/serviceWorker.js').then(function (registration) {
//             console.log('ServiceWorker registration successful with scope: ', registration.scope);
//         }, function (err) {
//             console.log('ServiceWorker registration failed: ', err);
//         });
//     });
// }

async function fillSite() {
    // if (navigator.onLine) {
    //     son
    // } else {

    // }

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
    history.pushState({ page: 'menu' }, '', '?page=menu')
}

function addListeners() {
    //document.getElementById('song-list').addEventListener('input', chooseNew);
    //document.querySelector('#main-menu-btn').addEventListener('click', menuToggle);
    //document.getElementById('author-input').addEventListener('input', searchChange);
    //document.getElementById('autor-clear').addEventListener('click', clearAuthor);
    //document.getElementById('song-input').addEventListener('input', searchChange);
    //document.getElementById('song-clear').addEventListener('click', clearSong);
    document.addEventListener('keypress', keyHandler);

    document.getElementById('filter-input').addEventListener('input', filterChanged)
    document.getElementById('filter-clear').addEventListener('click', clearFilter)

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

function filterChanged() {
    let filterValue = document.getElementById('filter-input').value.toLowerCase();
    filteredSongs = songs.filter((song) => song.name.toLowerCase().includes(filterValue));

    displaySongs(filteredSongs);

}

function clearFilter() {
    let filter = document.getElementById('filter-input');
    filter.value = '';
    filterChanged();
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
    const ul = document.getElementById('songbook-list-ul');
    const datalist = document.getElementById('possible_inputs');

    ul.innerHTML = '';
    songs.sort((a, b) => a.name.localeCompare(b.name));

    songs.forEach((song) => {
        const li = document.createElement('li');
        li.innerHTML = song.name; //TODO add author
        li.addEventListener('click', function () {
            displaySong(song);
            history.pushState(song, song.name, `?song=${song.name}`)
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

function displaySongs(song_list) {
    const ul = document.getElementById('songbook-list-ul');

    ul.innerHTML = '';
    song_list.sort((a, b) => a.name.localeCompare(b.name));

    song_list.forEach((song) => {
        const li = document.createElement('li');
        li.innerHTML = song.name; //TODO add author
        li.addEventListener('click', function () {
            displaySong(song);
            history.pushState(song, song.name, `?song=${song.name}`)
        });
        ul.append(li);
    });
}

function displaySong(song) {
    document.getElementById('songbook-text').innerHTML = song.parseText()
    document.getElementById('songbook-author').innerHTML = song.author
    document.getElementById('songbook-name').innerHTML = song.name
}

function keyHandler(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        return
    }

}

// -------------------------------------- History --------------------------------------

window.onpopstate = function (event) {
    if (event.state) {
        if (event.state.page) {
            switch (event.state.page) {
                case 'songbook':
                    Loader.displaySongbook();
                    break;
                case 'chords':
                    Loader.displayChords();
                    break;
                case 'editor':
                    Loader.displayEditor();
                    break;
                case 'menu':
                    Loader.displayMenu();
                    break;
            }
        }
        else {
            const song = new Song(event.state.id, event.state.name, event.state.deleted,
                event.state.public, event.state.createdAt, event.state.updatedAt,
                event.state.author, event.state.text);
            displaySong(song);
        }
    }
}
