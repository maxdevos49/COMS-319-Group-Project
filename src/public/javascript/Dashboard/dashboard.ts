import { sendData } from "../ajax.js";


/**
 * Nickname update code
 */

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

document.getElementById("nicknameForm").addEventListener("submit", function (e) {
    e.preventDefault();
    sendData(this as HTMLFormElement, (err: any, data: any) => {
        if (err) throw err;
        document.getElementById("nickname").setAttribute("value", data);
    });

    return false;
});


/**
 * Password reset password
 */
document.getElementById("passwordForm").addEventListener("submit", function (e) {
    e.preventDefault();
    sendData(this as HTMLFormElement, (err: any, data: any) => {
        if (err) throw err;
        //typescript is obnoxious here
        let form: any = document.getElementById("passwordForm");
        form.reset();

        if (data === "false") {
            alert("Password was not reset. Please try again.");
        } else {
            alert("Password was successfully changed.")
        }
    });
});

