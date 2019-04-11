import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';

import NavBar from './NavBar';
import LandingPage from './LandingPage';
import Footer from './Footer';
import InfoPage from './InfoPage';

import { aurora, history, stellar, varb } from '../info';

import { Alert } from 'reactstrap';

import { Route, RouteProps } from 'react-router-dom';

type AppState = {
  timerAlert: string,
  visible: boolean,
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
  private child: React.LegacyRef<Route<RouteProps>>;
  constructor(props: AppProps) {
    super(props);
    this.state = {
      timerAlert: 'Welcome',
      visible: false,
    };
    this.startTimer = this.startTimer.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.child = React.createRef();
  };

  componentDidMount() { }

  componentWillUnmount() {
    this.clearTimer();
  }

  startTimer(type: string, duration: number) {
    let email = localStorage.getItem('User');
    
    const timer = {
        isControl: (type == 'control'),
        done: false,
    }

    let expirationDate = new Date();
    expirationDate.setMinutes( expirationDate.getMinutes() + duration );

    this.interval = setInterval(function() {
        var now = new Date().getTime();
        var distance = expirationDate.getTime() - now;
      
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
        this.setState({visible: true});
        if (timer.isControl){
            document.getElementById('video-label').innerHTML = minutes + ' min ' + seconds + ' sec left';
            this.setState({timerAlert: minutes + ' min ' + seconds + ' sec left'});
        }else {
            document.getElementById('video-label').innerHTML = 'Approximately ' + minutes + ' min ' + seconds + ' sec until your turn';
            this.setState({timerAlert: 'Approximately ' + minutes + ' min ' + seconds + ' sec until your turn'});
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
                this.setState({enableButtons: false, visible: false});
                this.child.current.signOutUser();
            }
        }
    }.bind(this), 1000);
  }

  clearTimer() {
    clearInterval(this.interval);
  }

  closeAlert() {
    this.setState({ visible: false });
  }

  render() {
    let { timerAlert, visible } = this.state;

    return (
      <div className='App'>
        <NavBar />
        <div className='planeterrella-banner'>
          <div className='planeterrella-img'></div>
        </div>
        <Alert 
          className='timer-alert' 
          color='secondary' 
          isOpen={visible} 
          toggle={this.closeAlert}
        >
          {timerAlert}
        </Alert>
        <Route
          exact={true}
          path='/'
          ref={this.child}
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
