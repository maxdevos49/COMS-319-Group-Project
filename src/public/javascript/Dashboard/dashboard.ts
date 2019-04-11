import { sendData } from "../ajax.js";


/**
 * Nickname update code
 */
document.getElementById("nicknameForm").addEventListener("submit", function (e) {
    e.preventDefault();
    sendData(this as HTMLFormElement, (err: any, data: any) => {
        if (err) throw err;

        document.getElementById("nickname").setAttribute("value", data);
    });
});

/**
 * Email confirmation code
 */
document.getElementById("emailForm").addEventListener("submit", function (e) {
    e.preventDefault();
    sendData(this as HTMLFormElement, (err: any, data: any) => {
        if (err) throw err;

        //display a response
    });
});

/**
 * Password reset password
 */
document.getElementById("passwordForm").addEventListener("submit", function (e) {
    e.preventDefault();
    sendData(this as HTMLFormElement, (err: any, data: any) => {
        if (err) throw err;

        //do something with response
    });
});

document.getElementById("nicknameLink").addEventListener("click", (e) => {
    document.getElementById("nicknameLink").setAttribute("style", "display: none;")
    document.getElementById("nicknameSubmit").setAttribute("style", "display: Block;")
    document.getElementById("nickname").removeAttribute("readonly")
})

document.getElementById("nicknameSubmit").addEventListener("click", (e) => {
    document.getElementById("nicknameSubmit").setAttribute("style", "display: none;")
    document.getElementById("nicknameLink").setAttribute("style", "display: Block;")
    document.getElementById("nickname").setAttribute("readonly", "")
})