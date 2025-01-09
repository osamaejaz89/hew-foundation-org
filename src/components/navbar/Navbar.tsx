import "./navbar.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ name: string; role: string }>({ 
    name: '', 
    role: 'Administrator' 
  });
  
  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData({
          name: parsedUser.name || 'Admin',
          role: parsedUser.role || 'Administrator'
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
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
            <span className="role">{userData.role}</span>
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
