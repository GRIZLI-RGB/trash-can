import Header from "./components/Header";
import Cart from "./components/Cart";
import axios from "axios";
import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

function App() {

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const cartResponse = await axios.get('https://632edb17b56bd6ac45a5fef4.mockapi.io/cart');
      const favoritesResponse = await axios.get('https://632edb17b56bd6ac45a5fef4.mockapi.io/favorites');
      const itemsResponse = await axios.get('https://632edb17b56bd6ac45a5fef4.mockapi.io/products');

      setCartItems(cartResponse.data);
      setFavorites(favoritesResponse.data);
      setProducts(itemsResponse.data);
    }
    fetchData();
  }, [])

  const onAddToCart = (product) => {
    try {
      if(cartItems.find((item) => Number(item.id) === Number(product.id))) {
        axios.delete(`https://632edb17b56bd6ac45a5fef4.mockapi.io/cart/${product.id}`);
        setCartItems(prev => prev.filter(item => Number(item.id) !== Number(product.id)));
      } else {
        axios.post('https://632edb17b56bd6ac45a5fef4.mockapi.io/cart', product);
        setCartItems(prev => [...prev, product]);
      }
    } catch (error) {
      alert(error);
    }
  }

  const onAddToFavorites = async (product) => {
    try {
      if(favorites.find((prod) => prod.id === product.id)) {
        axios.delete(`https://632edb17b56bd6ac45a5fef4.mockapi.io/favorites/${product.id}`);
      } else {
        const { data } = await axios.post('https://632edb17b56bd6ac45a5fef4.mockapi.io/favorites', product);
        setFavorites(prev => [...prev, data]);
      }
    } catch (error) {
      alert(error);
    }
  }

  const onSearch = (e) => {
    setSearch(e.target.value);
  }

  const onRemoveItem = (id) => {
    axios.delete(`https://632edb17b56bd6ac45a5fef4.mockapi.io/cart/${id}`);
    setCartItems(prev => prev.filter(item => item.id !== id));
  }

  return (
    <div className="wrapper">

      { open && <Cart onRemove={onRemoveItem} items={cartItems} onCloseCart={() => setOpen(false)}/>}

      <Header onOpenCart={() => setOpen(true)}/>

      <Route path="/favorites" exact>
        <Favorites
        favorites={favorites}
        onAddToFavorites={onAddToFavorites}
        />
      </Route>

      <Route path="/" exact>
        <Home
        products={products}
        search={search}
        setSearch={setSearch}
        onSearch={onSearch}
        onAddToFavorites={onAddToFavorites}
        onAddToCart={onAddToCart}
        cartItems={cartItems}
        />
      </Route>

    </div>
  );
}

export default App;