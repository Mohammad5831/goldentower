import axios from 'axios';
import { getAllProductsFromCache, getProductsFromCache, saveAllProductsToCache, saveProductsToCache } from './ProductsLocal';


export const fetchProducts = async (brand, category = {}) => {
    const cached = getProductsFromCache(brand);
    if (cached) {
        const filtered = cached.products.filter((p) => p.category_id === category.id);
        return { data: filtered, fromCache: true };
    };

    const response = await axios.get(`http://localhost:5000/api/products/brands/${brand}`);
    saveProductsToCache(response.data, brand);
    return { data: response.data, fromCache: false };
};

export const fetchAllProducts = async () => {
    const cached = getAllProductsFromCache();
    if (cached) {
        return { data: cached, fromCache: true };
    };

    const response = await axios.get(`http://localhost:5000/api/products`);
    saveAllProductsToCache(response.data);
    return { data: response.data, fromCache: false };
};