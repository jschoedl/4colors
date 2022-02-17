import {ForceGraph2D} from "react-force-graph";
import React, {useEffect, useState} from "react";

export default function ColoredGraph({nodes: initialNodes, links: initialLinks}) {
    const [nodes, setNodes] = useState(initialNodes)
    const [links, setLinks] = useState(initialLinks)

    const addNode = () => {
        setNodes(n => [
            ...n,
            {"id": n.length, "group": n.length},
        ])
    };
    useEffect(() => {
        const highestIndex = nodes.length - 1
        let newLinks = []
        const numberOfLinks = Math.floor(Math.random() * nodes.length/3 + 1)
        for (let i = 0; i < numberOfLinks; i++) {
            newLinks.push({
                "source": highestIndex,
                "target": Math.floor((i + Math.random()) * highestIndex / numberOfLinks)
            })
        }
        setLinks(l => [...l, ...newLinks])
    }, [nodes])
    return <ForceGraph2D
        graphData={{nodes: nodes, links: links}}
        nodeAutoColorBy="group"
        nodeRelSize={7}
        linkWidth={7}
        onBackgroundClick={addNode}
    />
}