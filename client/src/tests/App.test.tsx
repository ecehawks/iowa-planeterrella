import {
  RouteComponentProps,
} from 'react-router-dom';

import App from '../App';

let appprops: RouteComponentProps;

describe('App.tsx', () => {
  let instance: App;

  beforeEach(() => {
      instance = new App(appprops);
  });

  it('App should be an instance of itself', async () => {
      expect(instance).toBeInstanceOf(App);
  });
});
