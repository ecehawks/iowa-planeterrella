import React from 'react';

import { Col, Row } from 'reactstrap';

export default class Footer extends React.PureComponent {
    render() {
        return (
            <div className="footer-section">
                <div className="footer">
                    <div className="univ-logo"></div>
                    <h4 className="heading-3">Acknowledgements</h4>
                    <div className="footer-info">
                        <Row class="footer-row">
                            <Col md={2}>
                                <div className="image-10" />
                            </Col>
                            <Col md={4}>
                                <p className="paragraph-3">Construction of the Iowa Planeterrella was supported by the US National Science Foundation under grant No. PHY-1453736. Any opinions, findings, and conclusions or recommendations expressed in this material are those of the authors and do not necessarily reflect the view of the National Science Foundation.</p>
                            </Col>
                            <Col className='learn-more-col' md={6}>
                                <h5 className="heading-4">Learn More</h5>
                                <a href="https://www2.physics.uiowa.edu/~sbaalrud/index.html" className="footer-link">Fundamental Plasma Theory Group</a>
                                <a href="https://www2.physics.uiowa.edu/~sbaalrud/iplaneterrella.html" className="footer-link">Iowa Planeterrella</a>
                                <a href="https://www.facebook.com/planeterrella/" className="footer-link">Like Us On Facebook</a>
                                <a href="http://planeterrella.osug.fr/spip.php?article232" className="footer-link">All Planeterrellas</a>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}



