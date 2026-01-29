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

const returnRequestOptions = (imageUrl) => {
    const PAT = '5d0f8e48b03d454f99c31d6afe029247';
    const USER_ID = 'kouconnell';       
    const APP_ID = 'SmartBrain';
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
  }

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: null,
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  calculateFaceLocation = (data) => {
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
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnRequestOptions(this.state.input))
        .then(response => response.json())
        .then(response => {
          this.displayFaceBox(this.caluclateFaceLocation(response));
        })
        .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
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
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
            this.state.route === 'signin' 
            ? <Signin onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange} />
            )
          
        }

      </>
    )
  }
}

export default App
