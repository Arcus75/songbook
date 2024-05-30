export default class WebLoader {
    constructor() {
        this.menu = document.getElementById("div-menu");
        this.songbook = document.getElementById("div-songbook");
        this.chords = document.getElementById("div-chords");
        this.editor = document.getElementById("div-editor");
    }

    addEventListener(element, event, callback) {
        element.addEventListener(event, callback);
    }

    getElement(id) {
        return document.getElementById(id);
    }

    addListeners() {
        this.addEventListener(this.getElement("songbook-btn"), "click", this.toggleSongbook.bind(this));
        this.addEventListener(this.getElement("songbook-close"), "click", this.toggleSongbook.bind(this));

        this.addEventListener(this.getElement("chords-btn"), "click", this.toggleChords.bind(this));
        this.addEventListener(this.getElement("chords-close"), "click", this.toggleChords.bind(this));

        this.addEventListener(this.getElement("editor-btn"), "click", this.toggleEditor.bind(this));
        this.addEventListener(this.getElement("editor-close"), "click", this.toggleEditor.bind(this));

        this.addEventListener(this.getElement("songbook-menu-btn"), "click", this.menuToggle.bind(this));
    }

    /* ----------------- BOUND FUNCTIONS ----------------- */
    toggleSongbook() {
        this.songbook.classList.toggle('hidden');
        this.menu.classList.toggle("hidden");
    }

    toggleChords() {
        this.chords.classList.toggle('hidden');
        this.menu.classList.toggle("hidden");
    }

    toggleEditor() {
        this.editor.classList.toggle('hidden');
        this.menu.classList.toggle("hidden");
    }

    menuToggle() {
        const menu = this.getElement('div-songbook-menu')
        const button = this.getElement('div-songbook-menu-icon');
        const content = this.getElement('div-songbook-content');

        menu.classList.toggle('open');
        button.classList.toggle('open');
        content.classList.toggle('open');
    }
}