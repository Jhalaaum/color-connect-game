import React from 'react';
import ColorConnectBoard from '../public/lib/color_connect_board';
import Board from './board';
import Modal from 'react-modal';
import ModalStyle from '../stylesheets/modal_style';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modalOpen: false};
    this.resetLevel = this.resetLevel.bind(this);
    this.nextLevel = this.nextLevel.bind(this);
    this.startGameOver = this.startGameOver.bind(this);
    this._handleAboutClick = this._handleAboutClick.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);
  }

  resetLevel() {
    this.props.updateCurrentColor(null); // may not need - check later!
    this.props.createBoard(this.props.board.level);
  }

  nextLevel() {
    this.props.createBoard(this.props.board.level + 1);
  }

  startGameOver() {
    this.props.createBoard(1);
  }

  _handleAboutClick() {
    this.setState({
      modalOpen: true
    });
  }

  onModalClose() {
    this.setState({
      modalOpen: false
    });
    ModalStyle.content.opacity = 0;
  }

  onModalOpen() {
    ModalStyle.content.opacity = 100;
  }

  render() {
    let modal;
    let text;
    let buttons;

    let pathStartPositions = this.props.pathStartPositions;
    if (this.props.board.won(pathStartPositions)) {
      if (this.props.board.level === 3) {
        text = "Wow! You Beat All Levels!";
        buttons = <div>
                    <button className='start-game-over-btn' onClick={this.startGameOver}>Start Over</button>
                    <button className='github-link'><a href='https://github.com/msantam2/color-connect'>Check Out Code on GitHub!</a></button>
                  </div>;
      } else {
        text = "You Beat This Level! The next tinyurl link is - https://morse-code-trweek-bd04c.web.app/";
        buttons = <div>
                    <button className='play-again-btn' onClick={this.resetLevel}>Play Again</button>
                  </div>;
      }
      modal =
        <div className='modal-screen'>
          <div className='modal-content'>
            <p className='you-won-text'>{text}</p>
            {buttons}
          </div>
        </div>;
    }

    let dimensions = `${this.props.board.gridSize()}x${this.props.board.gridSize()}`;

    return (
      <div className='game-container'>
        {modal}
        <div className='game-header'>
          <button className='about-btn' onClick={this._handleAboutClick}>About</button>
          <p className='level-header'>Connect the CCA to its Fun Fact</p>
          <button className='reset-btn' onClick={this.resetLevel}>Reset</button>
        </div>
        <Board board={this.props.board}
               validPathColors={this.props.board.validPathColors(this.props.pathStartPositions)}
               currentColor={this.props.currentColor}
               updateCurrentColor={this.props.updateCurrentColor}
               previousTile={this.props.previousTile}
               updatePreviousTile={this.props.updatePreviousTile}
               updatePathSegmentColor={this.props.updatePathSegmentColor}
               clearPath={this.props.clearPath}
               pathStartPositions={this.props.pathStartPositions}
               updatePathStartPosition={this.props.updatePathStartPosition} />


        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={this.onModalClose}
          style={ModalStyle}
          onAfterOpen={this.onModalOpen}>

          <button onClick={this.onModalClose} className='about-close-btn'>&#10006;</button>
          <p className='about-info'>
            Welcome! You are provided a board that contains several different nodes scattered within it (One CCA Name and One Fact). The goal is to draw a path connecting the CCA name to the Fun Fact. Sound easy? Make sure to stick to the following rules:
            <br></br>
            <br></br>
            1. No paths may overlap
            <br></br>
            <br></br>
            2. Every space on the board must be filled (either by a Fact/CCA node or a segment of a path)
            <br></br>
            <br></br>
            To begin drawing a new path, click and drag from a node onto surrounding tiles, or from the end of a path already in progress.
            <br></br>
            <br></br>
            To undo moves, you can click on a original node, which clears the current path for that color from the board.
            <br></br>
            Also, you can click the 'Reset' button to the top-right of the board, which clears the whole board
            <br></br>
            <br></br>
            Good luck!
          </p>
        </Modal>
      </div>
    );
  }
}

export default Game;
