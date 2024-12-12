import "./navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <img
          src="hewLogo.jpeg"
          alt=""
          width={26}
          height={26}
          style={{ borderRadius: 70, alignItems: "center" }}
        />
        <span>Hew Foundation</span>
      </div>
      <div className="icons">
        {/* <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <img src="/expand.svg" alt="" className="icon" />
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div> */}
        <div className="user">
        <img
          src="hewLogo.jpeg"
          alt=""
          width={26}
          height={26}
          style={{ borderRadius: 70, alignItems: "center" }}
        />
          <span>Admin</span>
        </div>
        {/* <img src="/settings.svg" alt="" className="icon" /> */}
      </div>
    </div>
  );
};

export default Navbar;
