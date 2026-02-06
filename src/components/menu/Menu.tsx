import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GroupIcon from "@mui/icons-material/Group";
import HomeIcon from "@mui/icons-material/Home";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ListIcon from "@mui/icons-material/List";
import PaymentsIcon from "@mui/icons-material/Payments";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import WorkIcon from "@mui/icons-material/Work";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menu } from "../../data";
import "./menu.scss";

const MENU_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  home: HomeIcon,
  group: GroupIcon,
  bloodtype: BloodtypeIcon,
  payments: PaymentsIcon,
  work: WorkIcon,
  list: ListIcon,
  assignment: AssignmentIcon,
  school: SchoolIcon,
  favorite: FavoriteIcon,
  familyRestroom: FamilyRestroomIcon,
  barChart: BarChartIcon,
  search: SearchIcon,
};

const MenuIcon = ({ name }: { name: string }) => {
  const Icon = MENU_ICONS[name] ?? GroupIcon;
  return <Icon className="menu__icon" />;
};

const Menu = () => {
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const isDropdownActive = (listItem: { nestedItems?: { url: string }[] }) => {
    if (!listItem.nestedItems) return false;
    return listItem.nestedItems.some(
      (nestedItem) => location.pathname === nestedItem.url
    );
  };

  const dropdownKey = (sectionId: number, itemId: number) => `${sectionId}-${itemId}`;

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allListItems = menu.flatMap((section) =>
    section.listItems.map((listItem) => ({ ...listItem, _sectionId: section.id }))
  );

  return (
    <nav className="menu" aria-label="Main navigation">
      <ul className="menu__list" role="list">
        {allListItems.map((listItem) => (
          <li key={`${listItem._sectionId}-${listItem.id}`} className="menu__list-item">
                {listItem.nestedItems ? (
                  <>
                    <button
                      type="button"
                      className={`menu__link menu__link--dropdown ${
                        isDropdownActive(listItem) ? "menu__link--active" : ""
                      }`}
                      onClick={() => toggleDropdown(dropdownKey(listItem._sectionId, listItem.id))}
                      aria-expanded={openDropdowns[dropdownKey(listItem._sectionId, listItem.id)] ?? false}
                      aria-controls={`menu-sub-${listItem._sectionId}-${listItem.id}`}
                      id={`menu-btn-${listItem._sectionId}-${listItem.id}`}
                    >
                      <span className="menu__link-inner">
                        <MenuIcon name={listItem.icon} />
                        <span>{listItem.title}</span>
                      </span>
                      {openDropdowns[dropdownKey(listItem._sectionId, listItem.id)] ? (
                        <KeyboardArrowUpIcon className="menu__arrow" aria-hidden />
                      ) : (
                        <KeyboardArrowDownIcon className="menu__arrow" aria-hidden />
                      )}
                    </button>
                    <ul
                      id={`menu-sub-${listItem._sectionId}-${listItem.id}`}
                      className={`menu__nested ${openDropdowns[dropdownKey(listItem._sectionId, listItem.id)] ? "menu__nested--open" : ""}`}
                      role="list"
                      aria-labelledby={`menu-btn-${listItem._sectionId}-${listItem.id}`}
                    >
                      {listItem.nestedItems.map((nestedItem) => (
                        <li key={nestedItem.id}>
                          <Link
                            to={nestedItem.url}
                            className={`menu__link menu__link--nested ${
                              location.pathname === nestedItem.url
                                ? "menu__link--active"
                                : ""
                            }`}
                            aria-current={
                              location.pathname === nestedItem.url
                                ? "page"
                                : undefined
                            }
                          >
                            <MenuIcon name={nestedItem.icon} />
                            <span>{nestedItem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={listItem.url || "#"}
                    className={`menu__link ${
                      location.pathname === listItem.url
                        ? "menu__link--active"
                        : ""
                    }`}
                    aria-current={
                      location.pathname === listItem.url ? "page" : undefined
                    }
                  >
                    <MenuIcon name={listItem.icon} />
                    <span>{listItem.title}</span>
                  </Link>
                )}
              </li>
            ))}
      </ul>
    </nav>
  );
};

export default Menu;
