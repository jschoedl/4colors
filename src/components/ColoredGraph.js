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
        // Sobald sich dieser State ändert, wird die Methode render() neu aufgerufen.
        // Dadurch aktualisiert sich die Darstellung automatisch, wenn etwas am Graphen verändert wurde.
        this.state = {
            nodes: props.nodes, // Array mit Objekten, siehe src/lib/graphExamples.js
            edges: props.edges, // Array mit Objekten, siehe src/lib/graphExamples.js
            displayMode: props.displayMode, // aktuell dargestellter Graph ('custom') oder eines der Beispiele
            selectedNode: null, // aktuell ausgewählte Node
            freezeLayout: false, // true, wenn sich die Visualisierung des Graphen nicht bewegen soll
        }
        this.setDisplayMode = props.setDisplayMode // Methodenaufruf setzt die aktuelle displayMode global
        this.setChromaticNumber = props.setChromaticNumber // Methodenaufruf setzt die aktuelle chromatische Zahl global
    }

    /**
    * Sucht mit Backtracking nach einer k-Färbung des Graphen.
    * 
    * Wendet eine Färbung an und gibt true zurück, falls dies möglich ist.
    * Andernfalls wird das Ergebnis verworfen und false zurückgegeben.
    */
    findKColoring(k) {
        // Starte mit einem leeren Graphen und einer Kopie des ursprünglichen Graphen.
        let nextIndex = 0
        let newNodes = [], newEdges = []
        let initialNodes = [...this.state.nodes], initialEdges = [...this.state.edges]

        while (true) {
            // betrachte alle Kanten, die zwischem Knoten des neuen Graphen gebildet werden
            newEdges = containedEdges(newNodes, initialEdges)
            if (isProperColoring(newNodes, newEdges)) {
                // falls die aktuelle Färbung gültig ist:
                if (initialNodes.length === newNodes.length)
                    // Abbruch, sobald alle Knoten und Kanten mit gültiger Färbung eingefügt wurden
                    break;

                // füge einen Knoten hinzu
                newNodes.push(initialNodes[nextIndex])
                newNodes[newNodes.length - 1].group = 0
                nextIndex++
            } else {
                // falls die aktuelle Färbung ungültig ist:
                // lösche alle hinteren Knoten aus der Gruppe k, da ihre Gruppe nicht erhöht werden kann
                while (newNodes[newNodes.length - 1].group === k - 1) {
                    newNodes.pop()
                    nextIndex--
                    if (nextIndex === 0)
                        // k-Färbung nicht möglich (alle Kombinationen sind fehlgeschlagen)
                        return false;
                }
                // erhöhe die Gruppe beim aktuellen Knoten
                newNodes[newNodes.length - 1].group++
            }
        }

        // Anwenden der Färbung
        this.setState({
            nodes: newNodes,
            edges: initialEdges,
        }, this.updateColors)
        return true;
    }

    /**
    * Diese Methode wird aufgerufen, wenn eine Änderung am Graphen stattfand.
    */
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.displayMode !== this.state.displayMode) {
            if (this.props.displayMode !== 'custom')
                // falls gerade ein Beispiel geladen wurde (d.h. nicht der Darstellungsmodus 'custom' vorliegt):
                // aktualisiere den Graphen entsprechend und suche anschließend eine neue optimale k-Färbung
                this.setState({
                    nodes: this.props.nodes,
                    edges: this.props.edges,
                    displayMode: this.props.displayMode,
                    freezeLayout: false,
                }, () => setTimeout(() => this.minimalKColoring(), 10))
            else
                // falls gerade eine Veränderung vom Nutzer stattfand: propagiere den Darstellungsmodus 'custom' an den Graphen
                this.setState({displayMode: this.props.displayMode})
        }
    }

    /**
    * Fügt einen neuen Knoten ohne Kanten zum Graphen hinzu.
    */
    addNode() {
        // Ausgrauung des ggf. ausgewählten Beispiels wird aufgehoben
        this.setDisplayMode('custom')
        // Knoten wird hinzugefügt, woraufhin eine neue optimale k-Färbung gesucht wird
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

    /**
    * Fügt eine neue Knoten Kante zwischen zwei Knoten-IDs zum Graph hinzu.
    */
    addEdge(source, target) {
        // Ausgrauung des ggf. ausgewählten Beispiels wird aufgehoben
        this.setDisplayMode('custom')
        // Kante wird hinzugefügt, woraufhin eine neue optimale k-Färbung gesucht wird
        this.setState(prevState => ({
            edges: [...prevState.edges, {
                source: source,
                target: target,
            }],
            freezeLayout: false,
        }), () => setTimeout(() => this.minimalKColoring(), 10))
    }
    
    /**
    * Entfernt einen Knoten einer ID aus dem Graphen.
    */
    removeNode(nodeToRemove) {
        // Ausgrauung des ggf. ausgewählten Beispiels wird aufgehoben
        this.setDisplayMode('custom')
        // Knoten wird mit allen inzidenten Kanten entfernt, woraufhin eine neue optimale k-Färbung gesucht wird
        this.setState(prevState => ({
            nodes: prevState.nodes.filter(node => node !== nodeToRemove),
            edges: prevState.edges.filter(edge => !incidentEdges(nodeToRemove, prevState.edges).includes(edge)),
            freezeLayout: false,
        }), () => setTimeout(() => this.minimalKColoring(), 10))
    }

    /**
    * Verarbeite einen Linksklick auf den Hintergrund.
    */
    handleBackgroundClick() {
        if (this.state.selectedNode)
            // entferne die aktuelle Auswahl
            this.setState({selectedNode: null})
        else
            // füge einen neuen Knoten hinzu, falls keine Auswahl vorliegt
            this.addNode()
    }

    /**
    * Verarbeite einen Linksklick auf einen Knoten.
    */
    handleNodeClick(node) {
        if (this.state.selectedNode) {
            // füge eine Kante zum bereits ausgewählten Knoten hinzu
            this.addEdge(this.state.selectedNode, node)
            this.setState({selectedNode: null})
        } else
            // wähle den Knoten aus und friere die Darstellung ein
            this.setState({selectedNode: node, freezeLayout: true})
    }

    /**
    * Stelle einen Knoten dar.
    */
    drawNode(node, ctx) {
        ctx.fillStyle = node === this.state.selectedNode ? SELECTION_COLOR : node.color
        ctx.beginPath()
        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false)
        ctx.fill()
    }

    /**
    * Stelle den Graphen dar.
    */
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

    /**
    * Färbe alle Knoten entsprechend der Gruppen, denen sie vom Algorithmus zugeordnet wurden.
    */
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

    /**
    * Ermittle die chromatische Zahl und Färbe den Graphen damit.
    */
    minimalKColoring() {
        if (!noProperColoring(this.state.edges)) {
            // Beginne mit k=1 und erhöhe k, bis eine gültige Färbung existiert.
            for (let k = 1; k <= 10; k++) {
                if (this.findKColoring(k)) {
                    this.setChromaticNumber("= " + k)
                    return
                }
            }
            this.setChromaticNumber("> 10")
        } else
            // Setze die chromatische Zahl auf ∞, wenn ein Knoten mit sich selbst verbunden ist.
            this.setChromaticNumber("= ∞")

        // Färbe alle Knoten schwarz, wenn keine Färbung gefunden wurde.
        let nodesCopy = [...this.state.nodes]
        for (let node of nodesCopy)
            node.color = UNDEFINED_COLOR
        this.setState({
            nodes: nodesCopy,
        })
    }
}
