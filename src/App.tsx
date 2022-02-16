import React from 'react';
import ColoredGraph from "./components/ColoredGraph";

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
    return <ColoredGraph data={data}/>;
}

export default App;
