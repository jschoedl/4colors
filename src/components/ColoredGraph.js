import {ForceGraph2D} from "react-force-graph";
import React from "react";
import {randomInteger, withoutDuplicateObjects} from "../lib/helpers";
import {containedEdges, isProperColoring} from "../lib/graphHelpers";

export const COLORS = [
    "#264653",
    "#2a9d8f",
    "#e9c46a",
    "#ff31b6",
    "#e76f51",
    "#af4d98",
    "#b7245c",
    "#32161f",
    "#f4a261",
    "#483d03"
]

export default class ColoredGraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nodes: props.nodes,
            edges: props.edges,
            displayMode: props.displayMode,
        }
        this.setDisplayMode = props.setDisplayMode
        this.setChromaticNumber = props.setChromaticNumber
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
        if (this.props.displayMode !== this.state.displayMode && this.props.displayMode !== 'custom')
            this.setState({
                nodes: this.props.nodes,
                edges: this.props.edges,
                displayMode: this.props.displayMode,
            }, () => setTimeout(() => this.minimalKColoring(), 10))
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
                        group: 0,
                        color: COLORS[0],
                    }
                ],
                edges: [...prevState.edges, ...newEdges],
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
        for (let k = 1; k <= 10; k++) {
            console.log(k)
            if (this.findKColoring(k)) {
                this.setChromaticNumber("= " + k)
                return
            }
        }
        this.setChromaticNumber("> 10")
    }
}