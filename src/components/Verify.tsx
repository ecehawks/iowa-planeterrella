import * as React from 'react';
import Button from 'reactstrap/lib/Button';

type VerifyState = {};

type VerifyProps = {
  isHidden: boolean,
  checkVerification: () => void,
  verifyEmail: () => void,
};

export default class Verify extends React.Component<VerifyProps, VerifyState> {

  constructor(props: VerifyProps){
    super(props);
    this.state = {};
  };
  
  render() {

    return (
      <div id='sign-up' className={this.props.isHidden ? 'controls' : 'hide'}>
          <Button
            id='join-btn'
            className='control-btn'
            onClick={() => this.props.checkVerification()}
          >
          Sign In
          </Button>
          <Button
            className='control-btn'
            onClick={() => this.props.verifyEmail()}
          >
          Send Verification Again
          </Button>
      </div>
    ); 
  }
}
