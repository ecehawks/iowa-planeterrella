import * as React from 'react';
import { shallow } from 'enzyme';
import App from '../src/components/App';

test('renders welcome message', () => {
  const wrapper = shallow(<App/>);
  const welcome = <h2>Welcome to React</h2>;
  // expect(wrapper.contains(welcome)).toBe(true);
  expect(wrapper.contains(welcome)).toEqual(true);
});
