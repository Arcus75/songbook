import { SERVER_URL } from '../config.js';

/**
 * Fetches the ID of an interpret from the database.
 *
 * @param {string} name - The name of the interpret.
 * @returns {string|null} The ID of the interpret if found, null otherwise.
 */
export async function getInterpretDb(name) {
    const response = await fetch(`${SERVER_URL}/interprets?filters[name][$eqi]=` + name);
    const data = await response.json();

    if (data.data.length > 0) {
        return data.data[0].id;
    } else {
        return null
    }
}

/**
 * Creates a new interpret in the database.
 *
 * @param {string} name - The name of the interpret.
 * @returns {string|null} The ID of the newly created interpret if successful, null otherwise.
 */
export async function createInterpretDb(name) {
    const formattedName = name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
    const data = JSON.stringify({
        data: { name: formattedName }
    })

    const response = await fetch(`${SERVER_URL}/interprets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
    });

    const result = await response.json();

    console.log('Interpret created:', result);

    if (result.data) {
        return result.data.id;
    } else {
        console.error('Error:', result.error);
        return null;
    }
}

/**
 * Fetches the names of all interprets from the database.
 *
 * @returns {Array<string>} An array of the names of all interprets.
 */
export async function getInterpretsDb() {
    const response = await fetch(`${SERVER_URL}/interprets`);
    const data = await response.json();
    const names = data.data.map(interpret => interpret.attributes.name);
    return names;
}