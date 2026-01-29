import { useState, Component } from 'react'
import Navigation from './components/Navigation/Navigation.jsx';
import Logo from './components/Logo/Logo.jsx';
import Rank from './components/Rank/Rank.jsx';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.jsx';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.jsx';

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
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnRequestOptions(this.state.input))
        .then(response => response.json())
        .then(result => console.log(result));
  }

  render() {
    return (
      <>
        <ParticlesBg className='particles' type="circle" bg={true} />

        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageUrl={this.state.imageUrl}/>
      </>
    )
  }
}

export default App
