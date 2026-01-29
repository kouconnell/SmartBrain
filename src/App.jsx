import { useState } from 'react'
import Navigation from './components/Navigation/Navigation.jsx';
import Logo from './components/Logo/Logo.jsx';
import Rank from './components/Rank/Rank.jsx';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.jsx';

import './App.css';

import ParticlesBg from 'particles-bg'

function App() {
  return (
    <>
      <ParticlesBg className='particles' type="circle" bg={true} />

      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      {/*<FaceRecognition />*/}
    </>
  )
}

export default App
