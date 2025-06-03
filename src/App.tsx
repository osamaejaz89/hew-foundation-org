import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import Navbar from "./components/navbar/Navbar";
import BloodDetails from "./pages/bloodDonars/bloodDetails";
import BloodDonarRequest from "./pages/bloodDonars/bloodDonarRequest";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Product from "./pages/product/Product";
import User from "./pages/user/User";
import Users from "./pages/users/Users";
import "./styles/global.scss";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import BloodRequest from "./pages/bloodDonars/bloodRequest";
import Donations from "./pages/donations/Donations";
import FamilyManagement from "./pages/FamilyManagement";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  console.log(isAuthenticated, "authhhh");
  useEffect(() => {
    // Check for token on initial load
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token); // Set state based on token presence
  }, []);
  const Layout = () => {
    return (
      <div className="main">
        <Navbar />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/login" replace />, // Redirect to login by default
    },
    {
      path: "/login",
      element: <Login />,
    },

    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/home",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "/users",
          element: (
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          ),
        },
        {
          path: "/bloodDetails",
          element: (
            <ProtectedRoute>
              <BloodDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: "/users/:id",
          element: (
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          ),
        },
        {
          path: "/products/:id",
          element: (
            <ProtectedRoute>
              <Product />
            </ProtectedRoute>
          ),
        },
        {
          path: "/bloodRequest",
          element: (
            <ProtectedRoute>
              <BloodRequest />
            </ProtectedRoute>
          ),
        },
        {
          path: "/bloodDonarRequest",
          element: (
            <ProtectedRoute>
              <BloodDonarRequest />
            </ProtectedRoute>
          ),
        },
        {
          path: "/donations",
          element: (
            <ProtectedRoute>
              <Donations />
            </ProtectedRoute>
          ),
        },
        {
          path: "/families",
          element: (
            <ProtectedRoute>
              <FamilyManagement />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer />
      </QueryClientProvider>
    </>
  );
}

export default App;
