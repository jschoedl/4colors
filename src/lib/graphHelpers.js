export function isProperColoring(nodes, edges) {
    for (let node of nodes) {
        for (let edge of incidentEdges(node, edges)) {
            if (edge.source.group === edge.target.group)
                return false
        }
    }
    return true;
}

export function noProperColoring(edges){
    for (let edge of edges)
        if (edge.source === edge.target)
            return true
    return false
}

export function incidentEdges(node, edges) {
    return edges.filter(edge => edge.source.id === node.id || edge.target.id === node.id)
}

export function idIsIncluded(nodes, id) {
    for (let node of nodes)
        if (node.id === id || node === id)
            return true
    return false
}

export function containedEdges(nodes, edges) {
    return edges.filter(edge => (
        (idIsIncluded(nodes, edge.source) && idIsIncluded(nodes, edge.target))
    ))
}