import React from 'react';
import { useState, useContext } from 'react';
import upload from '../../images/upload.jpg';
import attend from '../../images/attendance.png';
import user from '../../images/user.jpg';
import bgimage from '../../images/home2.jpeg';
import model from '../../images/model.jpg';
import '../../styles/App.css';
import { Link } from 'react-router-dom';
import * as api from '../../api/api';
import { NotificationContext } from '../../context/NotificationContext';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import {Grid} from '@material-ui/core';

import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 200,
  },
});

const divStyle = {
  width: '100%',
  height: '100%',
  backgroundImage: `url(${bgimage})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  // backgroundSize: '110%',
  // backgroundPosition: 'center',
};
const cardcontentStyle = {
  // width: '100%',
  height: 20,
  backgroundColor:'black',
  color : 'white',
  // backgroundImage: `url(${bgimage})`,
  // backgroundRepeat: 'no-repeat',
  // backgroundSize: '110%',
  // backgroundPosition: 'center',

};
const imgStyle = {
  borderRadius: 120 / 2,
};

export default function Home2() {
  const { addNotification } = useContext(NotificationContext);

  function trainmodel() {
    api
      .trainmodel()
      .then(async res => {
        console.log(res.name)
        addNotification('Model training')
      })
      .catch(err => {
        addNotification('Error')
        console.log(err)
      })
  }

  const classes = useStyles();


  return (
    <div class="home" style={divStyle}>
    <div style={{ marginLeft:300 }}>
    <Grid container>
      
      <Grid item xs={6}>
        <Link to = "/capture">

               <Card className={classes.root} style={{ marginTop: 25, marginBottom:50 }}>
               <CardActionArea>
                 <CardMedia
                  className={classes.media}
                  image={upload}
                  title="Attendance marking"
                />
                <CardContent style={cardcontentStyle}>
                  <Typography gutterBottom variant="h6" component="h3">
                    Attendance Marking
                  </Typography>
                
                </CardContent>
              </CardActionArea>
       
            </Card>
          </Link>
      </Grid>
      <Grid item xs={6}>
               <Link to = "/attendance">

      <Card className={classes.root} style={{ marginTop: 25, marginBottom:50 }}>
               <CardActionArea>
                 <CardMedia
                  className={classes.media}
                  image={attend}
                  title="Attendance Report"
                />
                <CardContent style={cardcontentStyle}>
                  <Typography gutterBottom variant="h6" component="h3">
                    Attendance Report
                  </Typography>
                
                </CardContent>
              </CardActionArea>
       
            </Card>
</Link>
      </Grid>


      <Grid item xs={6}>
      <Link to = "/add_new">
      <Card className={classes.root}>
        
               <CardActionArea>
                 <CardMedia
                  className={classes.media}
                  image={user}
                  title="New Registration"
                />
                <CardContent style={cardcontentStyle}>
                  <Typography gutterBottom variant="h6" component="h3">
                    New Registration
                  </Typography>
                
                </CardContent>
              </CardActionArea>
       
            </Card>
            </Link>
      </Grid>
      <Grid item xs={6}>
      <Card className={classes.root} onClick={trainmodel}>
               <CardActionArea>
                 <CardMedia
                  className={classes.media}
                  image={model}
                  title="train model"
                />
                <CardContent style={cardcontentStyle}>
                  <Typography gutterBottom variant="h6" component="h3">
                    Train Model
                  </Typography>
                
                </CardContent>
              </CardActionArea>
       
            </Card>
      </Grid>
      </Grid>
    </div>
    </div>
  )
}