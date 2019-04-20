
/**
 * Submits a form using ajax and allows you to do something based on what is returned
 * @param form html form element containing the form things to submit
 * @param callback a function to do something with the response
 */
export function sendData(form: HTMLFormElement, callback: Function) {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.onload = () => {
        callback(null, xhr.responseText);
    }
    xhr.open(form.method, form.action, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(new URLSearchParams(new FormData(form) as any) as any);
}


/**
 * Gets Data from the sever using ajax.
 * @param action url string route to access on the sever
 * @param callback a function to do something with the data response
 */
export function getData(action: string, callback: Function) {
    let xhr: XMLHttpRequest = new XMLHttpRequest();

    xhr.onload = () => {
        callback(null, xhr.responseText);
    }

    xhr.open("get", action, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send();

}