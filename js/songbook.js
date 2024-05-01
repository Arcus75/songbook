import Song from "./class/Song.js";

export default class Songbook {
    #songs;
    #authors;
    #chosenSong;
    #chosenText;

    #authorsSorted;
    #songsSorted;
    #loaded;
    #filteredSongs;

    constructor() {
        this.#songs = [];
        this.#authors = new Set();
        this.#chosenSong = null;
        this.#chosenText = "";

        //preparation flags
        this.#authorsSorted = false;
        this.#songsSorted = false;
        this.#loaded = false;

        //helper variables
        this.#filteredSongs = [];
    }

    // Getters
    get songs() {
        return this.#songs;
    }

    loadSongs(server, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(this.responseText);
                songs = response.data.map(songData => {
                    const attrs = songData.attributes;
                    console.log(attrs);
                    return new Song(songData.id, attrs.name, attrs.deleted, attrs.public, attrs.createdAt, attrs.updatedAt, attrs.author, attrs.text)
                })
            callback()
            }
        };
        xhr.open("GET", server)
        xhr.send()
    }




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


}