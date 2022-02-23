/**
* Gib einen zufälligen Integer in [min, max] zurück.
*/
export function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
* Gib den gegebenen Array ohne mehrere Objekte mit identischen Attributen zurück.
*/
export function withoutDuplicateObjects(array) {
    let result = []
    for (let index = array.length - 1; index >= 0; index--) {
        // gehe zunächst davon aus, dass das Element einzigartig ist
        let isUnique = true
        for (let containedObject of result)
            if (JSON.stringify(array[index]) === JSON.stringify(containedObject)) {
                // überspringe das Objekt, falls eines mit derselben JSON-Representation bereits existiert
                isUnique = false
                break
            }
        if (isUnique)
            result.push(array[index])
    }
    return result
}
