import '../../styles/App.css';
import React, { useState, useContext,useEffect } from 'react';
import { 
  Flex, Section, Text, Link, Heading, Input, Label
} from '../../styles/main/MainStyles';
import * as api from '../../api/api';
import { NotificationContext } from '../../context/NotificationContext';
import capture from '../../images/capture_bg.jpg';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Capture() {
  const { addNotification } = useContext(NotificationContext);
  const [event, setevent] = useState('');
  const [desc, setdesc] = useState('');
  const [recognizedface, setrecognizedface] = useState('');
  const [popuptext, setpopuptext] = useState('');
  const [open, setOpen] = useState(false);
  const [faceslist,setfaceslist] = useState([]);

  useEffect(()=> {
    if(recognizedface!=''){
    setpopuptext(popup_function());
    handleClickOpen();}
  },[recognizedface]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  

  const handleCloseNo = () => {
    setOpen(false);
    setrecognizedface('')
    if (recognizedface!='Face Not Recognized' && recognizedface!='Spoof Detected'){
      captureImage()
    }
  };
  const handleCloseYes = () => {
    setOpen(false);
    setrecognizedface('')  
    if (recognizedface=='Face Not Recognized' || recognizedface=='Spoof Detected'){
      captureImage()
      }
      else{
        faceslist.push(recognizedface)
        console.log(faceslist)
        captureImage()
      }
  };

  const divStyle = {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${capture})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  function popup_function(){
    if (recognizedface=='Face Not Recognized'){
      return 'Face is not recognized , do you want to retry ? '
    }
    else if(recognizedface=='Spoof Detected'){
      return 'Spoof Detected , do you want to retry ? '
    }
    else{
      return 'Are you '+recognizedface+' ?'
    }
  }

  function captureImage() {
    api
      .capture()
      .then(async res => {
        console.log(res.name)
        setrecognizedface(res.name)
      })
      .catch(err => {
        // addNotification('Error')
        console.log(err)
      })
  
  }

  function quitevent() {
    setOpen(false);
    if(recognizedface!='Face Not Recognized' && recognizedface!='Spoof Detected'){
      faceslist.push(recognizedface)
    }
    api
      .addevent(event,desc,faceslist)
      .then(async res => {
        console.log('Successful')
      })
      .catch(err => {
        addNotification('Error')
        console.log(err)
      })
    setevent('');
    setdesc('');
  }
  
  return (
    <div className="create_event" style={divStyle} >
      
    <Section top>
    <Flex fd="column" w="400px" mb="100px">
      <Heading color="#222222"> Create Class</Heading>
      <Label>Class Name</Label>
      <Input
        type="text" 
        placeholder="Class Name"
        value={event}
        onChange={e => setevent(e.target.value)}
      />
      <Label>Description</Label>
      <Input
        type="text" 
        placeholder="Class Description" 
        value={desc}
        onChange={e => setdesc(e.target.value)}  
      />
      <Button mt="10px" onClick={captureImage} primary>Create Class</Button>
    </Flex>
  </Section>

  <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Recognized Face"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {popuptext}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={quitevent}>Save and Quit Event</Button>
          <Button onClick={handleCloseNo}>No</Button>
          <Button onClick={handleCloseYes} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>

  </div>
    
  )
}