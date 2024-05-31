import { SERVER_URL } from '../config.js';
import Song from '../model/Song.js';

/**
 * Fetches all songs from the database.
 *
 * @returns {Array<Song>} An array of Song objects if successful, undefined otherwise.
 */
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

/**
 * Creates a new song in the database.
 *
 * @param {string} name - The name of the song.
 * @param {string} text - The lyrics of the song.
 * @param {string} interpretId - The ID of the interpret of the song.
 */
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

/**
 * Updates a song in the database.
 *
 * @param {string} id - The ID of the song to update.
 * @param {string} name - The new name of the song.
 * @param {string} text - The new lyrics of the song.
 * @param {string} interpretId - The ID of the new interpret of the song.
 */
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