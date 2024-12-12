import { useState } from "react";
import { Link } from "react-router-dom";
import "./Menu.scss";
import { menu } from "../../data";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const Menu = () => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const handleDropdownToggle = (id: number) => {
    setActiveDropdown((prevId) => (prevId === id ? null : id)); // Toggle dropdown visibility
  };

  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <div key={listItem.id}>
              {/* Check if listItem has nestedItems to create a dropdown */}
              {listItem.nestedItems ? (
                <div>
                  <div
                    className="listItem"
                    onClick={() => handleDropdownToggle(listItem.id)}
                  >
                    <img src={listItem.icon} alt="" />
                    <span className="listItemTitle">{listItem.title}</span>
                    {/* Arrow Icon */}
                    {activeDropdown === listItem.id ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon />
                    )}
                  </div>
                  {/* Show nested items if the dropdown is active */}
                  {activeDropdown === listItem.id && (
                    <div className="nestedItems">
                      {listItem.nestedItems.map((nestedItem) => (
                        <Link
                          to={nestedItem.url}
                          className="listItem"
                          key={nestedItem.id}
                        >
                          <img src={nestedItem.icon} alt="" />
                          <span className="listItemTitle">{nestedItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link to={listItem.url} className="listItem">
                  <img src={listItem.icon} alt="" />
                  <span className="listItemTitle">{listItem.title}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
