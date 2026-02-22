import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OrderPage from "./pages/order/OrderPage";
import TrackingPage from "./pages/tracking/TrackingPage";
import PaymentPage from "./pages/PaymentPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Admin from "./components/admin/Admin";
import "./App.css";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import OrderCompletedPage from "./pages/OrderCompletedPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/track" element={<TrackingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/order-completed/:orderNumber"
          element={<OrderCompletedPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
