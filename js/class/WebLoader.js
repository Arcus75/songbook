export default class WebLoader {
    constructor() {
        this.menu = document.getElementById("div-menu");
        this.songbook = document.getElementById("div-songbook");
        this.chords = document.getElementById("div-chords");
        this.editor = document.getElementById("div-editor");
    }

    /**
     * Add an event listener to an element.
     * @param {Object} element - The element to add the event listener to.
     * @param {string} event - The event to listen for.
     * @param {function} callback - The function to call when the event is triggered.
     */
    addEventListener(element, event, callback) {
        element.addEventListener(event, callback);
    }

    /**
     * Get an element by its ID.
     * @param {string} id - The ID of the element to get.
     * @return {Object} The element with the specified ID.
     */
    getElement(id) {
        return document.getElementById(id);
    }

    /**
     * Add event listeners to elements.
     */
    addListeners() {
        this.addEventListener(this.getElement("songbook-btn"), "click", this.toggleSongbook.bind(this));
        this.addEventListener(this.getElement("songbook-close"), "click", this.goToMenu.bind(this));

        this.addEventListener(this.getElement("chords-btn"), "click", this.toggleChords.bind(this));
        this.addEventListener(this.getElement("chords-close"), "click", this.goToMenu.bind(this));

        this.addEventListener(this.getElement("editor-btn"), "click", this.toggleEditor.bind(this));
        this.addEventListener(this.getElement("editor-close"), "click", this.goToMenu.bind(this));

        this.addEventListener(this.getElement("songbook-menu-btn"), "click", this.menuToggle.bind(this));

        window.addEventListener('online', this.wentOnline.bind(this));
        window.addEventListener('offline', this.wentOffline.bind(this));
    }

    /* ----------------- BOUND FUNCTIONS ----------------- */
    /**
     * Toggle the visibility of the songbook and menu elements.
     */
    toggleSongbook() {
        this.songbook.classList.toggle('hidden');
        this.menu.classList.toggle("hidden");
        history.pushState({ page: 'songbook' }, '', '?page=songbook')
    }

    /**
     * Toggle the visibility of the chords and menu elements.
     */
    toggleChords() {
        this.chords.classList.toggle('hidden');
        this.menu.classList.toggle("hidden");
    }

    /**
     * Toggle the visibility of the editor and menu elements.
     */
    toggleEditor() {
        this.editor.classList.toggle('hidden');
        this.menu.classList.toggle("hidden");
    }

    displaySongbook() {
        this.songbook.classList.toggle('hidden');
        this.menu.classList.toggle("hidden");
    }

    /**
     * Toggles the visibility of the chords and menu elements.
     */
    displayChords() {
        this.chords.classList.toggle('hidden');
        this.menu.classList.toggle("hidden");
    }

    /**
     * Toggles the visibility of the chords and menu elements.
     */
    displayEditor() {
        this.chords.classList.toggle('hidden');
        this.menu.classList.toggle("hidden");
    }

    /**
     * Hides the chords, editor, and songbook elements and shows the menu element.
     */
    displayMenu() {
        this.chords.classList.add('hidden');
        this.editor.classList.add('hidden');
        this.songbook.classList.add('hidden');
        this.menu.classList.remove("hidden");
    }

    /**
     * Changes the page state to 'menu' and displays the menu.
     */
    goToMenu() {
        window.history.replaceState({ page: 'menu' }, '', '?page=menu')
        this.displayMenu();
        //window.history.back();
    }

    /**
     * Logs a message and alerts the user when the browser goes offline.
     */
    wentOffline() {
        console.log("Browser went offline");
        alert("You are offline. Please check your internet connection.");
    }

    /**
     * Logs a message and alerts the user when the browser goes online.
     */
    wentOnline() {
        console.log("Browser went online");
        alert("You are online.");
    }

    /**
     * Toggles the 'open' class for the menu, button, and content elements.
     */
    menuToggle() {
        const menu = this.getElement('div-songbook-menu')
        const button = this.getElement('div-songbook-menu-icon');
        const content = this.getElement('div-songbook-content');

        menu.classList.toggle('open');
        button.classList.toggle('open');
        content.classList.toggle('open');
    }
}