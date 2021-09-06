import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {

    render() {
      return (
        <button className={this.props.winnerSquares.includes(this.props.squareNumber) ? "square winner" : "square"} 
                onClick={() => this.props.onClick()}
        >
          {this.props.value}
        </button>
      );
    }
  }
  
  class Board extends React.Component {
    renderSquare(j) {
      return (<Square 
                winnerSquares={this.props.winnerSquares}
                value={this.props.squares[j]}
                squareNumber={j}
                onClick={() => this.props.onClick(j)}
            />);
    }
    renderRow(i){
      let squares = [];
      console.log(this.state)
      for(let j = 0; j <= 2; j++){
        squares.push(this.renderSquare((i * 3) + j))
      }
      return (
        <div className="board-row">
          {squares}
        </div>
      );
    }
    renderRows(){
      let rows = [];
      for(let i = 0; i <= 2; i++){
        rows.push(this.renderRow(i))
      }
      return rows;
    }
    render() {
      return (
        <div>
          {this.renderRows()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
            sort: 'asc'
        }
    }

    handleClick(i) { 
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(calculateWinner(squares)['result'] || squares[i]){
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
          history: history.concat([{
              squares: squares,
              column: i % 3 === 0 ? 3 : i % 3,
              row: Math.ceil(i / 3)
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext, 
      })
    }
    
    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }

    sortMoves = (event) => {
      this.setState((state, props) => {
        let sort = event.target.value;
        return{
          sort: sort,
        }
      })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerInfo = calculateWinner(current.squares);
        const winner = winnerInfo['result'];
        const winnerSquares = winnerInfo['winnerSquares'];
        const sort = this.state.sort;
        const moves = history.map((step, move) => {
          const column = step.column;
          const row = step.row;
          const desc = move ?
            'Go to move #' + move + '-> Column: ' + column + ' Row: ' + row : 
            'Go to game start';
          return(
            <li value={move + 1} key={move}>
                <button 
                  style={ this.state.stepNumber === move ? {fontWeight: 'bold'} : {fontWeight: 'normal'}} 
                  onClick={() => this.jumpTo(move)}>
                    {desc}
                </button>
            </li>
          );
        });
          
        if(sort === 'desc'){
          moves.reverse();
        }
        let status; 
        if(winner) {
            status = 'Winner: ' + winner;
            console.log(this.state.history);
        }
        else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
        <div className="game">
            <div className="game-board">
            <Board 
                winnerSquares={winnerSquares}
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
              <select 
                onChange={this.sortMoves}
                defaultValue={this.state.sort}
              >
                <option value='asc'>Ascending</option>
                <option value='desc'>Descending</option>
              </select>
            <ol>{moves}</ol>
            </div>
        </div>
        );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares?.[a] != null && squares?.[a] === squares?.[b] && squares?.[a] === squares?.[c]) {
        return {
          result: squares[a],
          winnerSquares: lines[i]
        }
      }
    }
    return {
      result: false,
      winnerSquares: []
    };
  }
