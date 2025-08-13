// import React from "react";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Cookies from 'js-cookie';
import Biogasapi from '../apis/Biogasapi';
// components
import Iconify from "../../components/iconify/Iconify";




const AddTodo = () => {
  const navigate = useNavigate()
    const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [enddate, setenddate] = useState("");


  const onSubmitForm = async (e) => {
    e.preventDefault();
    // Check if description is empty
    if (!description.trim()) {
      alert("Please enter a task before adding.");
      return;
    }
    if (!userName.trim()) {
      alert("Please enter the user name before adding.");
      return;
    }
    if (!enddate.trim()) {
      alert("Please enter the due date before adding.");
      return;
    }
    try {
      const body = { user_name: userName, description,end_date:enddate };

      const response = await Biogasapi.post('/todo',body )

      console.log(response);
      alert("Task succesfully Added")
      navigate("/dashboard/app");
    } catch (err) {
      console.error(err.message);
    }
  };
    return (
        <div className="add-device-container">
           
            <Stack spacing={3}>
            <h1 >
                 Add your todo task here.
             </h1>
                <TextField name="email" label="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} required/>
                <TextField name="email" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required/>

                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1px', marginRight: '15px' }}>
        <div style={{ marginRight: '10px' }}>Due Date:</div>
        <TextField
              style={{ marginRight: '15px' }}
              label=""
              type="date"
              placeholder='Due Date'
              value={enddate}
              onChange={(e) => setenddate(e.target.value)}
              required
              inputProps={{ min: new Date().toISOString().split('T')[0] }} // Set min attribute to today's date
          />
          </div>           
          
           </Stack>


      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={onSubmitForm} style={{ marginTop: '16px' }}>
        ADD TASK
      </LoadingButton>
        </div>
    )
}

export default AddTodo;