import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';

import { Container, Row, Col, Button } from 'reactstrap';

import SignIn from './SignIn';
import SignUp from './SignUp';

require('firebase/auth')

type LandingPageState = {
    voltage: number,
    airPressure: number,
    enableButtons: boolean,
    showSignUp: boolean,
    showSignIn: boolean,
    showControls: boolean,
    successFailMessage: string,
    mode: string,
    queue: any[],
}

type LandingPageProps = {};

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
let led_On_ref = db.ref("led_On/");

// console.log the value of the db
led_On_ref.on("value", function (snapshot) {
    console.log("Key: " + snapshot.key + ", Value: " + snapshot.val());
});

let db_ref = db.ref();
db_ref.update({ led_On: false });

export default class LandingPage extends React.Component<LandingPageProps, LandingPageState> {

    constructor(props: LandingPageProps) {
        super(props);
        this.state = {
            airPressure: 0,
            enableButtons: false,
            mode: "aurora",
            showSignUp: true,
            showSignIn: false,
            showControls: false,
            successFailMessage: '',
            voltage: 0,
            queue: [],
        };
        this.signInUser = this.signInUser.bind(this);
        this.showSignInOnClick = this.showSignInOnClick.bind(this);
        this.showSignUpOnClick = this.showSignUpOnClick.bind(this);
        this.signUpUser = this.signUpUser.bind(this);
        this.signOutUser = this.signOutUser.bind(this);
        this.startTimer = this.startTimer.bind(this);
    }

    onVoltageChange = (event: any) => {
        this.setState({ voltage: event.target.value })
        db_ref.update({ voltage: event.target.value })
    }

    onAirPressureChange = (event: any) => {
        this.setState({ airPressure: event.target.value })
        db_ref.update({ air_pressure: event.target.value })
    }

    onModeSelection = (event: any) => {
        let value = event.target.value;
        if (value == 'aurora' || value == 'auroraLobe' || value == 'stellarRingCurrent') {
            this.setState({
                mode: value
            })
            db_ref.update({ mode: value })
        }
    }

    showSignInOnClick() {
        this.setState({showSignUp: false, showSignIn: true})
    }

    showSignUpOnClick() {
        this.setState({ showSignIn: false, showSignUp: true})
    }

    signUpUser(validate: any, email: string, password: string) {
        const { emailState, confirmPasswordState } = validate;
        let isError = false;

        if (emailState && confirmPasswordState){
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('Error Code ' + errorCode + ': ' + errorMessage);
                isError = true;
            });
            if (!isError){
                this.setState({
                    successFailMessage: 'Successfully Signed Up ' + email,
                    showSignUp: false, 
                    showSignIn: true})
            }else{
                this.setState({successFailMessage: 'Error Signing Up User - Try Again Later'});
            }
        }
        else{
            this.setState({successFailMessage: 'Incorrect email/password'});
        }

    }

    signInUser(email: string, password: string) {
        let isError = false;

        if (email !== '' && password !== ''){
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('Error Code ' + errorCode + ': ' + errorMessage);
                isError = true;
            });

            if (!isError){
                localStorage.setItem('User', email);
                localStorage.setItem('isLoggedIn', 'true');
                
                let queue_ref = db.ref("queue/");

                queue_ref.once("value")
                    .then(function(snapshot) {
                        localStorage.setItem('queue', JSON.stringify(snapshot.val()));
                });
                
                let queue = JSON.parse(localStorage.getItem('queue'));
                let size = Object.keys(queue).length;

                if (queue[0] === 'NA'){
                    queue[0] = email;
                    db_ref.update({ queue })
                }else{
                    queue_ref.push(email)
                }

                if (size < 2){
                    this.setState({enableButtons: true});
                    this.startTimer('control', 10);
                }else{
                    this.startTimer('queue', size * 10) 
                } 

                this.setState({
                    successFailMessage: 'Successfully Signed In ' + email,
                    showControls: true, 
                    showSignIn: false, 
                    showSignUp: false
                });
            }else{
                this.setState({successFailMessage: 'Error Signing In - Try Again Later'});
            }

        }
        else{
            this.setState({successFailMessage: 'Input email/password'});
        }
    }

    signOutUser() {
        for(var i=0; i < 10000; i++){
            window.clearInterval(i);
        }
        let isError = false;
        let email = localStorage.getItem('User');
        localStorage.setItem('type', 'none');

        firebase.auth().signOut().then(function() {
            // Sign-out successful.
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Error Code ' + errorCode + ': ' + errorMessage);
            isError = true;
        });

        if (!isError){
            localStorage.setItem('isLoggedIn', 'false');

            document.getElementById("video-label").innerHTML = 'Sign In to Control the Planeterrella';
            this.setState({
                successFailMessage: 'Successfully Signed Out ' + email,
                showControls: false,
                showSignIn: true,
                showSignUp: false,
            });

            
            let queue_ref = db.ref("queue/");
            queue_ref.once("value")
                .then(function(snapshot) {
                    localStorage.setItem('queue', JSON.stringify(snapshot.val()));
            });
            
            let queue = JSON.parse(localStorage.getItem('queue'));
            let size = Object.keys(queue).length;
            let deleteKey = '';

            if (size > 1){
                for(var key in queue){
                    if ( queue[key] == email) {
                        deleteKey = key;
                    }
                }
                delete queue[deleteKey]
            } else{
                queue = ['NA']
            }
            
            db_ref.update({ queue });
            
            localStorage.setItem('User', '');
        }else{
            this.setState({successFailMessage: 'Error Signing Out - Try Again Later'});
        }
    }

    startTimer(type: string, time: number) {
        let email = localStorage.getItem('User');
        const timer = {
            queue: (type == 'queue'),
            control: (type == 'control'),
            done: false,
        }

        let expirationDate = new Date();
        expirationDate.setMinutes( expirationDate.getMinutes() + time );

        let interval = setInterval(function() {
            var now = new Date().getTime();
            var distance = expirationDate.getTime() - now;
          
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            localStorage.setItem('minutes', minutes.toString());
            localStorage.setItem('seconds', seconds.toString());
            localStorage.setItem('type', type);
          
            if (timer.control){
                document.getElementById("video-label").innerHTML = minutes + ' min ' + seconds + ' sec left';
            }else if (timer.queue){
                document.getElementById("video-label").innerHTML = 'Approximately ' + minutes + ' min ' + seconds + ' sec until your turn';
            }
            

            let queue_ref = db.ref("queue/");
            queue_ref.once("value")
                .then(function(snapshot) {
                    localStorage.setItem('queue', JSON.stringify(snapshot.val()));
            });
            
            let queue = JSON.parse(localStorage.getItem('queue'));
          
            if (distance < 0 || queue[0] == email) {
                clearInterval(interval);
                if (timer.queue){
                    timer.queue = false;
                    timer.control = true;
                    timer.done = true;
                } else if (timer.control){
                    timer.queue = false;
                    timer.control = false;
                    timer.done = true;
                    this.signOutUser();
            }
            }
        }, 1000);
        if (timer.done && timer.control){
            let queue_ref = db.ref("queue/");
            queue_ref.once("value")
                .then(function(snapshot) {
                    localStorage.setItem('queue', JSON.stringify(snapshot.val()));
            });
            
            let queue = JSON.parse(localStorage.getItem('queue'));
            if (queue[Object.keys(queue)[0]] == email){
                this.setState({enableButtons: true});
                this.startTimer('control', 10);
            }else{
                document.getElementById("video-label").innerHTML = 'Please Wait ...';
            }
        }else if (timer.done && !timer.control && !timer.queue){
            this.signOutUser();
        }
    }

    render() {

        let { airPressure, voltage, enableButtons } = this.state;
        let isLoggedIn = false;
        let time = 0;
        if (localStorage.getItem('isLoggedIn') == 'true'){
            isLoggedIn = true;
            const minutes = localStorage.getItem('minutes');
            const seconds = localStorage.getItem('seconds');
            time = parseInt(minutes) + (parseInt(seconds) / 60);
        }else{
            localStorage.setItem('type','none');
        }
        let videoLabelText = 'Sign In to Control the Planeterrella';
        switch (localStorage.getItem('type')){
            case ('control'):
                this.startTimer('control', time);
                break;
            case ('queue'):
                this.startTimer('queue', time);
            default:
                break;
        }
        
        return (
            <div className='info-section'>
                <Container className='video-section'>
                    <Row className='video-row'>
                        <Col className='video-col' md={9}>
                            <div className='control-box'>
                                <div className='video'>
                                </div>
                                <div className='queue-info'>
                                    <p id='video-label' className='video-label click-join-text'>{videoLabelText}</p>
                                </div>
                            </div>
                        </Col>
                        <Col className='control-col' md={3}>
                            <div className='control-box'>
                                <h2 className='heading control'>CONTROLS</h2>
                                <h4 className='success-fail-message'>{this.state.successFailMessage}</h4>
                                <SignUp 
                                    isHidden={!isLoggedIn && this.state.showSignUp}
                                    signInLink={this.showSignInOnClick}
                                    signUpUser={this.signUpUser}/>
                                <SignIn 
                                    isHidden={!isLoggedIn && this.state.showSignIn}
                                    signUpLink={this.showSignUpOnClick}
                                    showControls={this.signInUser}/>
                                <div id='controls' className={(this.state.showControls || isLoggedIn) ? 'controls' : 'hide'}>
                                    <h4 className='control-selection-labels'>Select Mode</h4>
                                    <div className='mode-select'>
                                        <Button 
                                            id='aurora-btn'
                                            className='button top'
                                            value='aurora'
                                            onClick={this.onModeSelection}
                                            disabled={!enableButtons}
                                        >Aurora
                                        </Button>
                                        <Button
                                            id='aurora-lobe-btn'
                                            className='button'
                                            value='auroraLobe'
                                            onClick={this.onModeSelection}
                                            disabled={!enableButtons}
                                            >Aurora Lobe
                                        </Button>
                                        <Button
                                            id='stellar-ring-current-btn'
                                            className='button bottom'
                                            value='stellarRingCurrent'
                                            onClick={this.onModeSelection}
                                            disabled={!enableButtons}
                                            >Stellar Ring Current
                                        </Button>
                                    </div>
                                    <h4 className='control-selection-labels'>Voltage</h4>
                                    <div className='slider-container'>
                                        <form className="slider-box">
                                            <input
                                                type="range"
                                                min="0"
                                                max="800"
                                                value={voltage}
                                                className="slider"
                                                onChange={this.onVoltageChange}
                                                disabled={!enableButtons}
                                            >
                                            </input>
                                        </form>
                                        <div className='text-block-3'>{voltage} V</div>
                                    </div>
                                    <h4 className='control-selection-labels'>Air Pressure</h4>
                                    <div className='slider-container'>
                                        <form className="slider-box">
                                            <input
                                                type="range"
                                                min="0"
                                                max="800"
                                                value={airPressure}
                                                className="slider"
                                                onChange={this.onAirPressureChange}
                                                disabled={!enableButtons}
                                            >
                                            </input>
                                        </form>
                                        <div className='text-block-3'>{airPressure} Pa</div>
                                    </div>
                                    <Button
                                        className='control-btn'
                                        onClick={() => this.signOutUser()}
                                    >
                                    Sign Out
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}