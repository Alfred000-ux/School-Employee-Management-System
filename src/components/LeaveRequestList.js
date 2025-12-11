import React, { useEffect, useState } from "react";
import LeaveService from "../services/LeaveService";

function LeaveRequestList() {
const [requests, setRequests] = useState([]);

useEffect(() => {
LeaveService.getAllLeaveRequests()
.then((res) => setRequests(res))
.catch((err) => console.error("Error loading leaves:", err));
}, []);

return (
<div style={{ padding: "20px" }}>
<h2>Leave Requests</h2>

<table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
<thead style={{ backgroundColor: "#0a630a", color: "white" }}>
<tr>
<th>ID</th>
<th>Employee Name</th>
<th>Type</th>
<th>Start Date</th>
<th>End Date</th>
<th>Status</th>
</tr>
</thead>

<tbody>
{requests.length > 0 ? (
requests.map((req) => (
<tr key={req.id}>
<td>{req.id}</td>
<td>{req.employeeName}</td>
<td>{req.type}</td>
<td>{req.startDate}</td>
<td>{req.endDate}</td>
<td>{req.status}</td>
</tr>
))
) : (
<tr>
<td colSpan="6" style={{ textAlign: "center" }}>
No leave requests found.
</td>
</tr>
)}
</tbody>
</table>
</div>
);
}

export default LeaveRequestList;