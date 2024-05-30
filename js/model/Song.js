export default class Song {
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