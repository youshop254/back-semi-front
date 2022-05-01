import { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom' 
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import './detailProduct.css'

function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const[products] = state.productsApi.products
    const[detailProduct, setDetailProduct] = useState([])

    useEffect(() => {

if(params.id) {

    products.forEach( product => {
        if(product._id === params.id) setDetailProduct(product)
        
    });

}

    }, [params.id, products])

console.log(detailProduct)

if(detailProduct.length === 0) return null
    
    return(<div className='details'>

        <img src={detailProduct.images} alt={detailProduct.title} />
        <div className='box_detail'>
            <div className='row'>
<h2>{detailProduct.title}</h2>
<h6>Product ID: {detailProduct.product_id}</h6>

            </div>
            <span>MK{detailProduct.price}</span>
            <p>{detailProduct.description}</p>
            <p>{detailProduct.content}</p>
            <p>Sold: {detailProduct.sold}</p>
            <Link to="/cart">Buy Now</Link>




        </div>

        
    
    
    </div>)
}

export default DetailProduct



