/**
* Prüfe, ob eine Färbung gültig ist, und gib dementsprechend true oder false zurück.
*/
export function isProperColoring(nodes, edges) {
    // an den beiden Enden jeder Kante müssen unterschiedliche Farbgruppen vorliegen
    for (let node of nodes) {
        for (let edge of incidentEdges(node, edges)) {
            if (edge.source.group === edge.target.group)
                return false
        }
    }
    return true;
}

/**
* Prüfe, ob eine Färbung unmöglich ist, und gib dementsprechend true oder false zurück.
*/
export function noProperColoring(edges){
    for (let edge of edges)
        if (edge.source === edge.target)
            // ein Knoten ist mit sich selbst verbunden
            return true
    return false
}

/**
* Gib alle inzidenten Kanten des Knoten zurück.
*/
export function incidentEdges(node, edges) {
    return edges.filter(edge => edge.source.id === node.id || edge.target.id === node.id)
}

/**
* Prüfe, ob ein Knoten mit dieser ID existiert, und gib dementsprechend true oder false zurück.
*/
export function idIsIncluded(nodes, id) {
    for (let node of nodes)
        if (node.id === id || node === id)
            return true
    return false
}

/**
* Gib die Kanten zurück, deren Endknoten jeweils gegeben sind.
*/
export function containedEdges(nodes, edges) {
    return edges.filter(edge => (
        (idIsIncluded(nodes, edge.source) && idIsIncluded(nodes, edge.target))
    ))
}
