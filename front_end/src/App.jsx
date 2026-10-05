import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // اگر از react-router-dom استفاده می‌کنید
import { AuthProvider } from './components/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import ContactPage from './pages/ContactUs';
import Login from './pages/Login';
import PaymentResult from './pages/PaymentResult';
import GetUserInformation from './pages/GetUserInformation';
// سایر کامپوننت‌ها
import { fetchAllProducts, fetchProducts } from './service/getProducts';
import { getLocalCart } from './service/CartLocal';
import { Articles } from './pages/articles/Articles';
import ArticleDetail from './pages/articles/ArticleDetail';
import { PanelAdmin } from './pages/admin panel/PanelAdmin';
import AdminDashboard from './pages/admin panel/AdminDashboard';
import AdminProducts from './pages/admin panel/AdminProducts';
import AdminOrders from './pages/admin panel/AdminOrders';
import AdminUsers from './pages/admin panel/AdminUsers';
import AdminCategories from './pages/admin panel/AdminCategories';
import AdminSettings from './pages/admin panel/AdminSettings';
import AdminArticles from './pages/admin panel/AdminArticles';
import AdminBrands from './pages/admin panel/AdminBrands';
import AdminProductCreate from './pages/admin panel/AdminProductCreate';
import AdminCategoryCreate from './pages/admin panel/AdminCategoryCreate';
import AdminBrandCreate from './pages/admin panel/AdminBrandCreate';
import AdminArticleCreate from './pages/admin panel/AdminArticleCreate';
import AdminProductEdit from './pages/admin panel/AdminProductEdit';
import PanelUser from './pages/user panel/PanelUser';
import UserDashboard from './pages/user panel/UserDashboard';
import UserOrders from './pages/user panel/UserOrders';
import UserOrderDetail from './pages/user panel/UserOrderDetail';
import UserProfile from './pages/user panel/UserProfile';
import UserAddresses from './pages/user panel/UserAddresses';
import UserWishlist from './pages/user panel/UserWishlist';

const brands = [
  "datees",
  "vita",
  "mixPlus",
  "artin",
];

function App() {

  useEffect(() => {
    const preloadProducts = async () => {
      try {
        for (const b of brands) {
          await fetchProducts(b);
        }
        await fetchAllProducts()
      } catch (err) {
        console.log('خطا در دریافت محصولات', err);
      };
    };

    preloadProducts()
  }, []);
  getLocalCart()


  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <PanelAdmin>
                <AdminDashboard />
              </PanelAdmin>
            } />
          <Route
            path="/admin/products"
            element={
              <PanelAdmin>
                <AdminProducts />
              </PanelAdmin>
            }
          />
          <Route
            path="/admin/products/create"
            element={
              <PanelAdmin>
                <AdminProductCreate />
              </PanelAdmin>
            }
          />
          <Route
            path="/admin/products/edit/:uuid"
            element={
              <PanelAdmin>
                <AdminProductEdit />
              </PanelAdmin>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <PanelAdmin>
                <AdminOrders />
              </PanelAdmin>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PanelAdmin>
                <AdminUsers />
              </PanelAdmin>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <PanelAdmin>
                <AdminCategories />
              </PanelAdmin>
            }
          />
          <Route
            path="/admin/categories/create"
            element={
              <PanelAdmin>
                <AdminCategoryCreate />
              </PanelAdmin>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PanelAdmin>
                <AdminSettings />
              </PanelAdmin>
            }
          />
          <Route
            path="/admin/articles"
            element={
              <PanelAdmin>
                <AdminArticles />
              </PanelAdmin>
            }
          />
          <Route
            path="/admin/articles/create"
            element={
              <PanelAdmin>
                <AdminArticleCreate />
              </PanelAdmin>
            }
          />
          <Route
            path="/admin/brands"
            element={
              <PanelAdmin>
                <AdminBrands />
              </PanelAdmin>
            }
          />
          <Route
            path="/admin/brands/create"
            element={
              <PanelAdmin>
                <AdminBrandCreate />
              </PanelAdmin>
            }
          />

          <Route
            path="/user"
            element={
              <PanelUser>
                <UserDashboard />
              </PanelUser>
            }
          />
          <Route
            path="/user/orders"
            element={
              <PanelUser>
                <UserOrders />
              </PanelUser>
            }
          />
          <Route
            path="/user/orders/:uuid"
            element={
              <PanelUser>
                <UserOrderDetail />
              </PanelUser>
            }
          />
          <Route
            path="/user/profile"
            element={
              <PanelUser>
                <UserProfile />
              </PanelUser>
            }
          />
          <Route
            path="/user/addresses"
            element={
              <PanelUser>
                <UserAddresses />
              </PanelUser>
            }
          />
          <Route
            path="/user/wishlist"
            element={
              <PanelUser>
                <UserWishlist />
              </PanelUser>
            }
          />


          <Route path="/about" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          {/* <Route path="/products/:brand" element={<Products />} /> */}

          <Route path="/cart" element={<Cart />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/user-information/:orderId" element={<GetUserInformation />} />

          <Route path="/productDetail/:product_uuid" element={<ProductDetails />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* سایر مسیرها */}
          <Route path="/articles" element={<Articles />} />
          <Route path="/articleDetail/:article_id" element={<ArticleDetail />} />

        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;