import React from 'react';
import ColoredGraph from "./components/ColoredGraph";

function App() {
    const nodes = [
        {"id": 0, "group": 0},
        {"id": 1, "group": 1},
        {"id": 2, "group": 2},
    ], links = [
        {"source": 0, "target": 1},
        {"source": 0, "target": 2},
        {"source": 1, "target": 2},
    ]

    return <ColoredGraph nodes={nodes} links={links}/>;
}

export default App;
