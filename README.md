# Chromatic Number Visualizer
## Usage
Visit [the website](https://4colors.jschoedl.ml) to try it out!
* click on the background to create nodes
* click on source and target node to create a new edge
* right click on a node to remove it
* drag the background or scroll for adjusting the view

## Examples
> <img src="/docs/moser_spindle.png" width=500px>
>
> The [Moser Spindle](https://en.wikipedia.org/wiki/Moser_spindle), a graph with the chromatic number 4.

> <img src="/docs/c5.png" width=500px>
>
> $C_5$, another planar graph.

> <img src="/docs/k5.png" width=500px>
>
> $K_5$, a non-planar graph with a chromatic number of 5.

## Running it locally
Make sure [Node.js and npm](https://nodejs.org/en/download/) are installed, clone this repository and open its folder in a terminal.
* `npm i`: install all dependencies
* `npm start`: development mode at [http://localhost:3000](http://localhost:3000)
* `npm run build`: production build to the `build` folder
