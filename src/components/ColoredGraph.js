import {ForceGraph2D} from "react-force-graph";
import React from "react";

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

    findMinimalKColoring() {
        // TODO: repeat if necessary
        let anythingChanged = false;
        let nodesCopy = [...this.state.nodes]

        for (let node of nodesCopy) {
            let connectingGroups = new Set()
            for (let edge of this.state.edges) {
                if (edge.source === node)
                    connectingGroups.add(edge.target.group)
                else if (edge.target === node)
                    connectingGroups.add(edge.source.group)
            }

            for (let newColor = 0; newColor < node.group; newColor++) {
                if (!connectingGroups.has(newColor)) {
                    node.group = newColor
                    node.color = COLORS[node.group]
                    this.setState({nodes: nodesCopy})
                    anythingChanged = true;
                }
            }
        }
    }

    insertRandomNode() {
        const highestIndex = this.state.nodes.length - 1
        let newEdges = []
        const numberOfEdges = Math.floor(Math.random() * 2 + 1)
        for (let i = 0; i < numberOfEdges; i++) {
            newEdges.push({
                "source": highestIndex,
                "target": Math.floor((i + Math.random()) * highestIndex / numberOfEdges)
            })
        }
        this.setState(
            prevState => ({edges: [...prevState.edges, ...newEdges]}),
            () => setTimeout(() => this.findMinimalKColoring(), 10)
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props && this.props.nodes !== undefined)
            this.setState({
                nodes: this.props.nodes,
                edges: this.props.edges,
                numberOfColors: this.props.nodes.length,
            })
    }

    addNode ()  {
        this.setDisplayMode('custom')
        this.setState(prevState => ({
            nodes: [
                ...prevState.nodes,
                {
                    id: prevState.nodes.length,
                    group: prevState.numberOfColors,
                    color: COLORS[prevState.numberOfColors],
                }
            ],
            numberOfColors: prevState.numberOfColors + 1,
        }), this.insertRandomNode)
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
}