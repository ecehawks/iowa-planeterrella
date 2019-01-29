import React from 'react';

import NavBar from './NavBar';
import LandingPage from './LandingPage';
import Footer from './Footer';
import InfoPage from './InfoPage';

import { Route } from "react-router-dom";

type AppState = {
  response: string,
  post: string,
  responseToPost: string,
};

type AppProps = {};

export default class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps){
    super(props);
    this.state = {
      response: '',
      post: '',
      responseToPost: '',
    };
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };
  
  render() {

    return (
      <div className="App">
        <NavBar/>
        <div className="planeterrella-banner">
          <div className="planeterrella-img"></div>
        </div>

        <Route exact={true} path="/" component={LandingPage} />
        <Route
          path='/aurora'
          render={(props) => <InfoPage {...props} infoProps={this.aurora.info}/>}
        />
        <Route
          path='/van-allen-radiation-belts'
          render={(props) => <InfoPage {...props} infoProps={this.varb.info}/>}
        />
        <Route
          path='/stellar-ring-current'
          render={(props) => <InfoPage {...props} infoProps={this.stellar.info}/>}
        />
        <Route
          path='/history'
          render={(props) => <InfoPage {...props} infoProps={this.history.info}/>}
        />

        
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p>
        <Footer/>
      </div>
    );
  }

  private aurora = {
    info: {
      title: 'Aurora',
      imageInfo: '(top) The aurora Borealis in a photograph taken from the international space station. Image credit: NASA. (bottom) Photograph of the aurora demonstration in the Iowa Planeterrella.',
      text: '\n\nAurora are created when the solar wind (a stream of charged particles coming from the Sun) becomes trapped by the Earth\'s magnetic field and can be deflected into the Earth\'s upper atmosphere toward the magnetic poles. The Earth is constantly in the flow of the solar wind, but when it’s stronger than usual, due to a solar storm or a solar flare, then the wind can be more powerful and cause the aurora to extend to lower latitudes.The most powerful auroral event in modern times took place on August 28 - September 2, 1859 and was called the Carrington Event. If a similar event occurred today, it would cause widespread damage to modern technologies including satellites, power systems, and telecommunications. This threat has generated an increased interest in space weather forecasting.Aurora are also present on other planets with magnetic fields and atmospheres. For example, they have been observed on Jupiter and Saturn.',
    },
  }

  private varb = {
    info: {
      title: 'Van Allen Radiation Belts',
      imageInfo: '(top) Photo of the Van Allen radiation belts taken in the ultraviolet spectrum by the IMAGE satellite. Courtesy of NASA. (bottom) The Van Allen radiation belt demonstration using the Iowa Planeterrella.',
      text: '\n\nThe Van Allen radiation belts are layers of energetic charged particles held in place by the Earth’s magnetic field. These particles are thought to come from the solar wind and cosmic rays (very high-energy particles that come from outside the solar system). In 1958, the US launched Explorer 1; it’s first man-made satellite. This spacecraft carried the Iowa Cosmic Ray instrument, which was designed by University of Iowa Physics and Astronomy Professor James Van Allen. This instrument was the first to detect the radiation belts, which are now named in his honor.',
    },
  }

  private stellar = {
    info: {
      title: 'Stellar Ring Current',
      imageInfo: '(left) Supernova Remnant 1987a (an exploded star), which displays the stellar ring current phenomenon. Image courtesy of NASA. (right) A demonstration of stellar ring currents using the Iowa Planeterrella.',
      text: '\n\nA stellar ring current takes place when a star sends electrons all around itself and the magnetic field turns the electrons towards the equator, perpendicular to the magnetic axis of the star. While these do not take place at our Sun, this interesting phenomenon does occur near other classes of stars.',
    },
  }

  private history = {
    info: {
      title: 'History',
      imageInfo: 'Kristian Birkeland operating the first terrella experiment. Image in the public domain, from wikipedia.',
      text: '\n\nA century ago, Norwegian scientist Kristian Birkeland (1867-1917) hypothesized that the aurora on Earth are caused by plasma streaming out from the Sun that gets trapped in the Earth’s magnetic field, causing currents in the polar regions of the upper atmosphere. To test this hypothesis, Birkeland led the “Norwegian Polar Expedition” from 1899 to 1900, which provided the first evidence (using ground based magnetic field measurements) of the current patterns in the polar region. Today, these are knows as the Birkeland currents. The existence of Birkeland currents was debated scientifically until a direct measurement was made in 1963 from the Navy satellite 1963-38C. ' +
      '\n\nUpon returning from his expedition, Birkeland designed the “Terrella” experiment to study the interaction of plasma and magnetic fields in and effort to better understand the physics associated with the Earth-Sun interaction. Birkeland also made several other major contributions to science and technology. He invented the coil gun, and was the first to develop an industrial-scale method for nitrogen fixation from air (the Birkeland-Eyde process). Nitrogen fixation is the essential process needed to produce ammonia for farm fertilizer. Birkeland was nominated for a Nobel prize seven times. Learn more about Kristian Birkeland here.',
    },
  }
}
