
class User {

    static get token() {
        return localStorage.getItem("token");
    }

    static async login (username, password) {
        try {
            const response = await axios.get("http://10.11.45.27:80/user/login", {
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
        this.socket = new WebSocket("http://10.11.45.27:80/connect/" + User.token);
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
