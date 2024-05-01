const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'arcusvault.synolofy.me',
    user: 'zpevnik',
    password: 'ArcusVault_DB587',
    database: 'zpevnik'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected as id ' + connection.treadId);
});