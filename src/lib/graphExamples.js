export default function getGraph(label) {
    let nodes, edges
    switch (label) {
        case 'empty':
            nodes = []
            edges = []
            break
        case 'square':
            nodes = [
                {id: 0},
                {id: 1},
                {id: 2},
                {id: 3},
            ]
            edges = [
                {source: 0, target: 1},
                {source: 1, target: 2},
                {source: 2, target: 3},
                {source: 3, target: 0},
            ]
            break
        default:
            break
    }
    return [nodes, edges]
}