import firebase from 'firebase';
import React, { Component } from 'react';

import './App.css';
import Footer from './Footer';
import NavBar from './NavBar';
import LandingPage from './LandingPage';

const config = {
  apiKey: "AIzaSyAkHCx7BgKyYlZgToo2hZgM2g61RrKZYcU",
  authDomain: "ui-planeterrella.firebaseapp.com",
  databaseURL: "https://ui-planeterrella.firebaseio.com",
  projectId: "ui-planeterrella",
  storageBucket: "<BUCKET>.appspot.com",
  messagingSenderId: "433273184604"
};

let firebaseDb = firebase.initializeApp(config);
let ledOn = firebaseDb.database().ref("led_On")


class App extends Component {

  state = {
    response: '',
    post: '',
    responseToPost: '',
  };

  componentDidMount() {
    console.log(ledOn);
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };

  render() {
    return (
      <div className="App">
        <NavBar />
        <div className="planeterrella-banner">
          <div className="planeterrella-img"></div>
        </div>
        <LandingPage />



        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
        <Footer />
      </div>
    );
  }
}

export default App;
