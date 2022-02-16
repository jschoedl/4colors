import {ForceGraph2D} from "react-force-graph";
import React from "react";

export default function ({data}) {
    return <ForceGraph2D
        graphData={data}
        nodeAutoColorBy="group"
        nodeRelSize={7}
        linkWidth={7}
    />
}