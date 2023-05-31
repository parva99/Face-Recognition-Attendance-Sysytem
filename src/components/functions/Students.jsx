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

export default function Students() {
    const { addNotification } = useContext(NotificationContext);
    const [result,setresult] = useState([]);
    const history = useHistory();

    var studentdetails = [];

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'age', headerName: 'Age', width: 150 },
        { field: 'rollno', headerName: 'Roll number', width: 250 },
        { field: 'phonenumber', headerName: 'Phone Number', width: 300 },
      ];
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
        
        const listOfDicts = result;
    
        const dictionaryKeys = Object.keys(listOfDicts[0]);
    
        const dictValuesAsCsv = listOfDicts.map(dict => (
          dictionaryKeys.map(key => dict[key]).join(',')
        ));
    
        const csv = [dictionaryKeys.join(','), ...dictValuesAsCsv].join('\n');
        console.log(csv)
        
        downloadCSV(csv,'StudentDetails.csv')
      }

      function getstudentdetails() {

        var st=localStorage.getItem('searchvalue')
        api
          .getstudentdetails(st)
          .then(async res => {
            console.log(res)
            for (var i = 0; i < res.dic.length; i++) {
              studentdetails.push({
                  id: i+1,
                  name: res.dic[i].name,
                  age: res.dic[i].age,
                  rollno: res.dic[i].rollno,
                  phonenumber: res.dic[i].phonenumber,
                });
            }
            console.log(studentdetails)
            setresult(studentdetails)
          })
          .catch(err => {
            // addNotification('Error')
            console.log(err)
          })
      }

      useEffect(()=> {
        getstudentdetails()
      },[]);

      function back(){
          history.push('/attendance')
      }

      return (
        <div className='main' style={divStyle}>
        <Heading color="#222222" style={{ marginTop: 75}}>Student Details</Heading>         
        <Button mt="15px" style={{ backgroundColor:'black', marginLeft:-1350, marginTop:-100 }} primary onClick={(e) => {
      e.preventDefault();
      window.location.href='http://localhost:3000/attendance';
      }}  >Back</Button>

        <div style={{ marginTop: 100, height: 300, width: '50%' }  }>
  
        <DataGrid
  
          rows={result}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]} />
      <Button mt="15px" style={{ marginLeft:320 }} primary onClick={csvdownloader}>Download CSV</Button>
      </div>
      </div>
    )}