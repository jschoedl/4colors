import {Button, Stack} from "react-bootstrap";

export default function Controls() {
    return <div className="menu top right">
        <Stack gap={3}>
            <Button>empty</Button>
            <Button disabled>square</Button>
        </Stack>
    </div>
}