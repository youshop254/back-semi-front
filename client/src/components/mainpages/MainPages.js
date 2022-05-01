import { Routes, Route } from "react-router-dom"
import Products from "./products/Products"
import Login from "./auth/Login"
import Register from "./auth/Register"
import Cart from "./cart/Cart"
import NotFound from "./utils/NotFound/NotFound"
import DetailProduct from "./detail/DetailProduct"
import ActivationEmail from "./auth/ActivationEmail"
import ForgotPassword from "./auth/ForgotPassword"
import ResetPassword from "./auth/ResetPassword"

function MainPages() {
    return(<Routes>
    <Route path="/"  element={<Products />} />
    <Route path="/detail/:id" element={<DetailProduct />} /> 
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot" element={<ForgotPassword />} />
    <Route path="/user/reset/:token" element={<ResetPassword/>} />
    <Route path="/user/activate_email/:activation_token" element={<ActivationEmail/>} />
    <Route path="/cart" element={<Cart />} />
    <Route path="*" element={<NotFound />} />
   
   
   
    
    </Routes>)
}

export default MainPages