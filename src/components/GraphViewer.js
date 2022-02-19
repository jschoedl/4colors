import ColoredGraph from "./ColoredGraph";
import Controls from "./Controls";
import React from "react";
import getGraph from "../lib/graphExamples";
import ChromaticNumber from "./ChromaticNumber";

export default class GraphViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayMode: 'empty',
            chromaticNumber: 1,
        }
        this.setDisplayMode = this.setDisplayMode.bind(this)
        this.setChromaticNumber = this.setChromaticNumber.bind(this)
    }

    setDisplayMode(newDisplayMode) {
        this.setState({displayMode: newDisplayMode})
    }

    setChromaticNumber(newChromaticNumber) {
        this.setState({chromaticNumber: newChromaticNumber})
    }

    render() {
        let [nodes, edges] = getGraph(this.state.displayMode)
        return <>
            <ChromaticNumber chromaticNumber={this.state.chromaticNumber}/>
            <Controls setDisplayMode={this.setDisplayMode} displayMode={this.state.displayMode}/>
            <ColoredGraph nodes={nodes} edges={edges} setDisplayMode={this.setDisplayMode} setChromaticNumber={this.setChromaticNumber}/>
        </>
    }
}