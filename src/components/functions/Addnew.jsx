import React, { useState, useContext } from 'react';
import { 
  Flex, Section, Text, Link, Heading, Button, Input, Label
} from '../../styles/main/MainStyles';
import { UserContext } from '../../context/UserContext';
import { NotificationContext } from '../../context/NotificationContext';
import { useHistory } from "react-router-dom";
import * as api from '../../api/api';
import capture from '../../images/capture_bg.jpg';

export default function Addnew() {
    const { addNotification } = useContext(NotificationContext);
    const [name, setname] = useState('');
    const [age, setage] = useState('');
    const [rollno, setrollno] = useState('');
    const [phonenumber, setphonenumber] = useState('');
  
    function addnew() {
      api
        .addnew(name, age, rollno, phonenumber)
        .then(async res => {
          console.log('Successful')
          addNotification('Saved Successfully')
        })
        .catch(err => {
          addNotification('Error saving new student')
          console.log(err)
        })
        setname('')
        setage('')
        setrollno('')
        setphonenumber('')
    }
  
    const divStyle = {
      width: '100%',
      height: '100%',
      backgroundImage: `url(${capture})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    };
  
    return (
      <div className="addnew" style={divStyle} >
        <Section top>
        <Flex fd="column" w="400px" mb="100px">
          <Heading color="#222222">Register New Student</Heading>
          <Label>Name:</Label>
          <Input
            type="text" 
            placeholder="Full name"
            required
            value={name}
            onChange={e => setname(e.target.value)}
          />
          <Label>Age:</Label>
          <Input
            type="integer" 
            placeholder="Age"
            required
            value={age}
            onChange={e => setage(e.target.value)}  
          />
          <Label>Rollno:</Label>
          <Input
            type="text" 
            placeholder="Roll no"
            required 
            value={rollno}
            onChange={e => setrollno(e.target.value)}  
          />
          <Label>Phone Number:</Label>
          <Input
            type="text" 
            placeholder="Phone number"
            required 
            value={phonenumber}
            onChange={e => setphonenumber(e.target.value)}  
          />
          <Button mt="20px" onClick={addnew} primary>Register</Button>
        </Flex>
      </Section>
      </div>
    )
  }