import * as React from 'react';
import * as firebase from 'firebase/app';
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
  public interval = null as any;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      response: '',
      post: '',
      responseToPost: '',
    };
    this.startTimer = this.startTimer.bind(this);
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

  startTimer(type: string, time: number) {
    let email = localStorage.getItem('User');
    
    localStorage.setItem('type', type);
    const timer = {
        isControl: (type == 'control'),
        done: false,
    }

    let expirationDate = new Date();
    expirationDate.setMinutes( expirationDate.getMinutes() + time );

    this.interval = setInterval(function() {
        var now = new Date().getTime();
        var distance = expirationDate.getTime() - now;
      
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        localStorage.setItem('minutes', minutes.toString());
        localStorage.setItem('seconds', seconds.toString());
      
        if (timer.isControl){
            document.getElementById('video-label').innerHTML = minutes + ' min ' + seconds + ' sec left';
        }else {
            document.getElementById('video-label').innerHTML = 'Approximately ' + minutes + ' min ' + seconds + ' sec until your turn';
        }
        

        let queue_ref = db.ref('queue/');
        queue_ref.once('value')
            .then(function(snapshot) {
                localStorage.setItem('queue', JSON.stringify(snapshot.val()));
        });
        
        let queue = JSON.parse(localStorage.getItem('queue'));
      
        if (distance < 0 || (queue[Object.keys(queue)[1]] == email && !timer.isControl)) {
            clearInterval(this.interval);
            this.interval = null;
            if (!timer.isControl){
                timer.isControl = true;
                timer.done = true;
                let queue_ref = db.ref('queue/');
                queue_ref.once('value')
                    .then(function(snapshot) {
                        localStorage.setItem('queue', JSON.stringify(snapshot.val()));
                });
                
                let queue = JSON.parse(localStorage.getItem('queue'));
                if (queue[Object.keys(queue)[1]] == email){
                    this.setState({enableButtons: true});
                    this.startTimer('control', 10);
                }else{
                    document.getElementById('video-label').innerHTML = 'Please Wait ...';
                }
            } else {
                timer.isControl = false;
                timer.done = true;
                this.setState({enableButtons: false});
                this.signOutUser();
            }
        }
    }.bind(this), 1000);
  }

  clearTimer() {
    clearInterval(this.interval);
  }

  render() {

    return (
      <div className="App">
        <NavBar />
        <div className="planeterrella-banner">
          <div className="planeterrella-img"></div>
        </div>

        <Route
          exact={true}
          path='/'
          render={(props) => <LandingPage {...props} startTimer={this.startTimer} clearTimer={this.clearTimer} db={db}/>}
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
