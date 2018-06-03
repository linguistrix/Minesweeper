import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Cell from "./Cell.js";

const MINE_CHAR = String.fromCodePoint(0x1f4a3);
const WON_MINE_CHAR = String.fromCodePoint(0x1f3c6);
const UNOPENED_SQUARE_CHAR = String.fromCodePoint(0x2b1b);

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
      //board: this.initBoard(numRows, numColumns, numMines),
      boardStatus: [...Array(numRows)].map(_ =>
        [...Array(numColumns)].map(_ => false)
      )
    };
  }

  hasWon() {
    for (let i = 0; i < this.state.numRows; ++i) {
      for (let j = 0; j < this.state.numColumns; ++j) {
        if (
          !this.state.boardStatus[i][j] &&
          !(this.state.board[i][j] == MINE_CHAR)
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
          !(i == iBlack && j == jBlack)
          ? MINE_CHAR
          : 0;
      })
    );
    for (let i = 0; i < numRows; ++i) {
      for (let j = 0; j < numColumns; ++j) {
        if (board[i][j] == MINE_CHAR) continue;
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
    const boardStatus = this.state.boardStatus;
    boardStatus[i][j] = true;
    if (this.state.board[i][j] == 0) {
      [-1, 0, 1].map(xoff =>
        [-1, 0, 1].map(yoff => {
          if (xoff == 0 && yoff == 0) {
            return;
          }
          if (
            this.isValidCell(
              this.state.numRows,
              this.state.numColumns,
              i + xoff,
              j + yoff
            ) &&
            !boardStatus[i + xoff][j + yoff]
          ) {
            this.openCell(i + xoff, j + yoff);
          }
        })
      );
    }
    return boardStatus;
  }

  clickCell(i, j) {
    if (this.state.youWon || this.state.youLost) return;
    if (this.state.board == undefined) {
      this.state.board = this.initBoard(
        this.state.numRows,
        this.state.numColumns,
        this.state.numMines,
        i,
        j
      );
    }

    this.setState({
      youLost: this.state.youLost || this.state.board[i][j] === MINE_CHAR,
      boardStatus: this.openCell(i, j),
      youWon: this.hasWon()
    });
  }

  isValidCell(numRows, numColumns, i, j) {
    return i >= 0 && i < numRows && j >= 0 && j < numColumns;
  }

  getNeighboringMineCount(board, numRows, numColumns, i, j) {
    let numMines = 0;
    [-1, 0, 1].map(xoff =>
      [-1, 0, 1].map(yoff => {
        if (xoff == 0 && yoff == 0) {
          return;
        }
        if (
          this.isValidCell(numRows, numColumns, i + xoff, j + yoff) &&
          board[i + xoff][j + yoff] == MINE_CHAR
        ) {
          numMines++;
        }
      })
    );
    return numMines;
  }

  render() {
    console.log(this.state);
    return (
      <div className="App">
        <div className="App-header">
          Minesweeper
          {this.state.youWon
            ? " (WINNER)"
            : this.state.youLost
              ? " (LOSER)"
              : ""}
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
                    >
                      <Cell
                        status={this.state.boardStatus[x][y]}
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