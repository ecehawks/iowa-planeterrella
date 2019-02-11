import * as React from 'react';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Label from 'reactstrap/lib/Label';
import Input from 'reactstrap/lib/Input';
import Button from 'reactstrap/lib/Button';
import FormFeedback from 'reactstrap/lib/FormFeedback';

type SignUpState = {
    email: string,
    password: string,
    confirmPassword: string,
    validate: {
        emailState: string,
        passwordState: string,
        confirmPasswordState: string
    },
};

type SignUpProps = {
    isHidden: boolean,
    signInLink: () => void,
};

export default class SignUp extends React.Component<SignUpProps, SignUpState> {

  constructor(props: SignUpProps){
    super(props);
    this.state = {
        email: '',
        password: '',
        confirmPassword: '',
        validate: {
            emailState: '',
            passwordState: '',
            confirmPasswordState: ''
        },
    };
  };

  validateEmail(event: any) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state
    if (emailRex.test(event.target.value)) {
        validate.emailState = 'success'
    } else {
        validate.emailState = 'fail'
    }
    this.setState({ validate })
  }   

  validatePassword() {
    const { validate } = this.state;

    if (this.state.confirmPassword !== this.state.password){
        validate.confirmPasswordState = 'fail';
        this.setState({validate});
    }else{
        validate.confirmPasswordState = 'success';
        this.setState({validate});
    }
  }

  validateConfirmationPassword() {
    const { validate } = this.state;

    if (this.state.confirmPassword !== this.state.password){
        validate.confirmPasswordState = 'fail';
        this.setState({validate});
    }else{
        validate.confirmPasswordState = 'success';
        this.setState({validate});
    }
  }

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

  handleChangeConfirm = async (event: any) => {
    await this.setState({
      confirmPassword: event.target.value
    });
  }
  
  render() {
    return (
        <div id='sign-up' className={this.props.isHidden ? 'controls' : 'no-controls'}>
            <Form>
                <FormGroup>
                    <Label for="exampleEmail">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        id="exampleEmail"
                        placeholder="Enter Your Email ..."
                        valid={ this.state.validate.emailState === 'success' }
                        invalid={ this.state.validate.emailState === 'fail' }
                        onChange={ (e) => {
                                    this.validateEmail(e)
                                    this.handleChangeEmail(e)
                                } }
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="exampleEmail">Password</Label>
                    <Input
                    type="password"
                    name="password"
                    id='password'
                    placeholder="Enter Your Password ..."
                    valid={ this.state.validate.passwordState === 'success' }
                    invalid={ this.state.validate.passwordState === 'fail' }
                    onChange={ (e) => {
                                this.validatePassword()
                                this.handleChangePassword(e)
                            } }
                />
                </FormGroup>                    
                <FormGroup>
                    <Label for="exampleEmail">Confirm Password</Label>
                    <Input 
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        placeholder="Re-enter Your Password ..."
                        value={this.state.confirmPassword}
                        valid={ this.state.validate.confirmPasswordState === 'success' }
                        invalid={ this.state.validate.confirmPasswordState === 'fail' }
                        onChange={ (e) => {
                                    this.validateConfirmationPassword()
                                    this.handleChangeConfirm(e)
                                } }
                    />
                    <FormFeedback valid>Valid</FormFeedback>
                    <FormFeedback>Passwords do not match.</FormFeedback>
                </FormGroup>
            </Form>
            <Button id='join-btn' className='control-btn'>Sign Up</Button>
            <div onClick={this.props.signInLink}>Already have an account? Sign In.</div>
        </div>
    );
  }
}
