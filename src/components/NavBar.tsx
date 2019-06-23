import * as React from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink } from 'reactstrap';

type NavBarState = {
    isOpen: boolean,
};

type NavBarProps = {};

export default class NavBar extends React.Component<NavBarProps, NavBarState> {
    constructor(props: NavBarProps) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
          isOpen: !this.state.isOpen
        });
    }

    render () {
        return (
            <div>
                <Navbar color='dark' dark expand='md'>
                    <NavbarBrand href='/' className=''>
                        <div className='brand'/>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className='ml-auto' navbar>
                            <NavItem>
                                <NavLink href='/#/'>Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href='/#/aurora'>Aurora</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href='/#/van-allen-radiation-belts'>Van Allen Radiation Belts</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href='/#/stellar-ring-current'>Stellar Ring Current</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href='/#/history'>History</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}
    
    

