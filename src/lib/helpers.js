export function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function withoutDuplicateObjects(array) {
    let result = []
    for (let index = array.length - 1; index >= 0; index--) {
        let isUnique = true
        for (let containedObject of result)
            if (JSON.stringify(array[index]) === JSON.stringify(containedObject)) {
                isUnique = false
                break
            }
        if (isUnique)
            result.push(array[index])
    }
    return result
}