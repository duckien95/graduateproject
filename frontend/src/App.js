import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

// var App= React.createClass {(



// )}


export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.localhost =  "http://localhost:8000";
    this.state = {
      cityList :[],
    };
  }
  componentDidMount() {
    axios.get(this.localhost + '/api/citylist')
      .then(function (response) {
        console.log(response);
        this.setState.cityList =  response.data.city_list;
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  render() {
    return (
            <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="Users">
             <h1>Userssssssssssss</h1>
          {this.state.cityList.map(member =>
              <div key={member.city_id}>{member.city_name}</div>
            )}
          </div>
      </div>
    );
  }
}
