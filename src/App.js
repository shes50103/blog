import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';

class Item extends Component {
  static propTypes = {
    lang: PropTypes.string.isRequired,
  }
  static defaultProps = {
    age: 100,
  }
  render(){
    return (
      <li onClick={() => {
        this.props.clickCallback(this.props.lang);
      }}>
        {this.props.lang}
      </li>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    let langs = ["Ruby", "JavaScript", "Elixir"];
    let scores = langs.reduce((accu, l) => {
      accu[l] = 0;
      return accu;
    }, {})
    this.state = {
      langs,
      scores,
    }
  }
  handleClick(lang) {
    let newScore = Object.assign(this.state.scores, {
                     [lang]: this.state.scores[lang] + 1
                   })
    this.setState({ score: newScore })
  }
  getList() {
    return this.state.langs.map(i =>{
      return <Item lang={i}
                   clickCallback={this.handleClick.bind(this)} />
    });
  }

  showScores() {
    console.log(this.state.scores)
  }

  render() {
    return (
      <div className="App">
        <div>
          <ul>
            {this.getList()}
          </ul>
        </div>
        {this.showScores()}
      </div>
    );
  }
}

export default App;