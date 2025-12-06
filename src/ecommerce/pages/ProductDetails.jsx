// Import Librarys
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import instance from "../routes/axiosConfig";
import { useCart } from "../contexts/CartProvider";
import "../../assets/css/productDetail.css";
import { useCurrency } from "../contexts/CurrencyProvider";


// Import Files

export default function ProductDetails() {
    const { id } = useParams();
	const { cart, setCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInCart, setIsInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { convert, currency } = useCurrency();

    useEffect(() => {getProductData(id);}, [id]);
	useEffect(() => {
        if (!product) return;
        const existing = cart.find((item) => item.id === product._id);
		if (existing) {
			setIsInCart(true);
			setQuantity(existing.quantity);
		} else {
			setIsInCart(false);
			setQuantity(1);
		} 
    }, [cart, product]);

    async function getProductData() {
        try {
            setLoading(true);
            const response = await instance.get("/product/product/" + id);

            if (response.data.length === 0) {
                setLoading(false);
                setError("Check the ID parameter");
            } else {
                setProduct(response.data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            setError("Check the ID parameter");
            setLoading(false);
        }
    }

	function handleAddToCart(idToAdd, getQuantity = 1) 
    {
        const exist = cart.find((item) => item.id === idToAdd);
        if (exist) 
        {
            setCart((items) =>
                        items.map((item) =>
                            item.id === idToAdd
                            ? {...item, quantity: item.quantity + getQuantity} : item
                        )
                    );
        }
        else
        {
            setCart([...cart,{ id: idToAdd, quantity: getQuantity }]);
        }

        setIsInCart(true);
	}

    function handleIncrease()
    {
        if (!product)
        {
            return;
        }
        else
        {
            const existing = cart.find(items => items.id === product._id)
            if(!existing)
            {
                handleAddToCart(product._id, quantity + 1);
            }
            else
            {
                setCart((items) => 
                    items.map((item) => 
                        item.id === product._id 
                        ? {...item, quantity: item.quantity +1} 
                        : item
                    )
                );
            }
        }
    }

    function handleDecrease()
    {
        if (!product)
        {
            return;
        }
        else
        {
            const existing = cart.find(items => items.id === product._id)
            if(!existing)
            {
                setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
            }
            else
            {
                setCart((items) => 
                    items
                    .map((item) => 
                        item.id === product._id 
                        ? {...item, quantity: item.quantity - 1} 
                        : item
                    ).filter((item) => item.quantity > 0)
                );
            }
        }
    }

    function handleRemoveFromCart(idToRemove) {
		setCart((items) => items.filter((item) => item.id !== idToRemove));
		setIsInCart(false);
		setQuantity(1);
	}
    
    if (loading)  return <p className="loading-text">Loading product details...</p>;
    if (!product) return <p className="error-text">Product not found.</p>;

    return (
        <div className="product-detail-page">
            <div className="product-wrapper">
                <div className="product-image-box">
                    <img src={product.image} alt={product.title} className="product-main-img" />
                </div>

                <div className="product-info-box">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-code">Code: {product.code}</p>

                    <p className="product-desc">{product.description}</p>

                    <div className="product-price-box">
                        <span className="product-price">
							{currency} {convert(product.price).toFixed(2)}
						</span>
                        <span className="price-tag">Inclusive of all taxes</span>
                    </div>

                    {/* Quantity selector */}
                    <div className="quantity-container">
                        <p className="quantity-label">Quantity</p>
                        <div className="quantity-controls">
                            <button className="qty-btn" onClick={handleDecrease}>−</button>
                            <span className="qty-value">{quantity}</span>
                            <button className="qty-btn" onClick={handleIncrease}> +</button>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="product-action-buttons">
                        	{
                                !isInCart ? 
                                (
                                    <button onClick={() => handleAddToCart(product._id, quantity)} className="btn-add-cart" > Add to Cart </button>
                                ): 
                                (
                                    <button onClick={() => handleRemoveFromCart(product._id)} className="btn-remove-cart" > 🗑️ Remove from Cart </button>
                                )
                            }  
                         <NavLink to="/cart" >
                            <button className="btn-buy-now">⚡ Go to Cart</button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );


    
}
