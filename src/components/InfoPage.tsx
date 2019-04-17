import * as React from 'react';

import { Container, Row, Col } from 'reactstrap';

// image imports
import auroraOne from '../assets/auroroa.jpg';
import auroraTwo from '../assets/auroroa (1).jpg';
import history from '../assets/birkeland.jpg';
import ringCurrentOne from '../assets/ring_current.jpg';
import ringCurrentTwo from '../assets/ring_current (1).jpg';
import varbOne from '../assets/radiation_belt.jpg';
import varbTwo from '../assets/radiation_belt (1).jpg';

type InfoPageState = {}

type InfoPageProps = {
    infoProps: {
        title: string,
        imageInfo: string,
        text: string,
    },
};


export default class InfoPage extends React.Component<InfoPageProps, InfoPageState> {

    constructor(props: InfoPageProps) {
        super(props);
    }

    public render() {
        let { infoProps } = this.props;
        const title = infoProps.title;
        const imageInfo = infoProps.imageInfo;
        const info = infoProps.text;
        let imageOne = null;
        let imageTwo = null;

        switch(title){
            case ('Aurora'):
                imageOne = auroraOne;
                imageTwo = auroraTwo;
                break;
            case ('Van Allen Radiation Belts'):
                imageOne = varbOne;
                imageTwo = varbTwo;
                break;
            case ('Stellar Ring Current'):
                imageOne = ringCurrentOne;
                imageTwo = ringCurrentTwo;
                break;
            default:
                imageOne = history;
                break;
        }

        return (
            <div className='info-section'>
                <Container>
                    <Row className='info-rows'>
                        <Col md={7}>
                            <h2 className='heading'>{ title }</h2>
                            <p className='paragraph'><strong>{ imageInfo }</strong></p>
                            <p className='paragraph'>{info}</p>
                        </Col>
                        <Col className='info-img-col' md={5}>
                            <div className='info-img-wrapper'>
                                <img id='image-1' src={imageOne} className='info-img-top'/>
                                <img id='image-2' src={imageTwo} className='info-img-bottom'/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}