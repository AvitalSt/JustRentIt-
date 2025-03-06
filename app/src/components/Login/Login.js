import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from "../../services/AuthService";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginAdmin(username, password);
            localStorage.setItem('token', response.token);
            navigate('/add-dress');
        } catch (error) {
            console.error("Login Error:", error);
            if (error.response) {
                setMessage(error.response.data.message || 'שגיאה בהתחברות. נסה שוב.');
            } else if (error.request) {
                setMessage('שגיאת רשת. נסה שוב מאוחר יותר.');
            } else {
                setMessage('שגיאה בהתחברות. נסה שוב.');
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;