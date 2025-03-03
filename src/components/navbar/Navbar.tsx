import "./navbar.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ name: string; role: string }>({ 
    name: 'Admin', 
    role: 'Administrator' 
  });
  
  useEffect(() => {
    const getUserData = () => {
      try {
        const userStr = localStorage.getItem("user");
        
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData({
            name: user.name || 'Admin',
            role: user.role || 'Administrator'
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    getUserData();
    
    // Add event listener for storage changes
    window.addEventListener('storage', getUserData);
    return () => window.removeEventListener('storage', getUserData);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clear all storage
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img 
          src="/hewLogo.jpeg" 
          alt="Hew Foundation"
          style={{ width: 35, height: 35, borderRadius: '50%' }}
        />
        <span>Hew Foundation</span>
      </div>
      <div className="icons">
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>0</span>
        </div>
        <div className="user">
          <img
            src="/hewLogo.jpeg"
            alt=""
            style={{ width: 35, height: 35, borderRadius: '50%' }}
          />
          <div className="info">
            <span className="username">{userData.name}</span>
            {/* <span className="role">{userData.role}</span> */}
          </div>
        </div>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
