import React, { useState } from 'react'
import style from '../styles/Login.module.css'
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const user = process.env.REACT_APP_ADMINUSER
    const pass = process.env.REACT_APP_ADMINPASS

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();


        if (username !== user) {
            console.log('username not match');
        } else if (password !== pass) {
            console.log('password not match');
        }
        else {
            navigation('/Dashboard')
            // Alert()
            setUsername('')
            setPassword('')
            window.localStorage.setItem('user', username)
        }
    }


    return (
        <>
            <div className={style.login_container}>
                <div className={style.background}></div>
                <form className={style.form} onSubmit={handleSubmit}>
                    <h2>LOGIN</h2>
                    <input
                        className={style.input}
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className={style.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className={style.button} type="submit">Login</button>
                </form>
            </div>

        </>
    )
}

export default Login