import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

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

        // Selon le rôle, rediriger vers la page appropriée
        if (data.role === 'manager') {
            window.location.href = '/manager-dashboard';
        } else if (data.role === 'collaborator') {
            window.location.href = '/collaborator-dashboard';
        } else {
            console.log('Unknown role');
        }
    } else {
        console.error('Login failed:', data.message);
    }
  };


  return (
    <GoogleOAuthProvider clientId="950133593228-euq4fsl44mfcieli2uqdig6n2cnhc5t4.apps.googleusercontent.com">
    <div style={{ marginTop: '50px' }}>
        <h2>Sign in with Google</h2>
        <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    </div>
  </GoogleOAuthProvider>
  )
}

export default App
