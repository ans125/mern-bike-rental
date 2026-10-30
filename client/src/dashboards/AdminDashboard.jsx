import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList,
} from "recharts";
import { Users, UserCheck, Bike, CalendarCheck, Wallet, Landmark, ShieldCheck, Inbox } from "lucide-react";
import { getAdminStats } from "../services/adminService";
import AdminLayout from "../components/Admin/AdminLayout";

// Chart tokens: one brand hue for single-series charts, recessive grid, text in ink colours
const SERIES = "#198754";
const GRID = "#e9ecef";
const INK_MUTED = "#6c757d";

const STATUS_LABEL = {
  pending: "Pending", approved: "Accepted", ongoing: "On ride", completed: "Completed", rejected: "Rejected", cancelled: "Cancelled",
};

const compactRs = (v) => (v >= 1000 ? `${Math.round(v / 1000)}K` : `${v}`);

const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="bg-white border rounded shadow-sm p-2 small">
      <div className="fw-bold mb-1">{label}</div>
      <div>Revenue: <strong>Rs. {row.revenue.toLocaleString()}</strong></div>
      <div>Platform earnings (10%): Rs. {row.platformEarnings.toLocaleString()}</div>
      <div className="text-muted">{row.bookings} accepted bookings</div>
    </div>
  );
};

const StatusTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="bg-white border rounded shadow-sm p-2 small">
      <strong>{row.label}</strong>: {row.count} bookings
    </div>
  );
};

// Card with a chart or, on request, the same numbers as a table
const ChartCard = ({ title, subtitle, table, children }) => {
  const [showTable, setShowTable] = useState(false);
  return (
    <div className="card border-0 shadow-sm p-4 h-100">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 className="fw-bold mb-0">{title}</h5>
          <div className="small text-muted">{subtitle}</div>
        </div>
        <Button size="sm" variant="outline-secondary" onClick={() => setShowTable(!showTable)}>
          {showTable ? "Chart" : "Table"}
        </Button>
      </div>
      {showTable ? table : children}
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0, providers: 0, pendingVerifications: 0, bikes: 0, bookings: 0, openMessages: 0,
    revenue: 0, platformEarnings: 0, monthly: [], bookingsByStatus: [],
  });

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch stats", err));
  }, []);

  const statCards = [
    { title: "Customers", value: stats.users, icon: Users, color: "#0d6efd", link: "/admin/users" },
    { title: "Providers", value: stats.providers, icon: UserCheck, color: "#198754", link: "/admin/users" },
    { title: "Bikes", value: stats.bikes, icon: Bike, color: "#fd7e14", link: "/admin/bikes" },
    { title: "Bookings", value: stats.bookings, icon: CalendarCheck, color: "#6f42c1", link: "/admin/bookings" },
    { title: "Rental Revenue", value: `Rs. ${stats.revenue.toLocaleString()}`, icon: Wallet, color: "#20c997" },
    { title: "Platform Earnings (10%)", value: `Rs. ${stats.platformEarnings.toLocaleString()}`, icon: Landmark, color: "#198754" },
    { title: "Pending Verifications", value: stats.pendingVerifications, icon: ShieldCheck, color: "#ffc107", link: "/admin/verifications" },
    { title: "Open Support Messages", value: stats.openMessages, icon: Inbox, color: "#dc3545", link: "/admin/messages" },
  ];

  const statusData = stats.bookingsByStatus.map((s) => ({ ...s, label: STATUS_LABEL[s.status] || s.status }));

  return (
    <AdminLayout>
      <div className="p-2">
        <h3 className="mb-4 fw-bold">Overview Statistics</h3>
        <div className="row g-4">
          {statCards.map((card) => (
            <div key={card.title} className="col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm p-3 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="rounded-circle p-3 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                    <card.icon size={24} />
                  </div>
                  {card.link && <Link to={card.link} className="small text-decoration-none">View</Link>}
                </div>
                <h6 className="text-secondary mb-1">{card.title}</h6>
                <h3 className="mb-0 fw-bold">{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4 mt-1">
          <div className="col-lg-7">
            <ChartCard
              title="Rental revenue"
              subtitle="Accepted bookings by month of pick-up, last 6 months"
              table={
                <Table size="sm" className="mb-0">
                  <thead><tr><th>Month</th><th className="text-end">Revenue</th><th className="text-end">Platform 10%</th><th className="text-end">Bookings</th></tr></thead>
                  <tbody>
                    {stats.monthly.map((m) => (
                      <tr key={m.month}>
                        <td>{m.month}</td>
                        <td className="text-end">Rs. {m.revenue.toLocaleString()}</td>
                        <td className="text-end">Rs. {m.platformEarnings.toLocaleString()}</td>
                        <td className="text-end">{m.bookings}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              }
            >
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.monthly} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke={GRID} />
                    <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: GRID }} tick={{ fill: INK_MUTED, fontSize: 12 }} />
                    <YAxis tickFormatter={compactRs} tickLine={false} axisLine={false} tick={{ fill: INK_MUTED, fontSize: 12 }} width={44} />
                    <Tooltip content={<RevenueTooltip />} cursor={{ fill: "#19875410" }} />
                    <Bar dataKey="revenue" fill={SERIES} barSize={24} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="col-lg-5">
            <ChartCard
              title="Bookings by status"
              subtitle="All bookings on the platform"
              table={
                <Table size="sm" className="mb-0">
                  <thead><tr><th>Status</th><th className="text-end">Bookings</th></tr></thead>
                  <tbody>
                    {statusData.map((s) => (
                      <tr key={s.status}><td>{s.label}</td><td className="text-end">{s.count}</td></tr>
                    ))}
                  </tbody>
                </Table>
              }
            >
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 0 }}>
                    <CartesianGrid horizontal={false} stroke={GRID} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#212529", fontSize: 12 }} width={82} />
                    <Tooltip content={<StatusTooltip />} cursor={{ fill: "#19875410" }} />
                    <Bar dataKey="count" fill={SERIES} barSize={18} radius={[0, 4, 4, 0]}>
                      <LabelList dataKey="count" position="right" fill={INK_MUTED} fontSize={12} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>

        <div className="mt-4">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-2">Earning model</h5>
            <p className="text-muted mb-0">
              Revenue and earnings count bookings that providers accepted (accepted, on ride or completed). RideRent keeps a 10%
              commission on each; the remaining 90% is the provider's earning.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
