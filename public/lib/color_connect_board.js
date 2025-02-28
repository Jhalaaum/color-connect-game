import ColorConnectTile from './color_connect_tile';
import { COLOR_POSITIONS, DELTAS, MESSAGES } from './constants';

class ColorConnectBoard {
  constructor(level) {
    this.level = level;
    this.grid = [];
    this.generateBoard();
  }

  gridSize() {
    switch (this.level) {
      case (1):
        return 8;
    }
  }

  generateBoard() {
    let gridSize = this.gridSize();

    for (let i = 0; i < gridSize; i++) {
      this.grid.push([]);
    }

    this.populateBoard(gridSize);
  }

  populateBoard(gridSize) {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        let r = this.dotColor2([i, j]);
        if (r) {
          let dotColor = r[0], message = r[1];
          this.grid[i][j] = new ColorConnectTile([i, j], dotColor, message);
        } else {
          this.grid[i][j] = new ColorConnectTile([i, j]);
        }
      }
    }
  }

  dotColor(pos) {
    let levelString = `${this.level}`;
    let colors = Object.keys(COLOR_POSITIONS[levelString]);
    
    for (let i = 0; i < colors.length; i++) {
      let color = colors[i];
      let colorPositions = COLOR_POSITIONS[levelString][color];
      for (let j = 0; j < colorPositions.length; j++) {
        if (this.areEqual(colorPositions[j].slice(0, 2), pos)) {
          return color;
        }
      }
    }

    return null;
  }
  
  dotColor2(pos) {
    let levelString = `${this.level}`;
    let colors = Object.keys(COLOR_POSITIONS[levelString]);
    
    for (let i = 0; i < colors.length; i++) {
      let color = colors[i];
      let colorPositions = COLOR_POSITIONS[levelString][color];
      for (let j = 0; j < colorPositions.length; j++) {
        if (this.areEqual(colorPositions[j].slice(0, 2), pos)) {
          return [color, colorPositions[j][2]];
        }
      }
    }

    return null;
  }

  areEqual(array1, array2) {
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  }

  won(pathStartPositions) {
    let colors = Object.keys(COLOR_POSITIONS[this.level]);
    return this.validPathColors(pathStartPositions).length === colors.length;
  }

  validPathColors(pathStartPositions) {
    // pathStartPositions => {red: [4, 0], green: [2, 1]}
    // going to use for rendering purposes
    let validPathColors = [];
    let colors = Object.keys(COLOR_POSITIONS[this.level]);

    for (let i = 0; i < colors.length; i++) {
      let color = colors[i];
      let startPos = COLOR_POSITIONS[this.level][color][0];
      let startDot = this.grid[startPos[0]][startPos[1]];
      let endPos = COLOR_POSITIONS[this.level][color][1];
      let endDot = this.grid[endPos[0]][endPos[1]];
      let pathStartPos = pathStartPositions[color];

      if (this.validPathCreated(startDot, endDot)) {
        validPathColors.push(color);
      }
    }

    return validPathColors;
  }

  validPathCreated(startTile, endTile, visitedTiles = []) {
    if (this.sameColoredNeighbors(startTile).length === 0) {
      return false;
    } else if (startTile.isNeighbor(endTile)) {
      return true;
    }

    let sameColoredNeighbors = this.sameColoredNeighbors(startTile);
    visitedTiles.push(startTile);
    let filteredNeighbors = sameColoredNeighbors.filter(el => {
      return !visitedTiles.includes(el);
    });

    for (let i = 0; i < filteredNeighbors.length; i++) {
      let newStartTile = filteredNeighbors[i];
      if (this.validPathCreated(newStartTile, endTile, visitedTiles)) {
        return true;
      }
    }

    return false;
  }

  sameColoredNeighbors(startTile) {
    let sameColoredNeighbors = [];
    let startTileColor = startTile.dotColor ? startTile.dotColor : startTile.pathSegmentColor;

    for (let i = 0; i < DELTAS.length; i++) {
      let delta = DELTAS[i];
      let newPos = [startTile.pos[0] + delta[0],
                    startTile.pos[1] + delta[1]];

      if (this.onBoard(newPos)) {
        let newTile = this.grid[newPos[0]][newPos[1]];
        let newTileColor = newTile.dotColor ? newTile.dotColor : newTile.pathSegmentColor;

        if (startTileColor === newTileColor) {
          sameColoredNeighbors.push(newTile);
        }
      }
    }

    return sameColoredNeighbors;
  }

  onBoard(pos) {
    let x = pos[0];
    let y = pos[1];

    if ((x >= 0 && y >= 0) && (x < this.gridSize() && y < this.gridSize())) {
      return true;
    } else {
      return false;
    }
  }
}

export default ColorConnectBoard;
