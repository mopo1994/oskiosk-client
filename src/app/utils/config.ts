export const ConfigLoader = new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './oskiosk.json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
        }
        else {
            reject("Konfiguartion kann nicht geladen werden...");
        }
    };
    xhr.send();
});
