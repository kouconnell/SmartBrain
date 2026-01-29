import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './mental-health.png'

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className='Tilt br2' options={{ max: 50 }} style={{ width: '150px', height: '150px'}}>
      			<div className='Tilt-inner pa3'><img style={{paddingTop: '5px'}} src={brain} alt='logo'/></div>
    		</Tilt>
		</div>
	);
}

export default Logo;