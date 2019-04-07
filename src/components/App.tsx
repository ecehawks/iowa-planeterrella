import * as React from 'react';

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
        <Footer />
      </div>
    );
  }
}