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
    showSignUp: boolean,
    showSignIn: boolean,
    showControls: boolean,
    successFailMessage: string,
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
            voltage: 0,
            airPressure: 0,
            showSignUp: true,
            showSignIn: false,
            showControls: false,
            successFailMessage: ''
        };
        this.showControlsOnClick = this.showControlsOnClick.bind(this);
        this.showSignInOnClick = this.showSignInOnClick.bind(this);
        this.showSignUpOnClick = this.showSignUpOnClick.bind(this);
        this.signUpUser = this.signUpUser.bind(this);
    }

    onVoltageChange = (event: any) => {
        this.setState({
            voltage: event.target.value
        })
    }

    onAirPressureChange = (event: any) => {
        this.setState({
            airPressure: event.target.value
        })
    }

    showSignInOnClick() {
        this.setState({showSignUp: false, showSignIn: true})
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
                this.setState({showSignUp: false, showSignIn: true})
            }else{
                this.setState({successFailMessage: 'Error with Firebase - Forbidden'});
            }
        }
        else{
            this.setState({successFailMessage: 'Incorrect email/password'});
        }

    }

    showSignUpOnClick() {
        this.setState({ showSignIn: false, showSignUp: true})
    }

    showControlsOnClick(email: string, password: string) {
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
                let queue = ['1', '2', '3'];

                queue_ref.on("value", function (snapshot) {
                    console.log("Key: " + snapshot.key + ", Value: " + snapshot.val());
                });
                
                queue.push(email);
                db_ref.update({ queue });
                this.setState({showControls: true, showSignIn: false, showSignUp: false});
            }else{
                this.setState({successFailMessage: 'Error with Firebase - Forbidden'});
            }

        }
        else{
            this.setState({successFailMessage: 'Input email/password'});
        }
    }

    render() {

        let { airPressure, voltage } = this.state;
        let isLoggedIn = false;
        if (localStorage.getItem('isLoggedIn') == 'true'){
            isLoggedIn = true;
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
                                    <div className='video-label click-join-text'>
                                        Click Join to Control the Planeterrella
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className='control-col' md={3}>
                            <div className='control-box'>
                                <h2 className='heading control'>CONTROLS</h2>
                                <h4 className='control-selection-labels'>{this.state.successFailMessage}</h4>
                                <SignUp 
                                    isHidden={!(!isLoggedIn || this.state.showSignUp)}
                                    signInLink={this.showSignInOnClick}
                                    signUpUser={this.signUpUser}/>
                                <SignIn 
                                    isHidden={this.state.showSignIn}
                                    signUpLink={this.showSignUpOnClick}
                                    showControls={this.showControlsOnClick}/>
                                <div id='controls' className={(this.state.showControls || isLoggedIn) ? 'controls' : 'no-controls'}>
                                    <h4 className='control-selection-labels'>Select Mode</h4>
                                    <div className='mode-select'>
                                        <Button id='aurora-btn' className='button top'>Aurora</Button>
                                        <Button id='aurora-lobe-btn' className='button'>Aurora Lobe</Button>
                                        <Button id='stellar-ring-current-btn' className='button bottom'>Stellar Ring Current</Button>
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
                                            >
                                            </input>
                                        </form>
                                        <div className='text-block-3'>{airPressure} Pa</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}