import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar       from "./components/Navbar";
import Home         from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart         from "./pages/Cart";
import Wishlist     from "./pages/Wishlist";
import Checkout     from "./pages/Checkout";
import Brands       from "./pages/Brands";
import AuthPage     from "./pages/AuthPage";
import NotFound     from "./pages/NotFound";

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
            background: "#1a1a1a", color: "#f5f5f5",
            border: "1px solid rgba(212,175,55,0.3)", borderRadius: "12px", fontSize: "15px",
          },
          success: { iconTheme: { primary: "#d4af37", secondary: "#000" } },
        }}
      />

      {token && <Navbar />}

      <Routes>
        <Route path="/auth" element={token ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route path="/"              element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/product/:id"   element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/cart"          element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist"      element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/checkout"      element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/brands"        element={<ProtectedRoute><Brands /></ProtectedRoute>} />
        <Route path="*"              element={<NotFound />} />
      </Routes>
    </>
  );
}
