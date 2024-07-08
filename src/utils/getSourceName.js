/**
 * Gets the name of the video provider or hoster depending on the link
 * @argument {string} link the link to test
 * @returns {string} The source name. Possible values are `GoogleDrive`,`OkRu`,`Box`,`Yandex`, `Direct` 
 * or an empty string
 */
function getSource(link) {
    if (typeof link == 'string') {
        //get the structure of the links and how they look like
        //const linkSegments = link.split("/")
        let url = new URL(link)
        if(url.hostname.includes("kpgsc")) return "Direct"
        switch (url.hostname) {
            case "drive.google.com":    
            return "GoogleDrive";
            case "ok.ru":
                return "OkRu";
            case "disk.yandex.com":
                return "Yandex";
            break;
            case "yadi.sk":
                return "Yandex";
            break;
            case "app.box.com":
                return "BOX"
            default:
                return 'Direct';
        }
    }
    return ''
}

module.exports = getSource