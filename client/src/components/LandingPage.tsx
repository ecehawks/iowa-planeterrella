import React from 'react';
import Slider from 'react-rangeslider';

import { Container, Row, Col, Button } from 'reactstrap';

import '../styles/App.css';

type LandingPageState = {
    voltage: number,
    airPressure: number,
}

type LandingPageProps = {};


export default class LandingPage extends React.Component<LandingPageProps, LandingPageState> {

    constructor(props: LandingPageProps) {
        super(props);
        this.state = {
            voltage: 0,
            airPressure: 0,
        };
    }

    onVoltageChange = (value: number) => {
        this.setState({
            voltage: value
        })
    }

    onAirPressureChange = (value: number) => {
        this.setState({
            airPressure: value
        })
    }

    render() {
        let { voltage, airPressure } = this.state

        return (
            <div className='info-section'>
                <Container className='video-section'>
                    <Row className='video-row'>
                        <Col className='video-col' md={9}>
                            <div className='control-box'>
                                <div className='video'>
                                </div>
                                <div className='queue-info'>
                                    <div className='text-block-2'>
                                        <strong className='bold-text-4'>Click Join to Control the Planeterrella</strong>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col class='control-col' md={3}>
                            <div className='control-box'>
                                <h2 className='heading control'>CONTROLS</h2>
                                <Button id='join-btn' className='control-btn'>Join</Button>
                                <div className='controls'>
                                    <h4 className='control-selection-labels'>Select Mode</h4>
                                    <div className='mode-select'>
                                        <Button id='aurora-btn' className='button top'>Aurora</Button>
                                        <Button id='aurora-lobe-btn' className='button'>Aurora Lobe</Button>
                                        <Button id='stellar-ring-current-btn' className='button bottom'>Stellar Ring Current</Button>
                                    </div>
                                    <h4 className='control-selection-labels'>Voltage</h4>
                                    <div className='slider-container'>
                                        <div className='slider-box'>
                                            <Slider
                                                min={0}
                                                max={800}
                                                value={voltage}
                                                tooltip={false}
                                                onChange={this.onVoltageChange}
                                            />
                                        </div>
                                        <div className='text-block-3'>{voltage} V</div>
                                    </div>
                                    <h4 className='control-selection-labels'>Air Pressure</h4>
                                    <div className='slider-container'>
                                        <div className='slider-box'>
                                            <Slider
                                                min={0}
                                                max={100}
                                                value={airPressure}
                                                tooltip={false}
                                                onChange={this.onAirPressureChange}
                                            />
                                        </div>
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