import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';

import NavBar from './NavBar';
import LandingPage from './LandingPage';
import Footer from './Footer';
import InfoPage from './InfoPage';

import { aurora, history, stellar, varb } from '../info';

import { Route } from 'react-router-dom';

type AppState = {};

type AppProps = {};

// Firebase Configuration
const config = {
  apiKey: 'AIzaSyAkHCx7BgKyYlZgToo2hZgM2g61RrKZYcU',
  authDomain: 'ui-planeterrella.firebaseapp.com',
  databaseURL: 'https://ui-planeterrella.firebaseio.com',
  projectId: 'ui-planeterrella',
  storageBucket: '<BUCKET>.appspot.com',
  messagingSenderId: '433273184604'
};

let firebaseApp = firebase.initializeApp(config);
let db = firebaseApp.database();

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = {};
  };

  render() {

    return (
      <div className='App'>
        <NavBar />
        <div className='planeterrella-banner'>
          <div className='planeterrella-img'></div>
        </div>
        <Route
          exact={true}
          path='/'
          render={(props) => <LandingPage 
            {...props}
            db={db}
          />}
        />
        
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
