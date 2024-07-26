import { useEffect } from "react";
import { useSelector } from "react-redux";
import Cart from "./component/Cart/Cart";
import Layout from "./component/Layout/Layout";
import Products from "./component/Shop/Products";

function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  useEffect(() => {
    fetch("https://redux-test-85b4f-default-rtdb.firebaseio.com/cart.json", {
      method: "PUT",
      body: JSON.stringify(cart),
    });
  }, [cart]);
  return (
    <Layout>
      {showCart && <Cart />}
      <Products />
    </Layout>
  );
}

export default App;
