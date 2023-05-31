import React, { useState, useContext } from 'react';
import { 
  Flex, Section, Text, Link, Heading, Button, Input, Label
} from '../../styles/main/MainStyles';
import { useHistory } from "react-router-dom";
import { NotificationContext } from '../../context/NotificationContext';
import { UserContext } from '../../context/UserContext';
import * as api from '../../api/api';
import loginimg from '../../images/login.jpg';

export default function Register() {
  const { setGlobalUsername } = useContext(UserContext);
  const { addNotification } = useContext(NotificationContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  function register() {
    api
      .register(username, password)
      .then(res => {
        setGlobalUsername(username)
        addNotification(`Created account ${username}`)
        history.push('/home')
      })
      .catch(err => {
        addNotification('Error: Account Already Created')
        console.log(err)
      })
  }
  const divStyle = {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${loginimg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };
  return (
    <div className="register" style={divStyle}>
    <Section top>
      <Flex fd="column" w="400px" mb="100px">
        <Heading color="#222222">Create Account</Heading>
        <Label>Username:</Label>
        <Input
          type="text" 
          placeholder="Username"
          required 
          onChange={e => setUsername(e.target.value)}
        />
        <Label>Password:</Label>
        <Input
          type="password" 
          placeholder="Password"
          pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
          required
          onChange={e => setPassword(e.target.value)}  
        />
        <Text fs="12px" color="grey">
          Already have an account?&nbsp;
          <Link href="/login" color="#0645AD" fs="12px" underline>
            Sign in.
          </Link>
        </Text>
        <Button mt="10px" onClick={register} primary>Register</Button>
      </Flex>
    </Section>
    </div>
  )
}