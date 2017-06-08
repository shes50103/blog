import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Myc extends Component{
    render() {
      return (
        <h2>HIHIHI!!!!aaa</h2>
      );
  }
}

class App extends Component {
  handleClick(){
    console.log('AAA');
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 onClick={this.handleClick}>Welcome to React</h2>

        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Myc />
        
      </div>
    );
  }
}

export default App;
