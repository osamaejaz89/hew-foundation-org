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
import AdminJobs from "./pages/admin/Jobs";
import AdminJobApplications from "./pages/admin/JobApplications";
import AdminScholarships from "./pages/admin/Scholarships";
import AdminMarriageProfiles from "./pages/admin/MarriageProfiles";
import EditJob from "./pages/admin/EditJob";
import AdminFamilies from "./pages/admin/Families";
import AdminFamilyMembers from "./pages/admin/FamilyMembers";
import AdminFamilyAnalytics from "./pages/admin/FamilyAnalytics";
import AdminFamilySearch from "./pages/admin/FamilySearch";
// import HomeUpdates from "./pages/admin/HomeUpdates";

const queryClient = new QueryClient();

function App() {
  const [, setIsAuthenticated] = useState(false); // Authentication state
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
        // Admin Routes
        {
          path: "/jobs",
          element: (
            <ProtectedRoute>
              <AdminJobs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/job-applications",
          element: (
            <ProtectedRoute>
              <AdminJobApplications />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/scholarships",
          element: (
            <ProtectedRoute>
              <AdminScholarships />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/marriage-profiles",
          element: (
            <ProtectedRoute>
              <AdminMarriageProfiles />
            </ProtectedRoute>
          ),
        },
        {
          path: "/jobs/edit/:id",
          element: (
            <ProtectedRoute>
              <EditJob />
            </ProtectedRoute>
          ),
        },
        // Admin Family Management Routes
        {
          path: "/admin/families",
          element: (
            <ProtectedRoute>
              <AdminFamilies />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/family-members",
          element: (
            <ProtectedRoute>
              <AdminFamilyMembers />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/family-analytics",
          element: (
            <ProtectedRoute>
              <AdminFamilyAnalytics />
            </ProtectedRoute>
          ),
        },
        {
          path: "/admin/family-search",
          element: (
            <ProtectedRoute>
              <AdminFamilySearch />
            </ProtectedRoute>
          ),
        },
        // Home Updates (hidden)
        // {
        //   path: "/admin/home-updates",
        //   element: (
        //     <ProtectedRoute>
        //       <HomeUpdates />
        //     </ProtectedRoute>
        //   ),
        // },
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
