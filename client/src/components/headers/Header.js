import { useContext } from "react"
import {GlobalState} from "../../GlobalState"
import menu from "./icon/menu.png"
import close from "./icon/close.png"
import cart from "./icon/cart.png"
import { Link } from "react-router-dom";




function Header() {

    const value = useContext(GlobalState)

    return(<>
    <header>
<div className="menu">
    <img src={menu} alt="menu-icon" />
</div>
<div className="logo">
<h1>
    <Link to="/">yoShop</Link>
</h1>
</div>
<ul>

<li><Link to="/">Products</Link></li>
<li><Link to="/login">Login or Register</Link></li>
<li>

    <img src={close} alt="close-icon" className="menu" />
</li>


</ul>

<div className="cart-icon">
<span>
    0
</span>
 <Link to="/cart">
<img src={cart} alt="cart-icon" />
</Link> 

</div>


    </header>
    
    
    </>)
}

export default Header