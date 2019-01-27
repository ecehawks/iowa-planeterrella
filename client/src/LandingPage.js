import React from 'react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import './App.css';
import { Container, Row, Col, Button } from 'reactstrap';


export default class LandingPage extends React.Component {
    state = {
        voltage: 0,
        airPressure: 0,
    };

    onVoltageChange = (value) => {
        this.setState({
            voltage: value
        })
    }

    onAirPressureChange = (value) => {
        this.setState({
            airPressure: value
        })
    }

    render () {
        let { voltage, airPressure } = this.state

        return (
            <div className='info-section'>
                <Container className='video-section'>
                    <Row className='video-row'>
                        <Col className='video-col' md={9}>
                            <div className='control-box'>
                                <div class='video'>
                                </div>
                                <div class='queue-info'>
                                    <div class='text-block-2'>
                                        <strong class='bold-text-4'>Click Join to Control the Planeterrella</strong>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col class='control-col' md={3}>
                            <div class='control-box'>
                                <h2 class='heading control'>CONTROLS</h2>
                                <Button id='join-btn' className='control-btn'>Join</Button>
                                <div class='controls'>
                                    <h4 class='control-selection-labels'>Select Mode</h4>
                                    <div class='mode-select'>
                                        <Button id='aurora-btn' className='button top'>Aurora</Button>
                                        <Button id='aurora-lobe-btn' className='button'>Aurora Lobe</Button>
                                        <Button id='stellar-ring-current-btn' className='button bottom'>Stellar Ring Current</Button>
                                    </div>
                                    <h4 class='control-selection-labels'>Voltage</h4>
                                    <div class='slider-container'>
                                        <div class='slider-box'>
                                            <Slider
                                                min={0}
                                                max={800}
                                                value={voltage}
                                                tooltip={false}
                                                onChange={this.onVoltageChange}
                                                className='slider'
                                            />  
                                        </div>
                                        <div class='text-block-3'>{voltage} V</div>
                                    </div>
                                    <h4 class='control-selection-labels'>Air Pressure</h4>
                                    <div class='slider-container'>
                                    <div class='slider-box'>
                                            <Slider
                                                min={0}
                                                max={100}
                                                value={airPressure}
                                                tooltip={false}
                                                onChange={this.onAirPressureChange}
                                                className='slider'
                                            />  
                                        </div>
                                        <div class='text-block-3'>{airPressure} Pa</div>
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