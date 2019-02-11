import * as React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';

import { Container, Row, Col, Button } from 'reactstrap';

type LandingPageState = {
    voltage: number,
    airPressure: number,
    mode: string
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
            mode: "aurora",
        };
    }

    onVoltageChange = (event: any) => {
        this.setState({
            voltage: event.target.value
        })
        db_ref.update({ voltage: event.target.value })
    }

    onAirPressureChange = (event: any) => {
        this.setState({
            airPressure: event.target.value
        })
        db_ref.update({ air_pressure: event.target.value })
    }

    onModeSelection = (event: any) => {
        console.log(event.target.value);
        let value = event.target.value;
        if (value == 'aurora' || value == 'auroraLobe' || value == 'stellarRingCurrent') {
            this.setState({
                mode: value
            })
            db_ref.update({ mode: value })
        }
    }

    render() {

        let { airPressure, voltage } = this.state;

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
                                <Button id='join-btn' className='control-btn'>Join</Button>
                                <div className='controls'>
                                    <h4 className='control-selection-labels'>Select Mode</h4>
                                    <div className='mode-select'>
                                        <Button 
                                            id='aurora-btn'
                                            className='button top'
                                            value='aurora'
                                            onClick={this.onModeSelection}
                                        >Aurora
                                        </Button>
                                        <Button
                                            id='aurora-lobe-btn'
                                            className='button'
                                            value='auroraLobe'
                                            onClick={this.onModeSelection}
                                            >Aurora Lobe
                                        </Button>
                                        <Button
                                            id='stellar-ring-current-btn'
                                            className='button bottom'
                                            value='stellarRingCurrent'
                                            onClick={this.onModeSelection}
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