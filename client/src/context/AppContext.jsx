import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;



export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserlogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});


// fetch all Products
    const fetchProducts = async () => {
        setProducts(dummyProducts);
    }

    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
             cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Item added to cart successfully!");
    }
       // update cart items  Quantity 
        const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart updated successfully!");
 }

       // remove item from cart
         const removeFromCart = (itemId) => {
          let cartData = structuredClone(cartItems);
          if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
            }
            toast.success("Item removed from cart successfully!");
            setCartItems(cartData);
        }
        
        // get cart item count
        const getCartCount = () => {
            let count = 0;
            for (const item in cartItems) {
                count += cartItems[item];
            }
            return count;
        }
        // get cart total price
        const getCartAmount = () => {
            let total = 0;
            for (const item in cartItems) {
                let itemInfo = products.find((product) => product._id === item);
                if(cartItems[item] > 0){
                    total += itemInfo.offerPrice * cartItems[item];
                }
            }
            return Math.floor(total * 100) / 100;
        }

    useEffect(() => {
        fetchProducts();
    }, []);

    const value = {navigate, user, setUser, isSeller, setIsSeller, showUserlogin, setShowUserLogin, products, currency, addToCart,updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery, getCartCount, getCartAmount, axios};

    return <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>
    }

    export const useAppContext = () => {
        return useContext(AppContext)
    }

    