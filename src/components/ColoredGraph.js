import {ForceGraph2D} from "react-force-graph";
import React from "react";
import {randomInteger, withoutDuplicateObjects} from "../lib/helpers";
import {containedEdges, isProperColoring} from "../lib/graphHelpers";

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

    findKColoring(k) {
        let nextIndex = 0;
        let newNodes = [], newEdges = []
        let initialNodes = [...this.state.nodes], initialEdges = [...this.state.edges]

        while (true) {
            if (isProperColoring(newNodes, newEdges)) {
                if (initialNodes.length === newNodes.length)
                    break;

                newNodes.push(initialNodes[nextIndex])
                newNodes[newNodes.length - 1].group = 0
                newEdges = containedEdges(newNodes, initialEdges)
                nextIndex++
            } else {
                while (newNodes[newNodes.length - 1].group === k - 1) {
                    newNodes.pop()
                    nextIndex--
                    if (nextIndex === 0)
                        return false;
                }
                newNodes[newNodes.length - 1].group++
            }
        }

        this.setState({
            nodes: newNodes,
            edges: initialEdges,
        }, this.updateColors)
        return true;
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
        }, () => setTimeout(() => this.minimalKColoring(), 10))
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

    minimalKColoring() {
        for (let k = 1; k <= 10; k++)
            if (this.findKColoring(k))
                return;
    }
}