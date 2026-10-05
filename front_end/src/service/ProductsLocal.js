const ALL_PRODUCTS = 'all_products';
const VITA_PRODUCT_CACHE_KEY = 'vita_products';
const DATEES_PRODUCT_CACHE_KEY = 'datees_products';
const MIXPLUS_PRODUCT_CACHE_KEY = 'mixplus_products';
const ARTIN_PRODUCT_CACHE_KEY = 'artin_products';
const BADAB_PRODUCT_CACHE_KEY = 'badab_products';
const CACHE_EXPIRE_KEY = 'products_expire_time';
const CACHE_DURATION = 1000 * 60 * 200;

export const saveAllProductsToCache = (products) => {
    localStorage.setItem(ALL_PRODUCTS, JSON.stringify(products))
};

export const getAllProductsFromCache = () => {
    const products = localStorage.getItem(ALL_PRODUCTS);

    const expireTime = localStorage.getItem(CACHE_EXPIRE_KEY);
    if (!expireTime || !products) return null;
    if (Date.now() > parseInt(expireTime)) {
        localStorage.removeItem(ALL_PRODUCTS);

        localStorage.removeItem(CACHE_EXPIRE_KEY);
        return null;
    };

    return JSON.parse(products);
};

export const saveProductsToCache = (products, brand) => {
    if (brand === 'vita') {
        localStorage.setItem(VITA_PRODUCT_CACHE_KEY, JSON.stringify(products));
    } else if (brand === 'datees') {
        localStorage.setItem(DATEES_PRODUCT_CACHE_KEY, JSON.stringify(products));
    } else if (brand === 'mixplus') {
        localStorage.setItem(MIXPLUS_PRODUCT_CACHE_KEY, JSON.stringify(products));
    } else if (brand === 'artin') {
        localStorage.setItem(ARTIN_PRODUCT_CACHE_KEY, JSON.stringify(products));
    } else if (brand === 'badab') {
        localStorage.setItem(BADAB_PRODUCT_CACHE_KEY, JSON.stringify(products));
    };
    localStorage.setItem(CACHE_EXPIRE_KEY, Date.now() + CACHE_DURATION);
};

export const getProductsFromCache = (brand) => {
    // console.log(Date.now(), 'get products')
    let products;
    const expireTime = localStorage.getItem(CACHE_EXPIRE_KEY);

    if (brand === 'vita') {
        products = localStorage.getItem(VITA_PRODUCT_CACHE_KEY);
    } else if (brand === 'datees') {
        products = localStorage.getItem(DATEES_PRODUCT_CACHE_KEY);
    } else if (brand === 'mixplus') {
        products = localStorage.getItem(MIXPLUS_PRODUCT_CACHE_KEY);
    } else if (brand === 'artin') {
        products = localStorage.getItem(ARTIN_PRODUCT_CACHE_KEY);
    } else if (brand === 'badab') {
        products = localStorage.getItem(BADAB_PRODUCT_CACHE_KEY);
    };

    if (!expireTime || !products) return null;

    if (Date.now() > parseInt(expireTime)) {
        localStorage.removeItem(VITA_PRODUCT_CACHE_KEY);
        localStorage.removeItem(DATEES_PRODUCT_CACHE_KEY);
        localStorage.removeItem(MIXPLUS_PRODUCT_CACHE_KEY);
        localStorage.removeItem(ARTIN_PRODUCT_CACHE_KEY);
        localStorage.removeItem(BADAB_PRODUCT_CACHE_KEY);

        localStorage.removeItem(CACHE_EXPIRE_KEY);
        return null;
    };

    return JSON.parse(products);
};