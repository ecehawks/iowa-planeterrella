import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';

import { Container, Row, Col, Button } from 'reactstrap';

import SignIn from './SignIn';
import SignUp from './SignUp';

require('firebase/auth')

type LandingPageState = {
    voltage: number,
    voltageControl: number,
    airPressure: string,
    airPressureValue: number,
    enableButtons: boolean,
    showSignUp: boolean,
    showSignIn: boolean,
    showControls: boolean,
    successFailMessage: string,
    mode: string,
    queue: any[],
}

type LandingPageProps = {
    clearTimer: () => void;
    db: any;
};

export default class LandingPage extends React.Component<LandingPageProps, LandingPageState> {
    private db_ref = this.props.db.ref();
    public interval = null as any;

    constructor(props: LandingPageProps) {
        super(props);
        this.state = {
            airPressure: 'Low',
            airPressureValue: 0,
            enableButtons: false,
            mode: 'aurora',
            showSignUp: true,
            showSignIn: false,
            showControls: false,
            successFailMessage: '',
            voltage: 0,
            voltageControl: 0,
            queue: [],
        };
        this.signInUser = this.signInUser.bind(this);
        this.showSignInOnClick = this.showSignInOnClick.bind(this);
        this.showSignUpOnClick = this.showSignUpOnClick.bind(this);
        this.signUpUser = this.signUpUser.bind(this);
        this.signOutUser = this.signOutUser.bind(this);
    }

    componentDidMount() {
        // Sign out user on refresh and tab close
        window.addEventListener('beforeunload', () => 
        {  
            this.signOutUser();
        });
    }

    onVoltageChange = (event: any) => {
        // Set the slider value on movement then update Firebase Voltage_Control
        this.setState({ voltageControl: event.target.value })
        this.db_ref.update({ Voltage_Control: event.target.value })

        // Grab the actual voltage from the Pi and display
        let voltage_ref = this.props.db.ref('voltage/');
        voltage_ref.once('value')
            .then(function(snapshot: any) {
                this.setState({ voltage: snapshot.val() })
        }.bind(this));
    }

    // On slider change, update the display and Firebase
    onAirPressureChange = (event: any) => {
        this.setState({ airPressureValue: event.target.value })
        if (event.target.value == 0) {
            this.setState({ airPressure: 'Low' })
            this.db_ref.update({ air_pressure: 'Low' })
        } else if (event.target.value == 1){
            this.setState({ airPressure: 'Medium' })
            this.db_ref.update({ air_pressure: 'Medium' })
        } else if (event.target.value == 2){
            this.setState({ airPressure: 'High' })
            this.db_ref.update({ air_pressure: 'High' })
        }
    }

    // Change the mode on Firebase based on button press
    onModeSelection = (event: any) => {
        let value = event.target.value;
        if (value == 'Aurora' || value == 'Belt' || value == 'Ring') {
            this.setState({
                mode: value
            })
            this.db_ref.update({ mode: value })
        }
    }

    showSignInOnClick() {
        this.setState({ showSignUp: false, showSignIn: true })
    }

    showSignUpOnClick() {
        this.setState({ showSignIn: false, showSignUp: true })
    }

    signUpUser(validate: any, email: string, password: string) {
        const { emailState, confirmPasswordState } = validate;

        if (emailState && confirmPasswordState){
            // Use Firebase Authentication to create a user
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
                this.setState({
                    successFailMessage: 'Successfully Signed Up ' + email,
                    showSignUp: false,
                    showSignIn: true
                });
            }.bind(this)).catch(function (error: any) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('Error Code ' + errorCode + ': ' + errorMessage);
                this.setState({ successFailMessage: errorMessage });
            }.bind(this));
        }
        else {
            this.setState({ successFailMessage: 'Incorrect email/password' });
        }

    }

    signInUser(email: string, password: string) {
        if (email !== '' && password !== ''){
            // Use Firebase Authentication to sign-in a user
            firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
                localStorage.setItem('User', email);
                localStorage.setItem('isLoggedIn', 'true');
                
                let queue_ref = this.props.db.ref('queue/');

                queue_ref.once('value')
                    .then(function(snapshot: any) {
                        localStorage.setItem('queue', JSON.stringify(snapshot.val()));
                    });

                let queue = JSON.parse(localStorage.getItem('queue'));
                let size = Object.keys(queue).length;

                queue_ref.push(email);
                size++;

                // If the user is the first under NA, then 
                // place them in control mode
                if (size == 2){
                    this.setState({enableButtons: true});
                    this.startTimer('control', 10);
                }else{
                    // Else remove NA and the user from the size and estimate
                    // their wait time to start the timer
                    size = size - 2;
                    this.startTimer('queue', size * 10)
                }

                this.setState({
                    successFailMessage: 'Successfully Signed In ' + email,
                    showControls: true,
                    showSignIn: false,
                    showSignUp: false
                });
            }.bind(this)).catch(function (error: any) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('Error Code ' + errorCode + ': ' + errorMessage);
                this.setState({ successFailMessage: errorMessage });
            }.bind(this));
        }
        else {
            this.setState({ successFailMessage: 'Input email/password' });
        }
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
          
            // Set the label based on the mode the user is in
            if (timer.isControl){
                document.getElementById('video-label').innerHTML = minutes + ' min ' + seconds + ' sec left';
            }else {
                document.getElementById('video-label').innerHTML = 'Approximately ' + minutes + ' min ' + seconds + ' sec until your turn';
            }
            
            // Grab the queue
            let queue_ref = this.props.db.ref('queue/');
            queue_ref.once('value')
                .then(function(snapshot: any) {
                    localStorage.setItem('queue', JSON.stringify(snapshot.val()));
            });
            let queue = JSON.parse(localStorage.getItem('queue'));
          
            // If the estimated time is over or they are next
            if (distance < 0 || (queue[Object.keys(queue)[1]] == email && !timer.isControl)) {
                // Clear the estimation timer
                clearInterval(this.interval);
                this.interval = null;
                if (!timer.isControl) {
                    timer.isControl = true;
                    timer.done = true;
                    
                    // If the user is next, set to control or place them on a wait
                    if (queue[Object.keys(queue)[1]] == email){
                        this.setState({enableButtons: true});
                        this.startTimer('control', 10);
                    }else{
                        document.getElementById('video-label').innerHTML = 'Please Wait ...';
                    }
                } else {
                    // if they finish control mode, then sign out the user
                    timer.isControl = false;
                    timer.done = true;
                    this.setState({enableButtons: false});
                    this.child.current.signOutUser();
                }
            }
        }.bind(this), 1000);
      }
    
      signOutUser() {
        this.props.clearTimer();
    
        let isError = false;
        let email = localStorage.getItem('User');
    
        // Sign out the user from their session using Firebase authentication
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
    
            document.getElementById('video-label').innerHTML = 'Sign In to Control the Planeterrella';
            document.getElementById('success-fail-message').innerHTML = 'Successfully Signed Out ' + email;
    
            this.setState({
                enableButtons: false,
                showControls: false,
                showSignIn: true,
                showSignUp: false,
            });
    
            
            let queue_ref = this.props.db.ref('queue/');
            queue_ref.once('value')
                .then(function(snapshot: any) {
                    localStorage.setItem('queue', JSON.stringify(snapshot.val()));
            });
            
            // Find and delete the user from the queue
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
            }
            
            let db_ref = this.props.db.ref();
            db_ref.update({ queue });
        }else{
          document.getElementById('success-fail-message').innerHTML = 'Error Signing Out - Try Again Later';
        }
      }


    render() {
        let { airPressure, airPressureValue, voltageControl, voltage, enableButtons } = this.state;
        let isLoggedIn = false;
        if (localStorage.getItem('isLoggedIn') == 'true') {
            isLoggedIn = true;
        }
        let videoLabelText = 'Sign In to Control the Planeterrella';

        return (
            <div className='video-section'>
                <Container className='video-section'>
                    <Row className='video-row'>
                        <Col className='control-col' md={9}>
                            <div className='control-box'>
                                <div
                                    id="w-node-ab1b4addd327-3fb3fd5a"
                                    className="video w-video w-embed">
                                    <iframe
                                        className="embedly-embed"
                                        src="https://www.youtube.com/embed/wwNouiC1YGQ?autoplay=1"
                                        scrolling="no"
                                        allow="autoplay; fullscreen"
                                    >
                                    </iframe>
                                </div>
                                <div className='queue-info'>
                                    <p id='video-label' className='video-label'>{videoLabelText}</p>
                                </div>
                                <div className='queue-info'>
                                    <p className='warning'>Do not refresh the page</p>
                                </div>
                            </div>
                        </Col>
                        <Col className='control-col' md={3}>
                            <div className='control-box'>
                                <h2 className='heading control'>CONTROLS</h2>
                                <h4 id='success-fail-message' className='success-fail-message'>{this.state.successFailMessage}</h4>
                                <SignUp 
                                    isHidden={!isLoggedIn && this.state.showSignUp}
                                    signInLink={this.showSignInOnClick}
                                    signUpUser={this.signUpUser} />
                                <SignIn
                                    isHidden={!isLoggedIn && this.state.showSignIn}
                                    signUpLink={this.showSignUpOnClick}
                                    showControls={this.signInUser} />
                                <div id='controls' className={(this.state.showControls || isLoggedIn) ? 'controls' : 'hide'}>
                                    <h4 className='control-selection-labels'>Select Mode</h4>
                                    <div className='mode-select'>
                                        <Button
                                            id='aurora-btn'
                                            className='button top'
                                            value='Aurora'
                                            onClick={this.onModeSelection}
                                            disabled={!enableButtons}
                                        >Aurora
                                        </Button>
                                        <Button
                                            id='aurora-lobe-btn'
                                            className='button'
                                            value='Belt'
                                            onClick={this.onModeSelection}
                                            disabled={!enableButtons}
                                        >Van Allen Belt
                                        </Button>
                                        <Button
                                            id='stellar-ring-current-btn'
                                            className='button bottom'
                                            value='Ring'
                                            onClick={this.onModeSelection}
                                            disabled={!enableButtons}
                                        >Stellar Ring Current
                                        </Button>
                                    </div>
                                    <h4 className='control-selection-labels'>Voltage</h4>
                                    <div className='slider-container'>
                                        <form className='slider-box'>
                                            <input
                                                type='range'
                                                min='0'
                                                max='100'
                                                value={voltageControl}
                                                className='slider'
                                                onChange={this.onVoltageChange}
                                                disabled={!enableButtons}
                                            >
                                            </input>
                                        </form>
                                        <div className='slider-label'>{voltage} V</div>
                                    </div>
                                    <h4 className='control-selection-labels'>Air Pressure</h4>
                                    <div className='slider-container'>
                                        <form className='slider-box'>
                                            <input
                                                type='range'
                                                min='0'
                                                max='2'
                                                value={airPressureValue}
                                                className='slider'
                                                onChange={this.onAirPressureChange}
                                                disabled={!enableButtons}
                                            >
                                            </input>
                                        </form>
                                        <div className='slider-label'>{airPressure}</div>
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