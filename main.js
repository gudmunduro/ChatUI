
class User {

    static get token() {
        return localStorage.getItem("token");
    }

    static async login (username, password) {
        try {
            const response = await axios.get("http://localhost:8080/user/login", {
                auth: {
                    username,
                    password 
                }
            })
            localStorage.setItem("token", response.data.token);
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
        this.socket = new WebSocket("ws://localhost:8080/connect/?token=" + User.token);
        console.log("2")
        this.socket.onopen = this.onOpen;
        this.socket.onmessage = this.onMessage;
        this.socket.onclose = this.onClose;
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
