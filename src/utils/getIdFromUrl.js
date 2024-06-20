/**
 * gets the id of a document from a link
 * @param {string} url the link to extract the file from
 * @param {string} linkSourceType the type of link i.e source of the link like `GoogleDrive`,`OkRu`,`Box`,`Yandex`, `Direct` 
 * @returns {string} the requested id
 * or an empty string
 */
function getIdFromUrl(url,linkSourceType) {
    switch (linkSourceType) {
        case "GoogleDrive":
            let splitUrl = url.split("/")
            return splitUrl[splitUrl.length - 2];
        case "OkRu":
            return url.split("=")[1];
        case "Yandex":
            return url.split("=")[1];
        case "BOX":
            return url.split("=")[1];
        default:
            return '';
    }
}