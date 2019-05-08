
class User {

    static get token() {
        return localStorage.getItem("token");
    }

    static async loggedIn() {
        if (!this.token) return false;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;

        try {
            const response = await axios.get("https://chatapp.fisedush.com/user/test");
            console.log(response);
            return response.status === 200;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async login (username, password) {
        try {
            const response = await axios.get("https://chatapp.fisedush.com/user/login", {
                auth: {
                    username,
                    password 
                }
            });
            localStorage.setItem("token", response.data.token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
        } catch (error) {
            // TODO: Do real errors
            alert("Login failed");
            console.log(error);
        }
    }

}

class Chat {

    constructor() {
        console.log("1")
        this.socket = new WebSocket("ws://chatapp.fisedush.com/connect/?token=" + User.token);
        console.log("2")
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage;
        this.socket.onclose = this.onClose;

        document.getElementById('sendButton').addEventListener('click', this.onSendButton.bind(this));
    }

    onSendButton(e) {
        const text = document.getElementById("sendInput").value;
        if (text == "") return;
        document.getElementById("sendInput").value = "";

        this.socket.send(text);
    }

    onOpen(e) {
        console.log(e);
    }

    onMessage(e) {
        console.log(e);
    }

    onClose(e) {
        console.log(e);
    }

}

window.addEventListener('load', e => {
    User.loggedIn().then(loggedIn => {
        if (loggedIn) {
            console.log("logged in")
            window.chatInstance = new Chat();
        } else {
            console.log("not logged in");
        }
    });
});
