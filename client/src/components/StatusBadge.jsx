import { Badge } from "react-bootstrap";

// One place that turns a booking into a coloured status label for every dashboard
const STYLES = {
  pending: { bg: "warning", text: "dark", label: "Pending" },
  approved: { bg: "success", label: "Accepted" },
  ongoing: { bg: "primary", label: "On ride" },
  completed: { bg: "info", text: "dark", label: "Completed" },
  rejected: { bg: "danger", label: "Rejected" },
  cancelled: { bg: "secondary", label: "Cancelled" },
  expired: { bg: "secondary", label: "Not picked up" },
};

const getBookingStatus = (booking) => {
  // Accepted but never handed over before the end date
  if (booking.status === "approved" && new Date(booking.endDate) < new Date(new Date().setHours(0, 0, 0, 0))) return "expired";
  return booking.status || "pending";
};

const StatusBadge = ({ booking }) => {
  const style = STYLES[getBookingStatus(booking)] || STYLES.pending;
  return (
    <Badge bg={style.bg} text={style.text} className="rounded-pill px-3">
      {style.label}
    </Badge>
  );
};

export default StatusBadge;
