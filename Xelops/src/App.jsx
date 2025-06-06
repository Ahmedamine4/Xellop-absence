import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className="container">
            <div className="form-box" id="login-form">
                <h2>Welcome back</h2>
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit" name="login">Log in</button>
                <p>Login with the others</p>
            </div>
        </div>
    </>
  )
}

export default App
