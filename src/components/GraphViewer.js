import ColoredGraph from "./ColoredGraph";
import Controls from "./Controls";
import React from "react";
import getGraph from "../lib/graphExamples";

export default class GraphViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayMode: 'empty',
        }
        this.setDisplayMode = this.setDisplayMode.bind(this)
    }

    setDisplayMode(newDisplayMode) {
        this.setState({displayMode: newDisplayMode})
    }

    render() {
        let [nodes, edges] = getGraph(this.state.displayMode)
        return <>
            <Controls setDisplayMode={this.setDisplayMode} displayMode={this.state.displayMode}/>
            <ColoredGraph nodes={nodes} edges={edges} setDisplayMode={this.setDisplayMode}/>
        </>
    }
}