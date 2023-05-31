import React from 'react'
// import { Section, Heading } from '../../styles/main/MainStyles';
import bgimage from '../../images/bgimage.gif';
import '../../styles/App.css';

export default function Home() {

  const divStyle = {
  width: '100%',
  height: '100%',
  backgroundImage: `url(${bgimage})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '70%',
  backgroundPosition: 'center',
  backgroundColor: "black",
};

  return (
    <div className="homebase" style={divStyle} >
    </div>
  )
}
