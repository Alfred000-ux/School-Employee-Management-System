import React, { useEffect, useState } from "react";
import EmployeeService from "../services/EmployeeService";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  // Load employees from the backend/API when the page loads
  useEffect(() => {
    EmployeeService.getAllEmployees()
      .then((response) => {
        setEmployees(response);
      })
      .catch((error) => {
        console.error("Error loading employees:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        School Employee List
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
        }}
        border="1"
      >
        <thead style={{ backgroundColor: "#0a630a", color: "white" }}>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Department</th>
            <th>Position</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>

        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.fullName}</td>
                <td>{emp.department}</td>
                <td>{emp.position}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;