import { useEffect, useState } from "react";
import { authFetch } from "../../utils/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function SalesGraph() {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await authFetch(
          "http://localhost:5000/api/admin/sales-graph"
        );
        const data = await res.json();

        const monthNames = [
          "",
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ];

        const formatted = data.map(item => ({
          date: monthNames[item._id],
          total: item.totalRevenue
        }));

        setSalesData(formatted);

      } catch (error) {
        console.error("Sales graph error:", error);
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="dashboard-card">
      <h3>Sales Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#5d5bc9"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesGraph;