export default class Song {
    constructor(text, author, title) {
        this._text = text;
        this._author = author;
        this._title = title;
    }

    get author() {
        return this._author
    }

    get text() {
        return this._text
    }

    get title() {
        return this._title
    }

    parseText() {
        var parsedText = this._text;
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