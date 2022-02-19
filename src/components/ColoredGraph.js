import {ForceGraph2D} from "react-force-graph";
import React from "react";
import {randomInteger, withoutDuplicateObjects} from "../lib/helpers";

export const COLORS = [
    "#28536b",
    "#c2948a",
    "#7ea8be",
    "#f6f0ed",
    "#bbb193",
    "#7fb069",
    "#f3f9d2",
    "#6b2d5c",
    "#3ddc97",
    "#c2f9bb",
]

export default class ColoredGraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nodes: props.nodes,
            edges: props.edges,
            numberOfColors: props.nodes.length,
        }
        this.setDisplayMode = props.setDisplayMode
    }

    static isProperColoring(nodes, edges) {
        for (let node of nodes) {
            for (let edge of this.incidentEdges(node, edges)) {
                if (edge.source.group === edge.target.group)
                    return false
            }
        }
        return true;
    }

    static idIsIncluded(nodes, id) {
        for (let node of nodes)
            if (node.id === id || node === id)
                return true
        return false
    }

    static containedEdges(nodes, edges) {
        return edges.filter(edge => (
            (ColoredGraph.idIsIncluded(nodes, edge.source) && ColoredGraph.idIsIncluded(nodes, edge.target))
        ))
    }

    static incidentEdges(node, edges) {
        return edges.filter(edge => edge.source.id === node.id || edge.target.id === node.id)
    }

    async setStateAsync(newState) {
        return new Promise(resolve =>
            this.setState(newState, resolve)
        )
    }

    findKColoring(k) {
        let nextIndex = 0;
        let newNodes = [], newEdges = []
        let initialNodes = [...this.state.nodes], initialEdges = [...this.state.edges]

        while (true) {
            if (ColoredGraph.isProperColoring(newNodes, newEdges)) {
                if (initialNodes.length === newNodes.length)
                    break;

                newNodes.push(initialNodes[nextIndex])
                newNodes[newNodes.length - 1].group = 0
                newEdges = ColoredGraph.containedEdges(newNodes, initialEdges)
                nextIndex++
            } else {
                while (newNodes[newNodes.length - 1].group === k - 1) {
                    newNodes.pop()
                    nextIndex--
                }
                newNodes[newNodes.length - 1].group++
            }
        }

        this.setState({
            nodes: newNodes,
            edges: initialEdges,
        }, this.updateColors)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props && this.props.nodes !== undefined)
            this.setState({
                nodes: this.props.nodes,
                edges: this.props.edges,
                numberOfColors: this.props.nodes.length,
            })
    }

    addNode() {
        this.setDisplayMode('custom')
        this.setState(prevState => {
            const newId = prevState.nodes.length
            let newEdges = []

            if (prevState.nodes.length) {
                const numberOfEdges = randomInteger(1, 2)
                for (let i = 0; i < numberOfEdges; i++) {
                    newEdges.push({
                        "source": newId,
                        "target": randomInteger(0, newId - 1)
                    })
                }
            }

            newEdges = withoutDuplicateObjects(newEdges)

            return {
                nodes: [
                    ...prevState.nodes,
                    {
                        id: newId,
                        group: prevState.numberOfColors,
                        color: COLORS[prevState.numberOfColors],
                    }
                ],
                edges: [...prevState.edges, ...newEdges],
                numberOfColors: prevState.numberOfColors + 1,
            }
        }, () => setTimeout(() => this.findKColoring(4), 10))
    }

    render() {
        const addNode = this.addNode.bind(this)
        return <div className="background">
            <ForceGraph2D
                graphData={{nodes: this.state.nodes, links: this.state.edges}}
                nodeRelSize={4}
                linkWidth={6}
                onBackgroundClick={addNode}
            />
        </div>
    }

    updateColors() {
        let newNodes = [...this.state.nodes]
        newNodes.forEach(node => {
            if (node.group !== undefined)
                node.color = COLORS[node.group]
        })
        this.setState({
            nodes: newNodes,
        })
    }
}