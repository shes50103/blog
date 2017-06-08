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

class Item extends Component{
    render() {
      return <li>
              {this.props.lang}
              {this.props.children}
            </li>
  }
}

class App extends Component {
   constructor(props) {
    super(props);
    let scores = {
      Ruby:0,Goby:0,JS:0
    }
    // var lang = ["Ruby", "Goby", "JS"]

    this.state = {
      scores:scores,
      lang: props.lang
    };
  }


  handleClick(lang){
    console.log(lang);
    //add!!!
    let newScore = Object.assign(this.state.scores, {[lang]: this.state.score[lang]+1})
    this.setState({score: newScore})
  }

  gitList(){
    var l = ["Ruby", "Goby", "JS"]

    return l.map( i => {
      return <Item lang={i} >
               <h3 onClick={this.handleClick.bind(this)}> .</h3>
             </Item>
    });
  }

  showScores(){
    console.log(this.state.scores)
  }

  render() {
    return (
      <div className="App">
        <div className="App-header" ref="App-header" >
          <img src={logo} className="App-logo" alt="logo" />
          <h2 onClick={this.handleClick} > Welcome to React</h2>

        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Myc />
       <div>
          <ul>
            {this.gitList()}
          </ul>
       </div>
          {this.showScores()}
        
      </div>
    );
  }
}

export default App;
