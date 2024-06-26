/**
 * Class representing a song.
 */
export default class Song {
    /**
     * Create a song.
     *
     * @param {string} id - The ID of the song.
     * @param {string} name - The name of the song.
     * @param {boolean} deleted - Whether the song is deleted.
     * @param {boolean} isPublic - Whether the song is public.
     * @param {string} createdAt - The creation date of the song.
     * @param {string} updatedAt - The last update date of the song.
     * @param {string} author - The author of the song.
     * @param {string} text - The lyrics of the song.
     */
    constructor(id, name, deleted, isPublic, createdAt, updatedAt, author, text) {
        this.id = id;
        this.name = name;
        this.deleted = deleted;
        this.public = isPublic;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.author = author;
        this.text = text;
    }

    /**
     * Parses the lyrics of the song to HTML.
     *
     * @returns {string} The parsed lyrics.
     */
    parseText() {
        var parsedText = this.text;
        parsedText = parsedText.replace("<![CDATA[", "<br>").replace("]]>", "<br>"); //remove CDATA tags
        parsedText = parsedText.replace("<![CDATA[", "<br>").replace("]]>", "<br>"); //remove CDATA tags
        parsedText = parsedText.replace(/<Label>(.*?)<\/Label>/g, '<span class="label">$1.</span>');
        parsedText = parsedText.replace(/<Label:(.*?)>/g, '<span class="label">$1.</span>'); //replace chords
        parsedText = parsedText.replace(/<Note1>(.*?)<\/Note1>/g, '<span class="capo">$1</span>');
        parsedText = parsedText.replace(/<Note1:(.*?)>/g, '<span class="capo">$1</span>'); //replace chords
        parsedText = parsedText.replace(/\[(.*?)\]/g, '<span class="chord">$1</span>');
        parsedText = parsedText.replace(/<\/span><span class="chord">/g, '<\/span>&nbsp;<span class="chord">');
        parsedText = parsedText.replace(/\r\n/g, "<br><br>"); //replace new lines
        parsedText = parsedText.replace(/\n/g, "<br><br>");
        parsedText = parsedText.replace(/---NewPage---/g, "<br><br>"); //replace new lines

        parsedText = parsedText.replace(/<br>(.*?)<br>/g, '<p>$1</p>');

        return parsedText;
    }
}