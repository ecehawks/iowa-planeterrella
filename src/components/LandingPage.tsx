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
    startTimer: (type: string, time: number) => void;
    clearTimer: () => void;
    db: any;
};

export default class LandingPage extends React.Component<LandingPageProps, LandingPageState> {
    private db_ref = this.props.db.ref();

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
        window.addEventListener('beforeunload', () => 
        {  
            this.signOutUser();
        });

        if (localStorage.getItem('isLoggedIn') == 'true'){
            const minutes = localStorage.getItem('minutes');
            const seconds = localStorage.getItem('seconds');
            const time = parseInt(minutes) + (parseInt(seconds) / 60);
            this.setState({ enableButtons: true })
            this.props.startTimer(localStorage.getItem('type'), time);
        }else{
            localStorage.setItem('type','none');
        }
    }

    onVoltageChange = (event: any) => {
        this.setState({ voltageControl: event.target.value })
        this.db_ref.update({ Voltage_Control: event.target.value })

        let voltage_ref = this.props.db.ref('voltage/');
        voltage_ref.once('value')
            .then(function(snapshot: any) {
                this.setState({ voltage: snapshot.val() })
        }.bind(this));
    }

    onAirPressureChange = (event: any) => {
        this.setState({ airPressureValue: event.target.value })
        if (event.target.value == 0){
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
        this.setState({showSignUp: false, showSignIn: true})
    }

    showSignUpOnClick() {
        this.setState({ showSignIn: false, showSignUp: true})
    }

    signUpUser(validate: any, email: string, password: string) {
        const { emailState, confirmPasswordState } = validate;

        if (emailState && confirmPasswordState){
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
                this.setState({
                    successFailMessage: 'Successfully Signed Up ' + email,
                    showSignUp: false, 
                    showSignIn: true});
            }.bind(this)).catch(function(error: any) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('Error Code ' + errorCode + ': ' + errorMessage);
                this.setState({successFailMessage: errorMessage});
            }.bind(this));
        }
        else{
            this.setState({successFailMessage: 'Incorrect email/password'});
        }

    }

    signInUser(email: string, password: string) {
        if (email !== '' && password !== ''){
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

                if (size == 2){
                    this.setState({enableButtons: true});
                     this.props.startTimer('control', 10);
                }else{
                    size = size - 2;
                     this.props.startTimer('queue', size * 10) 
                } 

                this.setState({
                    successFailMessage: 'Successfully Signed In ' + email,
                    showControls: true, 
                    showSignIn: false, 
                    showSignUp: false
                });
            }.bind(this)).catch(function(error: any) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('Error Code ' + errorCode + ': ' + errorMessage);
                this.setState({successFailMessage: errorMessage});
            }.bind(this));
        }
        else{
            this.setState({successFailMessage: 'Input email/password'});
        }
    }

    signOutUser() {
        this.props.clearTimer();

        let isError = false;
        let email = localStorage.getItem('User');
        localStorage.setItem('type', 'none');
        this.setState({enableButtons: false});

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
            this.setState({
                successFailMessage: 'Successfully Signed Out ' + email,
                showControls: false,
                showSignIn: true,
                showSignUp: false,
            });

            
            let queue_ref = this.props.db.ref('queue/');
            queue_ref.once('value')
                .then(function(snapshot: any) {
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
            }
            
            this.db_ref.update({ queue });
            
            localStorage.setItem('User', '');
        }else{
            this.setState({successFailMessage: 'Error Signing Out - Try Again Later'});
        }
    }


    render() {
        let { airPressure, airPressureValue, voltageControl, voltage, enableButtons } = this.state;
        let isLoggedIn = false;
        if (localStorage.getItem('isLoggedIn') == 'true'){
            isLoggedIn = true;
        }
        let videoLabelText = 'Sign In to Control the Planeterrella';
        
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
                                <div className='queue-info'>
                                    <p className='warning'>Do not refresh the page</p>
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
                                        <div className='text-block-3'>{voltage} V</div>
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
                                        <div className='text-block-3'>{airPressure}</div>
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