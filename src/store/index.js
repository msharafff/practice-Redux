import { createSlice, configureStore } from "@reduxjs/toolkit";

const uiState = { cartIsVisible: false, notification: null };
const uiSlice = createSlice({
  name: "cart",
  initialState: uiState,
  reducers: {
    toggle(state) {
      state.cartIsVisible = !state.cartIsVisible;
    },
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
  },
});

const cartState = {
  items: [],
  totalQuantity: 0,
  changed: false,
};
const cartSlice = createSlice({
  name: "cart",
  initialState: cartState,
  reducers: {
    replaceCart(state, action) {
      state.totalQuantity = action.payload.totalQuantity;
      state.items = action.payload.items;
    },
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;
      state.changed = true;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      state.totalQuantity--;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        state.changed = true;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
  },
});

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "sending...",
        message: "sending cart data",
      })
    );
    const sendRequest = async () => {
      const res = await fetch(
        "https://redux-test-85b4f-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!res.ok) {
        throw new Error("failed to send cart data");
      }
    };
    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: " success !",
          message: "sending cart data successfully!",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: " error !",
          message: "sending cart data failed !",
        })
      );
    }
  };
};

export const getCartData = () => {
  return async (dispatch) => {
    const getData = async () => {
      const res = await fetch(
        "https://redux-test-85b4f-default-rtdb.firebaseio.com/cart.json"
      );
      if (!res.ok) {
        throw new Error("failed to get cart data");
      }

      const data = await res.json();

      return data;
    };

    try {
      const cartData = await getData();
      dispatch(
        cartActions.replaceCart({
          items: cartData.items || [],
          totalQuantity: cartData.totalQuantity,
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error",
          message: "fetching cart data failed",
        })
      );
    }
  };
};

const store = configureStore({
  reducer: { ui: uiSlice.reducer, cart: cartSlice.reducer },
});

export const uiActions = uiSlice.actions;
export const cartActions = cartSlice.actions;
export default store;
