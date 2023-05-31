import '../../styles/App.css';
import '../../styles/Attendance.css';
import React, { useState, useContext, useEffect } from 'react';
import { 
  Flex, Section, Text, Link, Heading, Button, Input, Label
} from '../../styles/main/MainStyles';
import * as api from '../../api/api';
import { NotificationContext } from '../../context/NotificationContext';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { CSVLink, CSVDownload } from "react-csv";
import { useHistory } from "react-router-dom";
import TextField from "@mui/material/TextField";
import attendance from '../../images/att2.jpg';

const divStyle = {
  width: '100%',
  height: '100%',
  backgroundImage: `url(${attendance})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};
// const divStyle2 = {
//   width: '50%',
//   height: '50%',
//   backgroundColor: 'yellow',
//   // backgroundRepeat: 'no-repeat',
//   // backgroundSize: 'cover',
// };
// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];


var jsonArr = [];
const columns1: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'eventname', headerName: 'Class Name', width: 150 },
  { field: 'eventdesc', headerName: 'Class Description', width: 200 },
  { field: 'created', headerName: 'Class Date', width: 250 },
  { field: 'currenttime', headerName: 'Class Time', width: 250 },
  { field: 'recognized', headerName: 'Attendees', width: 300 },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params: GridValueGetterParams) =>
  //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  // },
];

export default function Attendance() {
  const { addNotification } = useContext(NotificationContext);
  const [result,setresult] = useState([])
  const [search, setsearch] = useState('')
  const history = useHistory();
  
  function downloadCSV(csv, filename) {  
    var csvFile;  
    var downloadLink;  
     
    //define the file type to text/csv  
    csvFile = new Blob([csv], {type: 'text/csv'});  
    downloadLink = document.createElement("a");  
    downloadLink.download = filename;  
    downloadLink.href = window.URL.createObjectURL(csvFile);  
    downloadLink.style.display = "none";  
  
    document.body.appendChild(downloadLink);  
    downloadLink.click();  
}  
  function csvdownloader() {
  
    console.log('consoloinfjvdjs')
    console.log(result)
    
    const listOfDicts = result;

    const dictionaryKeys = Object.keys(listOfDicts[0]);

    const dictValuesAsCsv = listOfDicts.map(dict => (
      dictionaryKeys.map(key => dict[key]).join(',')
    ));

    const csv = [dictionaryKeys.join(','), ...dictValuesAsCsv].join('\n');
    console.log(csv)
    
    downloadCSV(csv,'AttendenceReport.csv')
  }

  function getattendance() {
    api
      .attendance()
      .then(async res => {
        console.log(res)

        console.log('consoling reslength')
        console.log(res.dic.length)
        for (var i = 0; i < res.dic.length; i++) {
          var faceslist = res.dic[i].recognized
          var list=''
          for (var j = 0; j < faceslist.length; j++){
            list=list+faceslist[j]+' '
          }
            jsonArr.push({
              id: i+1,
              eventname: res.dic[i].eventname,
              eventdesc: res.dic[i].eventdesc,
              created: res.dic[i].created,
              currenttime: res.dic[i].currenttime,
              recognized: list,
            });
        }

        setresult(jsonArr)
        console.log('jsonArr',jsonArr)
        console.log('Successful')
      })
      .catch(err => {
        // addNotification('Error')
        console.log(err)
      })
  }

  useEffect(()=> {
    getattendance()
  },[]);
  
function handleKeyDown(event) {
    if(event.keyCode === 13) { 
      console.log('Enter key pressed')
      console.log(result)
      for (let i = 0; i < result.length; i++) {
        if(result[i]['eventname']==search){
          localStorage.setItem('searchvalue',search)
          history.push('/students')
        }
      }
    }
  }
  return (
        <div style={divStyle}>
        <div className="main">
        {/* <h1>React Search</h1> */}
        <Heading color="#222222" style={{ marginTop: 75}}>Attendance Report</Heading>  
          <div className="search">
            <TextField
              id="outlined-basic"
              variant="outlined"
              fullWidth
              label="Search by Class name"
              onKeyDown={handleKeyDown}
              onChange={e => setsearch(e.target.value)} 
            />
          </div>
        
      <div style={{ marginTop: 50, height: 300, width: '60%' }}>
        <DataGrid

          rows={result}
          columns={columns1}
          pageSize={10}
          rowsPerPageOptions={[10]} />
    </div>
    <Button mt="15px" primary onClick={csvdownloader}>Download CSV</Button>
    </div>
  </div>
  )
}
