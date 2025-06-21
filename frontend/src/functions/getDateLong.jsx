
// Fonction visant à formater une date (type date donc) en integer
// Exemple : 17 juin 2025 à 20h08 et 15 secondes -> 20250617200815

const convertDateToDateLong = (dateEntree) => {
    let dateConvertie = dateEntree.getFullYear().toString(); 

    if (dateEntree.getMonth() +1 <= 9) {
        dateConvertie += ("0" + (dateEntree.getMonth() +1).toString());
    } else {
        dateConvertie += ((dateEntree.getMonth() +1).toString());
    }

    if (dateEntree.getDate() <= 9) {
        dateConvertie += ("0" + (dateEntree.getDate()).toString());
    } else {
        dateConvertie += dateEntree.getDate().toString();
    }

    if (dateEntree.getHours() <= 9) {
        dateConvertie += ("0" + (dateEntree.getHours()).toString());
    } else {
        dateConvertie += dateEntree.getHours().toString();
    }

    if (dateEntree.getMinutes() <= 9) {
        dateConvertie += ("0" + (dateEntree.getMinutes()).toString());
    } else {
        dateConvertie += dateEntree.getMinutes().toString();
    }

    if (dateEntree.getSeconds() <= 9) {
        dateConvertie += ("0" + (dateEntree.getSeconds()).toString());
    } else {
        dateConvertie += dateEntree.getSeconds().toString();
    }

    return parseInt(dateConvertie);
};

export default convertDateToDateLong;