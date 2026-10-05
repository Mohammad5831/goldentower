import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useCart = () => {
  const token = Cookies.get("token");
  const [items, setItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // --- Fetch cart (from server or localStorage)
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      if (token) {
        const res = await axios.get("https://api.goldentower.ir/api/carts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartItems = res.data.cartItems || [];
        setItems(cartItems);
        setCartCount(cartItems.length);
        setTotal(res.data.totalPrice || 0);

        // همیشه localStorage را sync کن
        localStorage.setItem(
          "cart",
          JSON.stringify({ items: cartItems, total: res.data.totalPrice })
        );
      } else {
        const localCart = JSON.parse(localStorage.getItem("cart")) || {
          items: [],
          total: 0,
        };
        setItems(localCart.items);
        setCartCount(localCart.items.length);
        setTotal(localCart.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // --- Add item
  const addItem = useCallback(
    async (product, quantity = 1) => {
      setLoading(true);
      try {
        if (token) {
          await axios.post(
            "https://api.goldentower.ir/api/carts",
            { product_uuid: product.product_uuid, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          await fetchCart(); // بعد از اضافه کردن، fetch دوباره
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart")) || {
            items: [],
            total: 0,
          };
          const existingIndex = localCart.items.findIndex(
            (i) => i.product_uuid === product.product_uuid
          );
          if (existingIndex > -1) {
            localCart.items[existingIndex].quantity += quantity;
          } else {
            localCart.items.push({ ...product, quantity });
          }
          // محاسبه مجموع
          const newTotal = localCart.items.reduce(
            (sum, i) => sum + i.current_price * i.quantity,
            0
          );
          localCart.total = newTotal;

          localStorage.setItem("cart", JSON.stringify(localCart));
          setItems(localCart.items);
          setCartCount(localCart.items.length);
          setTotal(localCart.total);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [token, fetchCart]
  );

  // --- Update quantity
  const updateItemQuantity = useCallback(
    async (uuid, newQty) => {
      setLoading(true);
      try {
        if (token) {
          await axios.put(
            "https://api.goldentower.ir/api/carts",
            { product_uuid: uuid, quantity: newQty },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          await fetchCart();
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart")) || {
            items: [],
            total: 0,
          };
          const index = localCart.items.findIndex((i) => i.product_uuid === uuid);
          if (index > -1) {
            localCart.items[index].quantity = newQty;
          }
          localCart.total = localCart.items.reduce(
            (sum, i) => sum + i.current_price * i.quantity,
            0
          );
          localStorage.setItem("cart", JSON.stringify(localCart));
          setItems(localCart.items);
          setCartCount(localCart.items.length);
          setTotal(localCart.total);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [token, fetchCart]
  );

  // --- Remove item
  const removeItem = useCallback(
    async (uuid) => {
      setLoading(true);
      try {
        if (token) {
          await axios.delete(`https://api.goldentower.ir/api/carts/${uuid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          await fetchCart();
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart")) || {
            items: [],
            total: 0,
          };
          localCart.items = localCart.items.filter((i) => i.product_uuid !== uuid);
          localCart.total = localCart.items.reduce(
            (sum, i) => sum + i.current_price * i.quantity,
            0
          );
          localStorage.setItem("cart", JSON.stringify(localCart));
          setItems(localCart.items);
          setCartCount(localCart.items.length);
          setTotal(localCart.total);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [token, fetchCart]
  );

  return {
    items,
    cartCount,
    total,
    loading,
    addItem,
    updateItemQuantity,
    removeItem,
    fetchCart,
  };
};
