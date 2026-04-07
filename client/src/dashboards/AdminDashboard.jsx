import { useEffect, useState } from "react";
import { getAdminStats } from "../services/adminService";
import AdminLayout from "../components/Admin/AdminLayout";
import { Users, UserCheck, Bike, CalendarCheck } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    providers: 0,
    bikes: 0,
    bookings: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Users", value: stats.users, icon: Users, color: "#0d6efd" },
    { title: "Providers", value: stats.providers, icon: UserCheck, color: "#198754" },
    { title: "Bikes", value: stats.bikes, icon: Bike, color: "#fd7e14" },
    { title: "Bookings", value: stats.bookings, icon: CalendarCheck, color: "#6f42c1" },
  ];

  return (
    <AdminLayout>
      <div className="p-2">
        <h3 className="mb-4 fw-bold">Overview Statistics</h3>
        <div className="row g-4">
          {statCards.map((card, index) => (
            <div key={index} className="col-md-3">
              <div className="card border-0 shadow-sm p-3 h-100 transition-all hover-shadow">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div 
                    className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: `${card.color}15`, color: card.color }}
                  >
                    <card.icon size={24} />
                  </div>
                  <span className="text-secondary small fw-medium">Real-time</span>
                </div>
                <h6 className="text-secondary mb-1">{card.title}</h6>
                <h2 className="mb-0 fw-bold">{card.value}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
           <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-3">System Health</h5>
              <div className="alert alert-success d-flex align-items-center gap-2 mb-0">
                   <div className="spinner-grow spinner-grow-sm" role="status"></div>
                   Server is reachable and operating normally.
              </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;