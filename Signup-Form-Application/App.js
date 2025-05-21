

import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Info.css'

function App() {

    const [nam, setNam] = useState("");
    const [phone, setPhone] = useState("");
    const [em, setEm] = useState("");
    const [add, setAdd] = useState("");
    const [birth, setBirth] = useState("");
    const [gen, setGender] = useState("");
    const [Username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [checkPass, setCheckpass] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [users, setUsers] = useState([]); // State to store fetched data

    useEffect(() => {
        setIsFormValid(ValidateForm()); // ✅ Only checking validation, not modifying state
    }, [nam, phone, em, add, birth, gen, Username, password, checkPass]);

    const ValidateForm = () => {
        if (!nam || !phone || !em || !add || !birth || !gen || !Username || !password || !checkPass) {
            return false;
        }
        if (password !== checkPass) {
            return false;
        }
        if (phone.length !== 10) {
            return false;
        }
        if (!em.includes('@')) {
            return false;
        }
        return true; // ✅ Form is valid
    };

    const ResetForm = () => {
        setNam("");
        setPhone("");
        setEm("");
        setAdd("");
        setBirth("");
        setGender("");
        setUsername("");
        setPassword("");
        setCheckpass("");
        setSubmitted(false);
        setError(false);
    };

    const addData = () => {
        axios.post('http://localhost:3330/process_request', {name: nam, mobile: phone, email: em, address: add, BirthDate: birth, gender: gen, username: Username, password: password, submitted: true}).then((response)=>{
        setNam('');
        setPhone('');
        setEm('');
        setAdd('');
        setBirth('');
        setGender('');
        setUsername('');
        setPassword('');
        setCheckpass('');

        // alert("Data Submitted Successfully!");
        console.log(response.data);
        setUsers([response.data, ...users])

        // // Redirect to a new page (optional)
        // window.location.href = "/process_request";
        });
    };

    // Fetch data when component mounts
    useEffect(() => {
        axios.get('http://localhost:3330/api/data').then((response) => setUsers(response.data))
    }, []);

    const deleteData = (id) => {
        axios.delete(`http://localhost:3330/api/data/${id}`).then(() => {
            setUsers(users.filter((user) => user._id !== id));
        })
    };

    return (
        <div className="App">
        <h1>SIGN UP FORM</h1>
        <form>
            <fieldset style={{ margin: '0 auto', width: '50%' }}>
            <legend>Please Fill All Details Compulsory!!! </legend>

            <label>Name: </label>
            <input
                type='text'
                placeholder='Surname FirstName LastName'
                value={nam}
                onChange={(e) => setNam(e.target.value)}
                size={33}
            /><br></br>

            <label>Mobile Number: </label>
            <input
                type='tel'
                placeholder='+91'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            /><br></br>

            <label>Email: </label>
            <input
                type='email'
                placeholder='xyz@gmail.com'
                value={em}
                onChange={(e) => setEm(e.target.value)}
            /><br></br>

            <label>Address: </label>
            <textarea placeholder='Entire Address' rows={5} cols={55} value={add} onChange={(e) => setAdd(e.target.value)} required></textarea><br></br>

            <label>Date of Birth: </label>
            <input
                type='date'
                placeholder='01/01/2025'
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
            /><br></br>

            <label>Gender: </label>&nbsp;&nbsp;
            <input
                type='radio'
                name='gen'
                value='Male'
                onChange={(e) => setGender(e.target.value)}
            />
            <label>Male</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input
                type='radio'
                name='gen'
                value='Female'
                onChange={(e) => setGender(e.target.value)}
            />
            <label>Female</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input
                type='radio'
                name='gen'
                value='Other'
                onChange={(e) => setGender(e.target.value)}
            />
            <label>Other</label><br></br>

            <label>Username: </label>
            <input
                type='text'
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
            /><br></br>

            <label>Password: </label>
            <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br></br>

            <label>Confirm Password: </label>
            <input
                type='password'
                value={checkPass}
                onChange={(e) => setCheckpass(e.target.value)}
            /><br></br>

            <div>
            <input
                type='button'
                value='SUBMIT'
                onClick={() => {
                        if (ValidateForm()) {
                            addData(); // ✅ Only calls API if form is valid
                        } else {
                            setError(true); // ✅ Show error message if invalid
                        }
                    }}
                disabled={!isFormValid} 
            />

            <input
                type='button'
                value='RESET'
                onClick={ResetForm}
            />
            </div>
            </fieldset>
        </form>

        <br></br><br></br>
        <h2>Stored Users</h2>
            <table border="1" align='center'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Gender</th>
                        <th>Username</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.mobile}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>{user.gender}</td>
                            <td>{user.username}</td>
                            <td>
                                <button onClick={() => deleteData(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
