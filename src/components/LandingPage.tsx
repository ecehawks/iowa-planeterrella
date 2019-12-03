import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

import { Row, Col, Button } from 'reactstrap';

import SignIn from './SignIn';
import SignUp from './SignUp';
import Verify from './Verify';

type LandingPageState = {
    voltage: number,
    voltageControl: number,
    current: number,
    currentControl: number,
    airPressure: string,
    airPressureValue: number,
    hvOnOff: string,
    hvValue: number,
    enableButtons: boolean,
    enableControls: boolean,
    showSignUp: boolean,
    showSignIn: boolean,
    showControls: boolean,
    showVerify: boolean,
    successFailMessage: string,
    mode: string,
    queue2: any[],
}

type LandingPageProps = {
    db: any;
};

export default class LandingPage extends React.Component<LandingPageProps, LandingPageState> {
    private db_ref = this.props.db.ref();
    private db = this.props.db;
    public interval = null as any;

    constructor(props: LandingPageProps) {
        super(props);
        this.state = {
            airPressure: 'Low',
            airPressureValue: 0,
            current: 0,
            currentControl: 0,
            enableButtons: false,
            enableControls: false,
            hvOnOff: 'Off',
            hvValue: 0,
            mode: 'aurora',
            showSignUp: true,
            showSignIn: false,
            showControls: false,
            showVerify: false,
            successFailMessage: '',
            voltage: 0,
            voltageControl: 0,
            queue2: [],
        };
        this.signInUser = this.signInUser.bind(this);
        this.showSignInOnClick = this.showSignInOnClick.bind(this);
        this.showSignUpOnClick = this.showSignUpOnClick.bind(this);
        this.showVerifyOnClick = this.showVerifyOnClick.bind(this);
        this.resendVerifyOnClick = this.resendVerifyOnClick.bind(this);
        this.signUpUser = this.signUpUser.bind(this);
        this.signOutUser = this.signOutUser.bind(this);
    }

    componentDidMount() {
        // Sign out user on refresh and tab close
        this.readVoltage();
        this.readCurrent();

        window.addEventListener('beforeunload', () => {
            this.signOutUser();
        });
    }

    componentWillUnmount() {
        this.clearTimer();
    }

    clearTimer() {
        clearInterval(this.interval);
    }

    readVoltage() {
        this.db.ref('voltage').on('value', (snapshot: { val: () => number; key: any; }) => {
            if (typeof snapshot.val() === 'number') {
                this.setState({
                    voltage: snapshot.val(),
                });
            }
        });
    }

    readCurrent() {
        this.db.ref('current').on('value', (snapshot: { val: () => number; key: any; }) => {
            if (typeof snapshot.val() === 'number') {
                this.setState({
                    current: snapshot.val(),
                });
            }
        });
    }

    onVoltageChange = (event: any) => {
        // Set the slider value on movement then update Firebase Voltage_Control2
        this.setState({ voltageControl: event.target.value })
        this.db_ref.update({ Voltage_Control2: event.target.value })
    }

    onCurrentChange = (event: any) => {
        // Set the slider value on movement then update Firebase Voltage_Control2
        this.setState({ currentControl: event.target.value })
        this.db_ref.update({ Current_Control2: event.target.value })
    }

    // On slider change, update the display and Firebase
    onHVChange = (event: any) => {
        this.setState({ hvValue: event.target.value })
        this.db_ref.update({ inhibit2: event.target.value })
        if (event.target.value == 0) {
            this.setState({ hvOnOff: 'Off', enableControls: false })
        } else if (event.target.value == 1) {
            this.setState({ hvOnOff: 'On', enableControls: true })
        }
    }

    // On slider change, update the display and Firebase
    onAirPressureChange = (event: any) => {
        this.setState({ airPressureValue: event.target.value })
        if (event.target.value == 0) {
            this.setState({ airPressure: 'Low' })
            this.db_ref.update({ air_pressure: 'Low' })
        } else if (event.target.value == 1) {
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
            if (value == 'Aurora') {
                document.getElementById('aurora-btn').className = 'selected-btn top btn btn-secondary';
                document.getElementById('belt-btn').className = 'button btn btn-secondary';
                document.getElementById('ring-btn').className = 'button bottom btn btn-secondary';
            } else if (value == 'Belt') {
                document.getElementById('aurora-btn').className = 'button top btn btn-secondary';
                document.getElementById('belt-btn').className = 'selected-btn btn btn-secondary';
                document.getElementById('ring-btn').className = 'button bottom btn btn-secondary';
            } else if (value == 'Ring') {
                document.getElementById('aurora-btn').className = 'button top btn btn-secondary';
                document.getElementById('belt-btn').className = 'button btn btn-secondary';
                document.getElementById('ring-btn').className = 'selected-btn bottom btn btn-secondary';
            }
        }
    }

    resetControls() {
        this.db_ref.update({ Voltage_Control2: 0, Current_Control2: 0, inhibit2: 0, air_pressure: 'Low' })
    }

    showSignInOnClick() {
        this.setState({ showSignUp: false, showVerify: false, showSignIn: true })
    }

    showSignUpOnClick() {
        this.setState({ showSignIn: false, showVerify: false, showSignUp: true })
    }

    showVerifyOnClick() {
        this.setState({ showSignIn: false, showVerify: true, showSignUp: false })
    }

    resendVerifyOnClick() {
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function () {
            this.signInHelper(user.email);
        }.bind(this)).catch(function () {
            this.setState({ successFailMessage: 'Error sending verification email.' });
        }.bind(this));
    }

    signUpUser(validate: any, email: string, password: string) {
        const { emailState, confirmPasswordState } = validate;
        if (localStorage.getItem('isLoggedIn') == 'true') {
            this.setState({ successFailMessage: 'Already Signed In. Enjoy learning from the other tabs.' });
        } else if (emailState && confirmPasswordState) {
            // Use Firebase Authentication to create a user
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
                var user = firebase.auth().currentUser;
                if (user.emailVerified) {
                    localStorage.setItem('User', email);
                    localStorage.setItem('isLoggedIn', 'true');

                    this.setState({
                        successFailMessage: 'Successfully Signed Up',
                        showSignUp: false,
                        showSignIn: true
                    });
                } else {
                    user.sendEmailVerification().then(function () {
                        // Email sent.
                    }).catch(function (error) {
                        console.log('Error sending verification email. Error: ' + error)
                    });
                    this.setState({
                        successFailMessage: 'Check your email to verfiy account. Refresh when finished.',
                        showSignUp: false,
                        showVerify: true
                    });
                }

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

    signInHelper(email: string) {
        var user = firebase.auth().currentUser;
        if (user.emailVerified) {
            localStorage.setItem('User', email);
            localStorage.setItem('isLoggedIn', 'true');

            let queue2_ref = this.props.db.ref('queue2/');

            queue2_ref.once('value')
                .then(function (snapshot: any) {
                    localStorage.setItem('queue2', JSON.stringify(snapshot.val()));
                });

            let queue2 = JSON.parse(localStorage.getItem('queue2'));
            let size = Object.keys(queue2).length;

            queue2_ref.push(email);
            size++;

            // If the user is the first under NA, then 
            // place them in control mode
            if (size == 2) {
                this.setState({ enableButtons: true });
                this.startTimer('control', 10);
            } else {
                // Else remove NA and the user from the size and estimate
                // their wait time to start the timer
                size = size - 2;
                this.startTimer('queue', size * 10)
            }

            this.setState({
                successFailMessage: 'Successfully Signed In',
                showControls: true,
                showSignIn: false,
                showSignUp: false
            });
        } else {
            this.showVerifyOnClick();
            this.resendVerifyOnClick();
        }
    }

    signInUser(email: string, password: string) {
        if (localStorage.getItem('isLoggedIn') == 'true') {
            this.setState({ successFailMessage: 'Already Signed In. Enjoy learning from the other tabs.' });
        } else if ((email !== '' && password !== '')) {
            // Use Firebase Authentication to sign-in a user
            firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
                this.signInHelper(email);

            }.bind(this)).catch(function (error: any) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('Error Code ' + errorCode + ': ' + errorMessage);
                this.setState({ successFailMessage: errorMessage });
            }.bind(this));
        } else {
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
        expirationDate.setMinutes(expirationDate.getMinutes() + duration);

        this.interval = setInterval(function () {
            var now = new Date().getTime();
            var distance = expirationDate.getTime() - now;

            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Set the label based on the mode the user is in
            if (timer.isControl) {
                document.getElementById('video-label').innerHTML = minutes + ' min ' + seconds + ' sec left';
            } else {
                document.getElementById('video-label').innerHTML = 'Approximately ' + minutes + ' min ' + seconds + ' sec until your turn';
            }

            // Grab the queue2
            let queue2_ref = this.props.db.ref('queue2/');
            queue2_ref.once('value')
                .then(function (snapshot: any) {
                    localStorage.setItem('queue2', JSON.stringify(snapshot.val()));
                });
            let queue2 = JSON.parse(localStorage.getItem('queue2'));

            // If the estimated time is over or they are next
            if (distance < 0 || (queue2[Object.keys(queue2)[1]] == email && !timer.isControl)) {
                // Clear the estimation timer
                clearInterval(this.interval);
                this.interval = null;
                if (!timer.isControl) {
                    timer.isControl = true;
                    timer.done = true;

                    // If the user is next, set to control or place them on a wait
                    if (queue2[Object.keys(queue2)[1]] == email) {
                        this.setState({ enableButtons: true });
                        this.startTimer('control', 10);
                    } else {
                        document.getElementById('video-label').innerHTML = 'Please Wait ...';
                    }
                } else {
                    // if they finish control mode, then sign out the user
                    timer.isControl = false;
                    timer.done = true;
                    this.setState({ enableButtons: false });
                    this.signOutUser();
                }
            }
        }.bind(this), 1000);
    }

    signOutUser() {
        this.clearTimer();
        this.resetControls();
        let isError = false;
        let email = localStorage.getItem('User');

        // Sign out the user from their session using Firebase authentication
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Error Code ' + errorCode + ': ' + errorMessage);
            isError = true;
        });

        if (!isError) {
            localStorage.setItem('isLoggedIn', 'false');

            document.getElementById('video-label').innerHTML = 'Sign In to Control the Planeterrella';
            document.getElementById('success-fail-message').innerHTML = 'Successfully Signed Out';

            this.setState({
                enableButtons: false,
                showControls: false,
                showSignIn: true,
                showSignUp: false,
            });


            let queue2_ref = this.props.db.ref('queue2/');
            queue2_ref.once('value')
                .then(function (snapshot: any) {
                    localStorage.setItem('queue2', JSON.stringify(snapshot.val()));
                });

            // Find and delete the user from the queue2
            let queue2 = JSON.parse(localStorage.getItem('queue2'));
            let size = Object.keys(queue2).length;
            let deleteKey = '';

            if (size > 1) {
                for (var key in queue2) {
                    if (queue2[key] == email) {
                        deleteKey = key;
                    }
                }
                delete queue2[deleteKey]
            }

            let db_ref = this.props.db.ref();
            db_ref.update({ queue2 });
        } else {
            document.getElementById('success-fail-message').innerHTML = 'Error Signing Out - Try Again Later';
        }
    }


    render() {
        let {
            airPressure, airPressureValue,
            current, currentControl,
            hvOnOff, hvValue,
            voltageControl, voltage,
            enableButtons, enableControls } = this.state;
        let isLoggedIn = false;
        if (localStorage.getItem('isLoggedIn') == 'true') {
            isLoggedIn = true;
        }
        let videoLabelText = 'Sign In to Control the Planeterrella';

        return (
            <div className='video-section'>
                <Row className='video-row'>
                    <Col className='control-col' md={9}>
                        <div className='video control-box'>
                            <div className='video-iframe'>
															<iframe 
																className='iframe'
																src="https://www.youtube.com/embed/9-Mtt-26h1A"
																allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
															>
															</iframe>
                            </div>
                            <Row className='label-row'>
                                <Col className='queue-info'>
                                    <div className='video-label-row'>
                                        <p id='video-label' className='video-label'>{videoLabelText}</p>
                                        <p className='warning'>Do not refresh the page</p>
                                    </div>
                                </Col>
                                <Col className='queue-info' xs='5'>
                                    <p className='latency-message'>Video latancy and quality can be adjusted using the gear icon. Please allow up to 10 seconds for changes to appear.</p>
                                </Col>
                            </Row>
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
                            <Verify
                                isHidden={!isLoggedIn && this.state.showVerify}
                                verifyEmail={this.resendVerifyOnClick} />
                            <SignIn
                                isHidden={!isLoggedIn && this.state.showSignIn}
                                signUpLink={this.showSignUpOnClick}
                                showControls={this.signInUser} />
                            <div id='controls' className={(this.state.showControls || isLoggedIn) ? 'controls' : 'hide'}>
                                <h4 className='control-selection-labels'>High Voltage Power</h4>
                                <div className='slider-container'>
                                    <form className='slider-box power'>
                                        <input
                                            type='range'
                                            min='0'
                                            max='1'
                                            value={hvValue}
                                            className='slider'
                                            onChange={this.onHVChange}
                                            disabled={!enableButtons}
                                        >
                                        </input>
                                    </form>
                                    <div className='slider-label'>{hvOnOff}</div>
                                </div>
                                <h4 className='control-selection-labels'>Select Mode</h4>
                                <div className='mode-select'>
                                    <Button
                                        id='aurora-btn'
                                        className='button top'
                                        value='Aurora'
                                        onClick={this.onModeSelection}
                                        disabled={!enableButtons || !enableControls}
                                    >Aurora
                                    </Button>
                                    <Button
                                        id='belt-btn'
                                        className='button'
                                        value='Belt'
                                        onClick={this.onModeSelection}
                                        disabled={!enableButtons || !enableControls}
                                    >Van Allen Belt
                                    </Button>
                                    <Button
                                        id='ring-btn'
                                        className='button bottom'
                                        value='Ring'
                                        onClick={this.onModeSelection}
                                        disabled={!enableButtons || !enableControls}
                                    >Stellar Ring Current
                                    </Button>
                                </div>
                                <h4 className='control-selection-labels'>Voltage</h4>
                                <div className='slider-container'>
                                    <form className='slider-box'>
                                        <input
                                            type='range'
                                            min='0'
                                            max='70'
                                            value={voltageControl}
                                            className={enableControls ? 'slider' : 'disabled-slider'}
                                            onChange={this.onVoltageChange}
                                            disabled={!enableButtons || !enableControls}
                                        >
                                        </input>
                                    </form>
                                    <div className='slider-label'>{voltage} V</div>
                                </div>
                                <h4 className='control-selection-labels'>Air Pressure</h4>
                                <div className='slider-container'>
                                    <form className='slider-box power'>
                                        <input
                                            type='range'
                                            min='0'
                                            max='1'
                                            value={airPressureValue}
                                            className={enableControls ? 'slider' : 'disabled-slider'}
                                            onChange={this.onAirPressureChange}
                                            disabled={!enableButtons || !enableControls}
                                        >
                                        </input>
                                    </form>
                                    <div className='slider-label'>{airPressure}</div>
                                </div>
                                <h4 className='control-selection-labels'>Current</h4>
                                <div className='slider-container'>
                                    <form className='slider-box'>
                                        <input
                                            type='range'
                                            min='0'
                                            max='15'
                                            value={currentControl}
                                            className={enableControls ? 'slider' : 'disabled-slider'}
                                            onChange={this.onCurrentChange}
                                            disabled={!enableButtons || !enableControls}
                                        >
                                        </input>
                                    </form>
                                    <div className='slider-label'>{current} mA</div>
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
            </div>
        )
    }
}