import React from 'react';
import './App.css';
import { Row, Col } from 'reactstrap';

export default class Footer extends React.Component {
    render () {
        return (
            <div class="footer-section">
                <div class="footer">
                    <div class="univ-logo"></div>
                    <h4 class="heading-3">Acknowledgements</h4>
                    <div class="footer-info">
                        <Row class="footer-row">
                            <Col md={2}>
                                <div class="image-10"/>
                            </Col>
                            <Col md={4}>
                                <p class="paragraph-3">Construction of the Iowa Planeterrella was supported by the US National Science Foundation under grant No. PHY-1453736. Any opinions, findings, and conclusions or recommendations expressed in this material are those of the authors and do not necessarily reflect the view of the National Science Foundation.</p>
                            </Col>
                            <Col className='learn-more-col' md={6}>
                                <h5 class="heading-4">Learn More</h5>
                                <a href="https://www2.physics.uiowa.edu/~sbaalrud/index.html" class="footer-link">Fundamental Plasma Theory Group</a>
                                <a href="https://www2.physics.uiowa.edu/~sbaalrud/iplaneterrella.html" class="footer-link">Iowa Planeterrella</a>
                                <a href="https://www.facebook.com/planeterrella/" class="footer-link">Like Us On Facebook</a>
                                <a href="http://planeterrella.osug.fr/spip.php?article232" class="footer-link">All Planeterrellas</a>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}
    
    

