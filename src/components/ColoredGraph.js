import {ForceGraph2D} from "react-force-graph";
import React from "react";

export default class ColoredGraph extends React.Component {
    constructor(props) {
        super(props)
        this.state = {nodes: this.props.nodes, links: this.props.links}
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.nodes !== this.state.nodes) {
            const highestIndex = this.state.nodes.length - 1
            let newLinks = []
            const numberOfLinks = Math.floor(Math.random() * this.state.nodes.length / 3 + 1)
            for (let i = 0; i < numberOfLinks; i++) {
                newLinks.push({
                    "source": highestIndex,
                    "target": Math.floor((i + Math.random()) * highestIndex / numberOfLinks)
                })
            }
            this.setState(previousState => ({links: [...previousState.links, ...newLinks]}))
        }
    }

    render() {
        const addNode = () => {
            this.setState(previousState => ({
                nodes: [
                    ...previousState.nodes,
                    {"id": previousState.nodes.length, "group": previousState.nodes.length}
                ]
            }))
        };

        return <ForceGraph2D
            graphData={{nodes: this.state.nodes, links: this.state.links}}
            nodeAutoColorBy="group"
            nodeRelSize={4}
            linkWidth={6}
            onBackgroundClick={addNode}
        />
    }
}