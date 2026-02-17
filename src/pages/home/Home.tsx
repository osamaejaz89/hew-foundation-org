import { Button } from "@mui/material";
import ChartBox from "../../components/chartBox/ChartBox";
import TopUsers from "../../components/topUsers/TopUsers";
import "./home.scss";
import { useUserApi } from "../../hooks/useUserApi";
import { useDonations } from "../../pages/donations/useDonationApi";

const Home = () => {
  const { getUsers } = useUserApi();
  const { data: donations = [], refetch: refetchDonations, isFetching: donationsFetching } = useDonations();
  const users = getUsers.data?.data || [];
  const isRefreshing = getUsers.isFetching || donationsFetching;
  const handleRefresh = () => {
    getUsers.refetch();
    refetchDonations();
  };

  const totalUsersBox = {
    number: users.length.toString(),
    percentage: 0,
    color: "#3b82f6",
    icon: "/userIcon.svg",
    title: "Total Users",
    dataKey: "users",
    to: "/users",
    chartData: [
      { name: "Sun", users: 0 },
      { name: "Mon", users: 0 },
      { name: "Tue", users: 0 },
      { name: "Wed", users: 0 },
      { name: "Thu", users: 0 },
      { name: "Fri", users: 0 },
      { name: "Sat", users: 0 },
    ],
  };

  const totalDonationsBox = {
    number: donations.length.toString(),
    percentage: 0,
    color: "#10b981",
    icon: "/userIcon.svg",
    title: "Total Donations",
    dataKey: "count",
    to: "/donations",
    chartData: [
      { name: "Sun", count: 0 },
      { name: "Mon", count: 0 },
      { name: "Tue", count: 0 },
      { name: "Wed", count: 0 },
      { name: "Thu", count: 0 },
      { name: "Fri", count: 0 },
      { name: "Sat", count: 0 },
    ],
  };

  return (
    <div className="home">
      <div style={{ position: "absolute", top: 12, right: 12 }}>
        <Button variant="outlined" size="small" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? "Refreshing…" : "Refresh"}
        </Button>
      </div>
      <div className="box box1">
        <TopUsers />
      </div>
      <div className="box box2">
        <ChartBox {...totalUsersBox} />
      </div>
      <div className="box box3">
        <ChartBox {...totalDonationsBox} />
      </div>
    </div>
  );
};

export default Home;
