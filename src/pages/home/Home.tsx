import BarChartBox from "../../components/barChartBox/BarChartBox";
import BigChartBox from "../../components/bigChartBox/BigChartBox";
import ChartBox from "../../components/chartBox/ChartBox";
import PieChartBox from "../../components/pieCartBox/PieChartBox";
import TopBox from "../../components/topBox/TopBox";
import TopUsers from "../../components/topUsers/TopUsers";
import {
  barChartBoxRevenue,
  barChartBoxVisit,
  chartBoxConversion,
  chartBoxProduct,
  chartBoxRevenue,
  chartBoxUser,
} from "../../data";
import "./home.scss";
import { useUserApi } from "../../hooks/useUserApi";

const Home = () => {
  const { getUsers } = useUserApi();
  const users = getUsers.data?.data || [];
  
  // Create chartBoxUser with real data
  const userChartBox = {
    ...chartBoxUser,
    number: users.length.toString(),  // Convert total users to string
    percentage: ((users.length / 100) * 100).toFixed(0),  // Calculate percentage
  };

  return (
    <div className="home">
      <div className="box box1">
        <TopUsers />
      </div>
      <div className="box box2">
        <ChartBox {...userChartBox} />
      </div>
      <div className="box box3">
        <ChartBox {...chartBoxProduct} />
      </div>
      <div className="box box4">
        <PieChartBox />
      </div>
      <div className="box box5">
        <ChartBox {...chartBoxConversion} />
      </div>
      <div className="box box6">
        <ChartBox {...chartBoxRevenue} />
      </div>
      <div className="box box7">
        <BigChartBox />
      </div>
      <div className="box box8">
        <BarChartBox {...barChartBoxVisit} />
      </div>
      <div className="box box9">
        <BarChartBox {...barChartBoxRevenue} />
      </div>
    </div>
  );
};

export default Home;
