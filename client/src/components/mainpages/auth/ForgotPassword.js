import { useState } from "react"
import axios from 'axios'
import './forgot.css'

const initialState = {
    email: '',
    err: '',
    success: ''
}

function ForgotPassword() {
    const [data, setData] = useState(initialState)
    const {email, err, success} = data

    const handleChange = (e) => {

        const {name, value} = e.target
        setData({...data, [name]: value, err, success})

    }

    const forgotPassword = async () => {

        if(!email) 

            return setData({...data, err: "invalid email", success})


            try {

                const res = await axios.post('/api/forgot_password', {email})
                return setData({...data, err: '', success: res.data.msg})

                
            } catch (err) {

                err.response.msg && setData({...data, err: err.response.msg, success})
                
            }


        


    }


    return(<>
    <div className="fg_pass">

        <h2>Forgot your password?</h2>

        <div className="row">
            {err}
            {success}

            <label htmlFor="email"> { err ?  "" : "enter your email "}</label>
            <input type="email" name="email" id="email" value={email} onChange={handleChange} />
            <button onClick={forgotPassword}>Verify your email</button>


        </div>


    </div>
    
    </>)
}

export default ForgotPassword