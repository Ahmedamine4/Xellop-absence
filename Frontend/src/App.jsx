import { useState } from 'react'
import './App.css'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import myImage from './assets/xelopshomeimage.png';
import Xelops from "./assets/xelops.png"

function App() {
  const handleLoginSuccess = async (credentialResponse) => {
    console.log('Token reçu de Google:', credentialResponse);

    const token = credentialResponse.credential;

    // Envoyer le token au backend pour vérification
    const response = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });

    const data = await response.json();


    if (response.ok) {
        console.log('Login backend success:', data);
            localStorage.setItem('first_name', data.first_name);
            localStorage.setItem('last_name', data.last_name);
            localStorage.setItem('role', data.role);
            localStorage.setItem('manager_id', data.manager_id);
            localStorage.setItem('Jour_restant', data.annual_leave_balance);
            localStorage.setItem('employee_id', data.employee_id);

        // Selon le rôle, rediriger vers la page appropriée
        if (data.role === 'manager') {
            window.location.href = '/Page-Employé';
        } else if (data.role === 'Employé') {
            window.location.href = '/Page-Employé';
        } else {
            console.log('Unknown role');
        }
    } else {
        console.error('Login failed:', data.message);
    }
  };
  
  



  return (
    <div className='homepage'>
        <div className='mainleft'>
            <img src={Xelops} alt="Xelops" className="xelops-logo" />
            <div className='welcomeback'>
            <h1>Welcome Back</h1>
            <h2>Sign in with Google</h2>
           </div>
    <GoogleOAuthProvider clientId="950133593228-euq4fsl44mfcieli2uqdig6n2cnhc5t4.apps.googleusercontent.com">
    <div className='googlelogin'>
        <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
                console.log('Login Failed');
            }}
            size="large" 
        />
    </div>
  </GoogleOAuthProvider>

        </div>
        <div className='rightpage'>
            <img src={myImage} alt="My Image" className="my-image" />
        </div>
      </div>
  
  )
}

export default App
