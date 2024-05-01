function loginUser(email, password) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log(response.jwt);
            console.log(response.user);
        }
    };
    xhr.open("POST", "http://127.0.0.1:1337/auth/local", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        identifier: email,
        password: password
    }));
}

function registerUser(username, email, password) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log(response.jwt);
            console.log(response.user);
        }
    };
    xhr.open("POST", "http://127.0.0.1:1337/auth/local/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        username: username,
        email: email,
        password: password
    }));
}

