import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster }    from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar           from "./components/Navbar";
import Footer           from "./components/Footer";
import ScrollToTop      from "./components/ScrollToTop";
import ErrorBoundary    from "./components/ErrorBoundary";
import Landing          from "./pages/Landing";
import Home             from "./pages/Home";
import ProductDetails   from "./pages/ProductDetails";
import Cart             from "./pages/Cart";
import Wishlist         from "./pages/Wishlist";
import Checkout         from "./pages/Checkout";
import Brands           from "./pages/Brands";
import Orders           from "./pages/Orders";
import Search           from "./pages/Search";
import Profile          from "./pages/Profile";
import ForgotPassword   from "./pages/ForgotPassword";
import AuthPage         from "./pages/AuthPage";
import NotFound         from "./pages/NotFound";

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/auth" replace />;
}

// Wrapper to show Footer only on protected pages
function Layout() {
  const { token }  = useContext(AuthContext);
  const location   = useLocation();
  const noFooter   = ["/auth", "/forgot-password"].includes(location.pathname);

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

      <ErrorBoundary>
        <Routes>
          <Route path="/auth"             element={token ? <Navigate to="/" replace /> : <AuthPage />} />
          <Route path="/forgot-password"  element={<ForgotPassword />} />

          <Route path="/"            element={<ProtectedRoute><Landing /></ProtectedRoute>} />
          <Route path="/products"    element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/cart"        element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/wishlist"    element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/checkout"    element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/brands"      element={<ProtectedRoute><Brands /></ProtectedRoute>} />
          <Route path="/orders"      element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/search"      element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*"            element={<NotFound />} />
        </Routes>
      </ErrorBoundary>

      {token && !noFooter && <Footer />}
      {token && <ScrollToTop />}
    </>
  );
}

export default function App() {
  return <Layout />;
}
