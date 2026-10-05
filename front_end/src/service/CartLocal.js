import axios from "axios";

const API_URL = "https://api.goldentower.ir";
const CART_KEY = "cart";
const CART_EVENT = "cartUpdated";

/* =========================
   Helpers
========================= */

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getLocalCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);

    if (!cart) {
      return [];
    }

    const parsed = JSON.parse(cart);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("getLocalCart error:", error);
    return [];
  }
};

const emitCartUpdate = () => {
  window.dispatchEvent(new Event(CART_EVENT));
};

export const setLocalCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  emitCartUpdate();
};

/* =========================
   Add
========================= */

export const addToLocalCart = (product) => {
  const cart = getLocalCart();

  const existing = cart.find(
    (item) => item.product_uuid === product.product_uuid
  );

  if (existing) {
    return {
      success: false,
      message: "محصول قبلاً به سبد اضافه شده",
    };
  }

  const quantity = Math.max(1, Number(product.quantity) || 1);

  const item = {
    ...product,
    quantity,

    itemOriginalTotalPrice:
      Number(product.original_price || 0) * quantity,

    itemTotalPrice:
      Number(product.current_price || 0) * quantity,
  };

  cart.push(item);

  setLocalCart(cart);

  return {
    success: true,
    item,
  };
};

/* =========================
   Remove Local
========================= */

export const removeFromLocalCart = (product_uuid) => {
  const cart = getLocalCart();

  const updatedCart = cart.filter(
    (item) => item.product_uuid !== product_uuid
  );

  setLocalCart(updatedCart);

  return {
    success: true,
  };
};

/* =========================
   Remove DB
========================= */

export const removeFromDB = async (token, uuid) => {
  try {
    if (!token || !uuid) {
      return {
        success: false,
        message: "اطلاعات لازم برای حذف وجود ندارد",
      };
    }

    await axios.delete(
      `${API_URL}/api/carts/${uuid}`,
      getAuthConfig(token)
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("removeFromDB error:", error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "حذف محصول از سبد سرور انجام نشد",
    };
  }
};

/* =========================
   Update Local Quantity
========================= */

export const updateLocalCartQty = (
  product_uuid,
  quantity
) => {
  const safeQuantity = Math.max(
    1,
    Number(quantity) || 1
  );

  const cart = getLocalCart();

  const updatedCart = cart.map((item) => {
    if (item.product_uuid !== product_uuid) {
      return item;
    }

    return {
      ...item,

      quantity: safeQuantity,

      itemOriginalTotalPrice:
        Number(item.original_price || 0) *
        safeQuantity,

      itemTotalPrice:
        Number(item.current_price || 0) *
        safeQuantity,
    };
  });

  setLocalCart(updatedCart);

  return updatedCart;
};

/* =========================
   Clear
========================= */

export const clearLocalCart = () => {
  localStorage.removeItem(CART_KEY);
  emitCartUpdate();
};

/* =========================
   Get DB Cart
========================= */

export const getDBCart = async (token) => {
  try {
    if (!token) {
      return {
        success: false,
        cartItems: [],
        message: "کاربر وارد نشده است",
      };
    }

    const res = await axios.get(
      `${API_URL}/api/carts`,
      getAuthConfig(token)
    );

    const data = res?.data || {};

    return {
      success: Boolean(data.success),
      cartItems: Array.isArray(data.cartItems)
        ? data.cartItems
        : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.cart)
            ? data.cart
            : [],
      message: data.message || "",
    };
  } catch (error) {
    console.error("getDBCart error:", error);

    return {
      success: false,
      cartItems: [],
      message:
        error?.response?.data?.message ||
        "دریافت سبد خرید از سرور انجام نشد",
    };
  }
};

/* =========================
   Convert DB Cart
========================= */

const normalizeDBCartItem = (item) => {
  const quantity = Math.max(
    1,
    Number(item.quantity) || 1
  );

  return {
    current_price: Number(item.current_price || 0),
    original_price: Number(item.original_price || 0),

    image: item.image || null,

    quantity,

    name:
      item.product_name ||
      item.name ||
      "",

    model:
      item.product_model ||
      item.model ||
      "",

    product_uuid:
      item.product_uuid,

    itemOriginalTotalPrice:
      Number(item.original_price || 0) *
      quantity,

    itemTotalPrice:
      Number(item.current_price || 0) *
      quantity,
  };
};

/* =========================
   Sync Local Cart → DB
========================= */

export const syncLocalCart = async (token) => {
  try {
    if (!token) {
      return {
        success: false,
        message: "کاربر وارد نشده است",
      };
    }

    const localCart = getLocalCart();

    /*
     * اگر سبد لوکال خالی است،
     * فقط سبد دیتابیس را دریافت می‌کنیم.
     */

    if (localCart.length === 0) {
      const dbCart = await getDBCart(token);

      if (!dbCart.success) {
        return {
          success: false,
          message:
            dbCart.message ||
            "دریافت سبد خرید انجام نشد",
        };
      }

      return {
        success: true,
        cartItems: dbCart.cartItems,
        message: "سبد خرید با موفقیت دریافت شد",
      };
    }

    /*
     * انتقال تک‌تک محصولات به DB
     *
     * مهم:
     * اینجا await داریم تا مطمئن شویم
     * تمام درخواست‌ها کامل شده‌اند.
     */

    for (const item of localCart) {
      await axios.post(
        `${API_URL}/api/carts`,
        {
          product_uuid: item.product_uuid,
          quantity: Math.max(
            1,
            Number(item.quantity) || 1
          ),
        },
        getAuthConfig(token)
      );
    }

    /*
     * بعد از اتمام sync،
     * سبد واقعی DB را دریافت می‌کنیم.
     */

    const dbCart = await getDBCart(token);

    if (!dbCart.success) {
      return {
        success: false,
        message:
          dbCart.message ||
          "دریافت سبد خرید بعد از همگام‌سازی انجام نشد",
      };
    }

    /*
     * DB منبع اصلی سبد بعد از login است.
     */

    clearLocalCart();

    /*
     * برای حفظ ساختار فعلی پروژه،
     * سبد DB دوباره در LocalStorage قرار می‌گیرد.
     */

    for (const item of dbCart.cartItems) {
      addToLocalCart(
        normalizeDBCartItem(item)
      );
    }

    return {
      success: true,
      cartItems: dbCart.cartItems,
      message: "سبد خرید با موفقیت همگام شد",
    };
  } catch (error) {
    console.error("syncLocalCart error:", error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "خطا در برقراری ارتباط با سرور",
    };
  }
};

/* =========================
   Event Listener Helper
========================= */

export const CART_UPDATED_EVENT = CART_EVENT;