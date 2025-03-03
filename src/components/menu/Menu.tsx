import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menu } from "../../data";
import "./menu.scss";

const Menu = () => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: number]: boolean }>({});

  // Helper function to check if a dropdown should be active
  const isDropdownActive = (listItem: any) => {
    if (!listItem.nestedItems) return false;
    
    // Check if any nested item's path matches current location
    return listItem.nestedItems.some(
      (nestedItem: any) => location.pathname === nestedItem.url
    );
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getIconPath = (iconName: string) => {
    return `/${iconName}`;
  };

  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          <div className="list-container">
            {item.listItems.map((listItem) => (
              <div key={listItem.id}>
                {listItem.nestedItems ? (
                  <>
                    <div 
                      className={`listItem dropdown-header ${
                        isDropdownActive(listItem) ? "active" : ""
                      }`}
                      onClick={() => toggleDropdown(listItem.id)}
                    >
                      <div className="left-content">
                        <img src={getIconPath(listItem.icon)} alt="" />
                        <span>{listItem.title}</span>
                      </div>
                      {openDropdowns[listItem.id] ? 
                        <KeyboardArrowUpIcon className="arrow-icon" /> : 
                        <KeyboardArrowDownIcon className="arrow-icon" />
                      }
                    </div>
                    <div className={`nested-items ${openDropdowns[listItem.id] ? 'open' : ''}`}>
                      {listItem.nestedItems.map((nestedItem) => (
                        <Link
                          key={nestedItem.id}
                          to={nestedItem.url}
                          className={`listItem ${
                            location.pathname === nestedItem.url ? "active" : ""
                          }`}
                        >
                          <img src={getIconPath(nestedItem.icon)} alt="" />
                          <span>{nestedItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={listItem.url || "#"}
                    className={`listItem ${
                      location.pathname === listItem.url ? "active" : ""
                    }`}
                  >
                    <img src={getIconPath(listItem.icon)} alt="" />
                    <span>{listItem.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
