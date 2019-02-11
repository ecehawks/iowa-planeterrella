import * as React from 'react';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';
import NavLink from 'reactstrap/lib/NavLink';

type SignInState = {};

type SignInProps = {
  isHidden: boolean,
  signUpLink: () => void,
  showControls: () => void,
};

export default class SignIn extends React.Component<SignInProps, SignInState> {

  constructor(props: SignInProps){
    super(props);
    this.state = {};
  };
  
  render() {
    return (
      <div id='sign-up' className={this.props.isHidden ? 'controls' : 'no-controls'}>
          <Form>
              <FormGroup>
                  <Label for="exampleEmail">Email</Label>
                  <Input type="email" name="email" id="exampleEmail" placeholder="Enter Your Email ..." />
              </FormGroup>
              <FormGroup>
                  <Label for="exampleEmail">Password</Label>
                  <Input type="password" name="password" id='password' placeholder="Enter Your Password ..." />
              </FormGroup>
          </Form>
          <Button id='join-btn' className='control-btn' onClick={this.props.showControls}>Sign In</Button>
          <NavLink onClick={this.props.signUpLink}>Register</NavLink>
      </div>
    ); 
  }
}
