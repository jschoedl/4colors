import React from 'react';
import {ForceGraph2D} from "react-force-graph";

function App() {
    const data = {
        "nodes": [
            {"id": 1, "group": 1},
            {"id": 2, "group": 2},
            {"id": 3, "group": 3},
        ],
        "links": [
            {"source": 1, "target": 2},
            {"source": 1, "target": 3},
            {"source": 2, "target": 3},
        ]
    }
    return (
        <ForceGraph2D
            graphData={data}
            nodeAutoColorBy="group"
            nodeRelSize={7}
            linkWidth={4}
        />
    );
}

export default App;
