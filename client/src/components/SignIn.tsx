import * as React from 'react';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';

type SignInState = {
  email: string,
  password: string,
  
};

type SignInProps = {
  isHidden: boolean,
  signUpLink: () => void,
  showControls: (email: string, password: string) => void,
};

export default class SignIn extends React.Component<SignInProps, SignInState> {

  constructor(props: SignInProps){
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  };

  handleChangeEmail = async (event: any) => {
    await this.setState({
      email: event.target.value
    });
  }

  handleChangePassword = async (event: any) => {
    await this.setState({
      password: event.target.value
    });
  }
  
  render() {
    const { email, password } = this.state;

    return (
      <div id='sign-up' className={this.props.isHidden ? 'controls' : 'hide'}>
          <Form>
              <FormGroup>
                  <Label className='control-selection-labels' for='signInEmail'>Email</Label>
                  <Input
                    type='email'
                    name='email'
                    id='signInEmail'
                    placeholder='Enter Your Email ...'
                    onChange={ (e) => {
                      this.handleChangeEmail(e);
                  } }
                  />
              </FormGroup>
              <FormGroup>
                  <Label className='control-selection-labels' for='signInPassword'>Password</Label>
                  <Input
                    type='password'
                    name='password'
                    id='signInPassword'
                    placeholder='Enter Your Password ...'
                    onChange={ (e) => {
                      this.handleChangePassword(e);
                  } }
                />
              </FormGroup>
          </Form>
          <Button
            id='join-btn'
            className='control-btn'
            onClick={() => this.props.showControls(email, password)}
          >
          Sign In
          </Button>
          <div className='link' onClick={this.props.signUpLink}>Register</div>
      </div>
    ); 
  }
}
