import * as React from 'react';
import Button from 'reactstrap/lib/Button';

type VerifyState = {};

type VerifyProps = {
  isHidden: boolean,
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
            className='control-btn'
            onClick={() => this.props.verifyEmail()}
          >
          Resend Verification Email
          </Button>
      </div>
    ); 
  }
}
