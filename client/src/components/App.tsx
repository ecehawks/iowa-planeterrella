import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/database';

import NavBar from './NavBar';
import LandingPage from './LandingPage';
import Footer from './Footer';
import InfoPage from './InfoPage';

import { aurora, history, stellar, varb } from '../info'

import { Route } from "react-router-dom";

type AppState = {
  response: string,
  post: string,
  responseToPost: string,
};

type AppProps = {};

const config = {
  apiKey: "AIzaSyAkHCx7BgKyYlZgToo2hZgM2g61RrKZYcU",
  authDomain: "ui-planeterrella.firebaseapp.com",
  databaseURL: "https://ui-planeterrella.firebaseio.com",
  projectId: "ui-planeterrella",
  storageBucket: "<BUCKET>.appspot.com",
  messagingSenderId: "433273184604"
};

let firebaseApp = firebase.initializeApp(config);
let db = firebaseApp.database();
let ref = db.ref("led_On");
ref.on("value", function(snapshot) {
  console.log("Key: " + snapshot.key + " Value: " + snapshot.val());
});

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {
      response: '',
      post: '',
      responseToPost: '',
    };
  };

  componentDidMount() {
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

  handleSubmit = async (e: { preventDefault: () => void; }) => {
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

        <Route exact={true} path="/" component={LandingPage} />
        <Route
          path='/aurora'
          render={(props) => <InfoPage {...props} infoProps={aurora} />}
        />
        <Route
          path='/van-allen-radiation-belts'
          render={(props) => <InfoPage {...props} infoProps={varb} />}
        />
        <Route
          path='/stellar-ring-current'
          render={(props) => <InfoPage {...props} infoProps={stellar} />}
        />
        <Route
          path='/history'
          render={(props) => <InfoPage {...props} infoProps={history} />}
        />


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
