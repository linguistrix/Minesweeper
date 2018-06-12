import React, { Component } from 'react';
import './App.css';
import Cell from './Cell.js';
import constants from './constants.js';

class App extends Component {
  constructor() {
    super();
    const numRows = 7;
    const numColumns = 8;
    const numMines = 0.1 * (numRows * numColumns);
    this.state = {
      numRows,
      numColumns,
      numMines,
      youLost: false,
      youWin: false,
      board: undefined /* We do not define board initially so as to
      support a feature of Windows minesweeper that ensures that the
      first cell you click is never a mine */,
      isOpened: [...Array(numRows)].map(_ =>
        [...Array(numColumns)].map(_ => false)
      )
    };
  }

  hasWon() {
    for (let i = 0; i < this.state.numRows; ++i) {
      for (let j = 0; j < this.state.numColumns; ++j) {
        if (
          !this.state.isOpened[i][j] &&
          !(this.state.board[i][j] === constants.MINE_CHAR)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  initBoard(numRows, numColumns, numMines, iBlack, jBlack) {
    const board = [...Array(numRows).keys()].map(i =>
      [...Array(numColumns).keys()].map(j => {
        return Math.random() < numMines / (numRows * numColumns) &&
          !(i === iBlack && j === jBlack)
          ? constants.MINE_CHAR
          : 0;
      })
    );
    for (let i = 0; i < numRows; ++i) {
      for (let j = 0; j < numColumns; ++j) {
        if (board[i][j] === constants.MINE_CHAR) continue;
        board[i][j] = this.getNeighboringMineCount(
          board,
          numRows,
          numColumns,
          i,
          j
        );
      }
    }
    return board;
  }

  openCell(i, j) {
    const isOpened = this.state.isOpened;
    isOpened[i][j] = true;
    if (this.state.board[i][j] === 0) {
      [-1, 0, 1].map(xoff =>
        [-1, 0, 1].map(yoff => {
          if (xoff === 0 && yoff === 0) {
            return null;
          }
          if (
            this.isValidCell(
              this.state.numRows,
              this.state.numColumns,
              i + xoff,
              j + yoff
            ) &&
            !isOpened[i + xoff][j + yoff]
          ) {
            this.openCell(i + xoff, j + yoff);
          }
          return null;
        })
      );
    }
    return isOpened;
  }

  clickCell(i, j) {
    if (this.state.youWon || this.state.youLost || this.isMarkedCell(i, j))
      return;
    if (!this.state.board) {
      // eslint-disable-next-line
      this.state.board = this.initBoard(
        this.state.numRows,
        this.state.numColumns,
        this.state.numMines,
        i,
        j
      );
    }

    this.setState({
      youLost:
        this.state.youLost || this.state.board[i][j] === constants.MINE_CHAR,
      isOpened: this.openCell(i, j),
      youWon: this.hasWon()
    });
  }

  rightClickCell(i, j) {
    if (this.state.youWon || this.state.youLost || !this.state.board) return;
    this.setState({
      isOpened: this.toggleMarkCell(i, j)
    });
    return true;
  }

  toggleMarkCell(i, j) {
    const isOpened = this.state.isOpened;
    if (!isOpened[i][j]) {
      isOpened[i][j] = constants.MARKED_MINE_CHAR;
    } else if (isOpened[i][j] === constants.MARKED_MINE_CHAR) {
      isOpened[i][j] = false;
    }
    return isOpened;
  }

  isValidCell(numRows, numColumns, i, j) {
    return i >= 0 && i < numRows && j >= 0 && j < numColumns;
  }

  isMarkedCell(i, j) {
    return this.state.isOpened[i][j] === constants.MARKED_MINE_CHAR;
  }
  getNeighboringMineCount(board, numRows, numColumns, i, j) {
    let numMines = 0;
    [-1, 0, 1].map(xoff =>
      [-1, 0, 1].map(yoff => {
        if (xoff === 0 && yoff === 0) {
          return null;
        }
        if (
          this.isValidCell(numRows, numColumns, i + xoff, j + yoff) &&
          board[i + xoff][j + yoff] === constants.MINE_CHAR
        ) {
          numMines++;
        }
        return null;
      })
    );
    return numMines;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          Minesweeper
          {this.state.youWon
            ? ' (WINNER)'
            : this.state.youLost
              ? ' (LOSER)'
              : ''}
        </div>
        <center>
          <div className="mine-board">
            <table>
              {[...Array(this.state.numRows).keys()].map(x => (
                <tr className="row">
                  {[...Array(this.state.numColumns).keys()].map(y => (
                    <td
                      className="cell"
                      onClick={this.clickCell.bind(this, x, y)}
                      onContextMenu={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.rightClickCell(x, y);
                      }}
                    >
                      <Cell
                        status={this.state.isOpened[x][y]}
                        value={this.state.board ? this.state.board[x][y] : null}
                        youLost={this.state.youLost}
                        youWon={this.state.youWon}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </table>
          </div>
        </center>
      </div>
    );
  }
}

export default App;
