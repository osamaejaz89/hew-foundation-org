import { Link, useLocation } from "react-router-dom";  // Import useLocation
import "./Menu.scss";
import { menu } from "../../data";

const Menu = () => {
  const location = useLocation();  // Get the current location

  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <Link
              to={listItem.url}
              className={`listItem ${location.pathname === listItem.url ? "selected" : ""}`}  // Apply "selected" class if URL matches
              key={listItem.id}
            >
              <img src={listItem.icon} alt="" />
              <span className="listItemTitle">{listItem.title}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
