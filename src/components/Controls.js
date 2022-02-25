import {Button, Stack} from "react-bootstrap";

export default function Controls(props) {
    const displayMode = props.displayMode;
    const setDisplayMode = props.setDisplayMode;

    function DisplayModeButton(props){
        const label = props.children;
        return <Button onClick={() => setDisplayMode(label)} disabled={label === displayMode}>
            {label}
        </Button>
    }

    return <div className="menu top right">
        <Stack gap={3}>
            <DisplayModeButton>Empty Graph</DisplayModeButton>
            <DisplayModeButton>C5</DisplayModeButton>
            <DisplayModeButton>C6</DisplayModeButton>
            <DisplayModeButton>K5</DisplayModeButton>
        </Stack>
    </div>
}