import Song from "./song.js";
export default class Songbook {
    constructor(path = null) {
        //low frequency
        this._location = path;
        this._songList = [];
        this._authorList = new Set();

        //preparation flags
        this._authorSorted = false;
        this._songSorted = false;
        this._loaded = false;

        //medium-high frequency
        this._filteredSongs = [];
    }

    get location() {
        return this._location;
    }
    set location(filePath) {
        this._location = location;
        this.loadSongs();
    }

    get loaded() {
        return this._loaded;
    }
    set loaded(loaded) {
        this._loaded = loaded;
        if(this._loaded) {
            this.loadAuthors()
        }
    }

    get sorted() {
        return (this._authorSorted && this._songSorted)
    }

    isLoaded(songbook) {
        return songbook.loaded;
    }


    loadSongs(callback) {
        if(this._location != null) {
            //TODO make more robust control (file existancy possibly)
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/'+this._location, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var xmlString = xhr.responseText;
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(xmlString, 'text/xml');

                    var songs = xmlDoc.getElementsByTagName("song");
                    
                    for (let i = 0; i < songs.length; i++) {
                        const song = songs[i];
                        const text = song.getElementsByTagName("songtext")[0].innerHTML;
                        const author = song.getElementsByTagName("author")[0].textContent;
                        const title = song.getElementsByTagName("title")[0].textContent;
                        var songClass = new Song(text, author, title);
                        this._songList.push(songClass);
                    }
                    this.loaded = true;
                    this.sortByTitle();
                    this._filteredSongs = this._songList;
                    callback();
                }
            };
        xhr.send();
        }
    }

    loadAuthors() {
        for (let i = 0; i < this._songList.length; i++) {
            this._authorList.add(this._songList[i].author)
        }
        this.sortAuthors();
    }

    applyFilter(author, title) {
        this._filteredSongs = []

        if(author == "" && title == "") {
            this._filteredSongs = this._songList;
            return;
        }
        if (author != "" && title == "") {
            this._songList.forEach((song) => {
                if(song.author.includes(author)) {
                    this._filteredSongs.push(song);
                }
            })
            return;
        }
        if (author == "" && title != "") {
            this._songList.forEach((song) => {
                if(song.title.includes(title)) {
                    this._filteredSongs.push(song);
                }
            })
            return;
        }
        else {
            this._songList.forEach((song) => {
                if(song.title.includes(title) && song.author.includes(author)) {
                    this._filteredSongs.push(song);
                }
            })
            return;
        }
    }

    sortByTitle() {
        this._songList.sort((a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            return titleA.localeCompare(titleB, 'cs');
          });
    }

    sortAuthors() {
        let array = Array.from(this._authorList)
        array.sort((a, b) => {
        	return a.toLowerCase().localeCompare(b.toLowerCase(), 'cs')
        	});
        let sortedSet = new Set(array)
        this._authorList = sortedSet;
        this._authorSorted = true;
        return
    }

}