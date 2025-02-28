import React from 'react';
import Tile from './tile';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.renderRows = this.renderRows.bind(this);
    this.renderTiles = this.renderTiles.bind(this);
  }

  render() {
    return (
      <div id='board' draggable="false">
        {this.renderRows()}
      </div>
    );
  }

  renderRows() {
    const board = this.props.board;
    return board.grid.map((row, i) => {
      return (
        <div draggable="false" className='row' key={`row-${i}`}>
          {this.renderTiles(row, i)}
        </div>
      );
    });
  }

  renderTiles(row, i) {
    return row.map((tile, j) => {
      return (
        <Tile tile={tile} key={i + j}
              validPathColors={this.props.validPathColors}
              currentColor={this.props.currentColor}
              updateCurrentColor={this.props.updateCurrentColor}
              previousTile={this.props.previousTile}
              updatePreviousTile={this.props.updatePreviousTile}
              updatePathSegmentColor={this.props.updatePathSegmentColor}
              clearPath={this.props.clearPath}
              pathStartPositions={this.props.pathStartPositions}
              updatePathStartPosition={this.props.updatePathStartPosition} 
              draggable="false"
              />
      );
    });
  }
}

export default Board;
