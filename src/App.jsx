import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster }  from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar        from "./components/Navbar";
import Landing       from "./pages/Landing";
import Home          from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart          from "./pages/Cart";
import Wishlist      from "./pages/Wishlist";
import Checkout      from "./pages/Checkout";
import Brands        from "./pages/Brands";
import AuthPage      from "./pages/AuthPage";
import NotFound      from "./pages/NotFound";

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  const { token } = useContext(AuthContext);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#f5f5f5",
            border: "1px solid rgba(59,130,246,0.3)",
            borderRadius: "12px",
            fontSize: "15px",
          },
          success: { iconTheme: { primary: "#3b82f6", secondary: "#fff" } },
        }}
      />

      {token && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/auth" element={token ? <Navigate to="/" replace /> : <AuthPage />} />

        {/* Protected */}
        <Route path="/"            element={<ProtectedRoute><Landing /></ProtectedRoute>} />
        <Route path="/products"    element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/cart"        element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist"    element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/checkout"    element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/brands"      element={<ProtectedRoute><Brands /></ProtectedRoute>} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </>
  );
}
