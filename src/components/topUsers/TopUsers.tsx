import "./topUsers.scss";
import { useUserApi } from "../../hooks/useUserApi";

const TopUsers = () => {
  const { getUsers } = useUserApi();
  const users = getUsers.data?.data || [];
  const topUsers = users.slice(0, 7); // Get first 7 users

  return (
    <div className="top-users">
      <h2>Top Users</h2>
      <div className="list">
        {topUsers.map((user) => (
          <div className="list-item" key={user._id}>
            <div className="user">
              <img src="/noavatar.png" alt="" />
              <div className="user-info">
                <span className="username">{user.name}</span>
                <span className="email">{user.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUsers; 