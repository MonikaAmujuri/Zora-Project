import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";



/* USER */
import UserRoute from "./routes/UserRoute";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/user/Home";
import Profile from "./pages/user/Profile";
import SareeListing from "./pages/SareeListing";
import ProductDetails from "./pages/user/ProductDetails";
import Wishlist from "./pages/user/Wishlist";
import Cart from "./pages/user/Cart";
import Address from "./pages/user/Address";
import Payment from "./pages/user/Payment";
import OrderSuccess from "./pages/user/OrderSuccess";
import OrderDetails from "./pages/user/OrderDetails";
import MyOrders from "./pages/user/MyOrders";
import VideoShopping from "./pages/user/VideoShopping";
import Contact from "./pages/user/Contact";
import ResetPassword from "./pages/ResetPassword";


function App() {
  return (
    <Routes>

      <Route path="/signup" element={<Signup />} />

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* USER */}
      
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sarees" element={<SareeListing />} />
        <Route path="sarees/:type" element={<SareeListing />} />
        <Route path="/product/:id" element={<ProductDetails />} />

      </Route>
      <Route path="/products/:type" element={<SareeListing />} />
      <Route path="/products/all" element={<SareeListing />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/address"
        element={
          <UserRoute>
            <Address />
          </UserRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <UserRoute>
            <Payment />
          </UserRoute>
        }
      />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/order/:id" element={<OrderDetails />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/video-shopping" element={<VideoShopping />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
