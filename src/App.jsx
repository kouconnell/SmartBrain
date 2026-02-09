import { useState, Component } from 'react'
import Navigation from './components/Navigation/Navigation.jsx';
import Logo from './components/Logo/Logo.jsx';
import Rank from './components/Rank/Rank.jsx';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.jsx';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.jsx';
import Signin from './components/SignIn/Signin.jsx';
import Register from './components/Register/Register.jsx';

import './App.css';

import ParticlesBg from 'particles-bg'

const initialState = {
  input: '',
  imageUrl: null,
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  // Review lifecycle hooks
  // componentDidMount() {
  //   fetch('http://localhost:3000/')
  //     .then(response => response.json())
  //     .then(console.log)
  // }

  loadUser = (data) => {
    this.setState({ user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }});
  }

  calculateFaceLocation = (data) => {
    console.log('Data received:', data);

    if (!data || !data.outputs || !data.outputs[0]) {
      console.error('Invalid response: no outputs', data);
      return null;
    }

    if (!data.outputs[0].data || !data.outputs[0].data.regions || !data.outputs[0].data.regions[0]) {
      console.error('No face detected in image', data);
      return null;
    }

    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    };
  }

  displayFaceBox = (box) => {
    if (box) {
      this.setState({box: box});
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('http://smartbrainapi-ihpz.onrender.com/imageurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            input: this.state.input,
        }),
      })
      .then(response => response.json())
      .then(response => {
        console.log('Clarifai response:', response);

        if (response) {
          fetch('http://smartbrainapi-ihpz.onrender.com/image', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
          .catch(console.log)     // good practice, improves error handling 

          const faceBox = this.calculateFaceLocation(response);
          if (faceBox) {
            this.displayFaceBox(faceBox);
          } else {
            alert('No face detected in the image. Please try another image.');
          }
        }
      })
      .catch(err => console.log('Error:', err));
  }

  // onButtonSubmit = () => {
  //   this.setState({ imageUrl: this.state.input });

  //   fetch('http://localhost:3000/clarifai', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       imageUrl: this.state.input
  //     })
  //   })
  //     .then(res => res.json())
  //     .then(response => {
  //       this.displayFaceBox(this.calculateFaceLocation(response));
  //     })
  //     .catch(err => console.log(err));
  // };


  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <>
        <ParticlesBg className='particles' type="circle" bg={true} />

        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div> 
              <Logo />
              <Rank name={ this.state.user.name } entries={ this.state.user.entries }/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
            this.state.route === 'signin' 
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
          
        }

      </>
    )
  }
}

export default App
