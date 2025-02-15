import React from "react";
import PathSegment from "./path_segment";
import { useState } from "react";

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.handleColoredTile = this.handleColoredTile.bind(this);
    this.handleEmptyTile = this.handleEmptyTile.bind(this);
    this.renderPathSegment = this.renderPathSegment.bind(this);
    this.state = {
      visible: false,
    };
  }

  handleColoredTile(tileColor, isDot) {
    this.props.updateCurrentColor(tileColor);
    this.props.updatePreviousTile(this.props.tile);

    if (isDot) {
      this.props.clearPath(tileColor);
    }
  }

  handleEmptyTile(e) {
    // e.buttons === 1 simply checks that the mouse is pressed down
    // i.e. creating the feeling of clicking and dragging a path
    if (e.buttons === 1) {
      let pathSegmentColor = this.props.tile.pathSegmentColor;
      let pos = this.props.tile.pos;

      if (this.props.tile.isNeighbor(this.props.previousTile)) {
        if (this.props.previousTile.dotColor) {
          this.props.updatePathStartPosition(
            this.props.currentColor,
            this.props.tile.pos
          );
        }
        this.props.updatePathSegmentColor(this.props.currentColor, pos);
        this.props.updatePreviousTile(this.props.tile);
      }
    }
  }

  renderPathSegment() {
    if (this.props.tile.pathSegmentColor) {
      return <PathSegment color={this.props.tile.pathSegmentColor} />;
    }
  }

  render() {
    let tileContent;
    let cursorReset;

    if (this.props.tile.dotColor) {
      let dotColor = `${this.props.tile.dotColor}`;
      let coloredDotStyle;
      if (this.props.validPathColors.includes(dotColor)) {
        coloredDotStyle = { background: dotColor, border: "3px solid #3ff858" };
      } else {
        coloredDotStyle = { background: "red" };
      }
      cursorReset = "cursor-reset";

      tileContent = (
        <div
          className="colored-dot"
          style={coloredDotStyle}
          onMouseDown={this.handleColoredTile.bind(null, dotColor, true)}
          onMouseEnter={() => this.state.visible = true}
          onMouseLeave={() => this.state.visible = false}
        ></div>
      );
    } else {
      tileContent = (
        <div
          className="path-tile"
          onMouseDown={this.handleColoredTile.bind(
            null,
            this.props.tile.pathSegmentColor,
            false
          )}
          onMouseOver={this.handleEmptyTile}
        >
          {this.renderPathSegment()}
        </div>
      );
    }

    return (
      <div className={`tile ${cursorReset}`}>
        {this.state.visible ? (
          <div style={{ position: "absolute", backgroundColor: "white", userSelect: "none"}}>
            {this.props.tile.message}
          </div>
        ) : null}
        {tileContent}
      </div>
    );
  }
}

export default Tile;
