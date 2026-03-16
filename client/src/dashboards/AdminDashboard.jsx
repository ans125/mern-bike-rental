import { useEffect, useState } from "react";
import { getAdminStats } from "../services/adminService";

const AdminDashboard = () => {

  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getAdminStats();
      setStats(res.data);
    };

    fetchStats();
  }, []);

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="row">

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h5>Total Users</h5>
            <h3>{stats.users}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h5>Providers</h5>
            <h3>{stats.providers}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h5>Bikes</h5>
            <h3>{stats.bikes}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow">
            <h5>Bookings</h5>
            <h3>{stats.bookings}</h3>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;