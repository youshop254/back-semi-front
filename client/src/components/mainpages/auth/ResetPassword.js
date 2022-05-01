import axios  from 'axios'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import './forgot.css'

const initialState = {
    password: '',
    err: '',
    success: ''
}

function ResetPassword() {
    const[data, setData] = useState(initialState)
    const{token} = useParams()

    // console.log(token)


    const{password, err, success} = data


    const handleChange = (e) => {

        const {name, value} = e.target
        setData({...data, [name]: value, err, success})

    }

    const resetPassword = async () => {
if(password > 6)
return setData({...data, err: "password did not match", success: ""})

try {

    const res = await axios.post('/api/reset_password', {password}, {
        headers: {Authorization:`Bearer ${token}`}
    })

    return setData({...data, err: "", success: res.data.msg})
    
} catch (err) {

    err.response.data.msg && setData({...data, err: err.response.data.msg, success: ""})
    
}

    }


    

    return(
<div className="fg_pass">

<h2>reset your password?</h2>

<div className="row">
    {err}
    {success}

    <label htmlFor="password"> { err ?  "" : "write your new password "}</label>
    <input type="password" name="password" id="password" value={password} onChange={handleChange} />
    <button onClick={resetPassword}>reset password</button>


</div>


</div>



    )
}

export default ResetPassword