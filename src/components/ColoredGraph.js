import {ForceGraph2D} from "react-force-graph";
import React from "react";
import {containedEdges, incidentEdges, isProperColoring, noProperColoring} from "../lib/graphHelpers";

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

export const SELECTION_COLOR = "#3973ff"
export const UNDEFINED_COLOR = "#000000"

export default class ColoredGraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nodes: props.nodes,
            edges: props.edges,
            displayMode: props.displayMode,
            selectedNode: null,
            freezeLayout: false,
        }
        this.setDisplayMode = props.setDisplayMode
        this.setChromaticNumber = props.setChromaticNumber
    }

    findKColoring(k) {
        let nextIndex = 0;
        let newNodes = [], newEdges = []
        let initialNodes = [...this.state.nodes], initialEdges = [...this.state.edges]

        while (true) {
            newNodes = containedEdges(newNodes, initialEdges)
            if (isProperColoring(newNodes, newEdges)) {
                if (initialNodes.length === newNodes.length)
                    break;

                newNodes.push(initialNodes[nextIndex])
                newNodes[newNodes.length - 1].group = 0
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
        if (this.props.displayMode !== this.state.displayMode) {
            if (this.props.displayMode !== 'custom')
                this.setState({
                    nodes: this.props.nodes,
                    edges: this.props.edges,
                    displayMode: this.props.displayMode,
                    freezeLayout: false,
                }, () => setTimeout(() => this.minimalKColoring(), 10))
            else
                this.setState({displayMode: this.props.displayMode})
        }
    }

    addNode() {
        this.setDisplayMode('custom')
        this.setState(prevState => ({
                nodes: [...prevState.nodes, {
                    id: Math.max(...prevState.nodes.map(node => node.id), 0) + 1,
                    group: 0,
                    color: COLORS[0],
                }],
                freezeLayout: true,
            }), () => setTimeout(() => this.minimalKColoring(), 10)
        )
    }

    addEdge(source, target) {
        this.setDisplayMode('custom')
        this.setState(prevState => ({
            edges: [...prevState.edges, {
                source: source,
                target: target,
            }],
            freezeLayout: false,
        }), () => setTimeout(() => this.minimalKColoring(), 10))
    }

    removeNode(nodeToRemove) {
        this.setDisplayMode('custom')
        this.setState(prevState => ({
            nodes: prevState.nodes.filter(node => node !== nodeToRemove),
            edges: prevState.edges.filter(edge => !incidentEdges(nodeToRemove, prevState.edges).includes(edge)),
            freezeLayout: false,
        }), () => setTimeout(() => this.minimalKColoring(), 10))
    }

    handleBackgroundClick() {
        if (this.state.selectedNode)
            this.setState({selectedNode: null})
        else
            this.addNode()
    }

    handleNodeClick(node) {
        if (this.state.selectedNode) {
            this.addEdge(this.state.selectedNode, node)
            this.setState({selectedNode: null})
        } else
            this.setState({selectedNode: node, freezeLayout: true})
    }

    drawNode(node, ctx) {
        ctx.fillStyle = node === this.state.selectedNode ? SELECTION_COLOR : node.color
        ctx.beginPath()
        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false)
        ctx.fill()
    }

    render() {
        const removeNode = this.removeNode.bind(this),
            handleBackgroundClick = this.handleBackgroundClick.bind(this),
            handleNodeClick = this.handleNodeClick.bind(this),
            drawNode = this.drawNode.bind(this)
        return <div className="background">
            <ForceGraph2D
                graphData={{nodes: this.state.nodes, links: this.state.edges}}
                cooldownTicks={this.state.freezeLayout ? 0 : Infinity}
                nodeRelSize={4}
                linkWidth={6}
                linkCurvature={edge => edge.source === edge.target}
                onBackgroundClick={handleBackgroundClick}
                onNodeClick={handleNodeClick}
                onNodeRightClick={removeNode}
                nodeCanvasObject={drawNode}
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
        if (!noProperColoring(this.state.edges)) {
            for (let k = 1; k <= 10; k++) {
                if (this.findKColoring(k)) {
                    this.setChromaticNumber("= " + k)
                    return
                }
            }
            this.setChromaticNumber("> 10")
        } else
            this.setChromaticNumber("= ∞")

        let nodesCopy = [...this.state.nodes]
        for (let node of nodesCopy)
            node.color = UNDEFINED_COLOR
        this.setState({
            nodes: nodesCopy,
        })
    }
}
