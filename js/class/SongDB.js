import { SERVER_URL } from '../config.js';
import Song from '../model/Song.js';

export async function getSongsDb() {
    try {
        const response = await fetch(`${SERVER_URL}/songs?populate=*`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const songs = data.data.map(songData => {
            const attrs = songData.attributes;
            return new Song(songData.id, attrs.name, attrs.deleted, attrs.public, attrs.createdAt, attrs.updatedAt, attrs.interpret.data.attributes.name, attrs.text)
        });
        return songs;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function createSongDb(name, text, interpretId) {
    const data = JSON.stringify({
        data: {
            name: name, text: text, interpret: interpretId
        }
    })

    fetch(`${SERVER_URL}/songs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Song created:', data);
            // Show a popup message
            alert('Song created successfully!');
        }).catch((error) => console.error('Error:', error));
}

export async function updateSongDb(id, name, text, interpretId) {
    const data = JSON.stringify({
        data: { name: name, text: text, interpret: interpretId.value }
    })

    if (id) {
        fetch(`${SERVER_URL}/songs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        }).then(response => response.json())
            .then(data => {
                console.log('Song created:', data);
                // Show a popup message
                alert('Song created successfully!');
            }).catch((error) => console.error('Error:', error));
    }
}