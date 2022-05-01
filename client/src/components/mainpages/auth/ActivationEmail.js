import { useEffect } from "react"
import axios from "axios"
import { useParams } from 'react-router-dom'
function ActivationEmail() {

    const{activation_token} = useParams()

    console.log(activation_token)
     


useEffect(() => {
if(activation_token) {
    const activationEmail = async () => {
        const res = await  axios.post('/api/activate_email', {activation_token}) 
        alert(res.data.msg)
    
    
    }
     activationEmail()
}

}, [activation_token])

    return(<div className="activate_page">
        
    
    </div>)
}

export default ActivationEmail