import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './login.css'


function Login() {

const[user, setUser] = useState({
    email: '',
    password: ''
})

const onChangeInput = e =>{
    const {name, value} = e.target;
    setUser({...user, [name]:value})
}

const loginSubmit = async e =>{
    e.preventDefault()
    try {
        const res = await axios.post('/api/login', {...user})
        if(res.data.msg) {
            
            alert(res.data.msg)

        } else{
            localStorage.setItem('firstLogin', true)
            window.location.href = "/";
            
        }

        // localStorage.setItem('firstLogin', true)
        
        // window.location.href = "/";
    } catch (err) {
        alert(err.data.data.msg)
    }
}






    return(<>
    <div className='login-page'>
        

    <form onSubmit={loginSubmit}>
                <h2>Login</h2>
                <input type="email" name="email" required
                placeholder="Email" value={user.email} onChange={onChangeInput} />

                <input type="password" name="password" required autoComplete="on"
                placeholder="Password" value={user.password} onChange={onChangeInput} />

                <div className="row">
                    <button type="submit">Login</button>
                    <Link to="/register">Register</Link>
                    <Link to="/forgot">Forgot Password?</Link>
                </div>
            </form>


    </div>
    
    
    </>)
}

export default Login