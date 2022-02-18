import ColoredGraph from "./ColoredGraph";
import Controls from "./Controls";
import React from "react";

export default function GraphViewer(){
    return <>
        <Controls/>
        <ColoredGraph nodes={[]} edges={[]}/>
    </>
}