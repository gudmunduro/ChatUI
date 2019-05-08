
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

    renderMessages(messageArray){
        messageArray.forEach(messageObject => {
            const messageElement = document.createElement("b");
            const senderElement = document.createElement("span");
            const messageContentElement = document.createElement("i");

            senderElement.innerText = "Sender";
            messageContentElement.innerText = messageObject.message;

            messageElement.appendChild(senderElement);
            messageElement.appendChild(messageContentElement);
            document.getElementById("messageBox").appendChild(messageElement);
        });
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
        if (e.data.startsWith("[")) {
            const dataObject = JSON.parse(e.data);
        } else {
            console.log("Received message " + e.data);
        }
    }

    onClose(e) {
        console.log(e);
    }

}

async function onLoginButtonClick()
{
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    await User.login(username, password);
    if (User.loggedIn) {
        document.removeChild(document.getElementById("username"));
        document.removeChild(document.getElementById("password"));
        document.removeChild(document.getElementById("loginButton"));
        window.chatInstance = new Chat();
    } else {

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

    document.getElementById("loginButton").addEventListener('click', onLoginButtonClick);
});
