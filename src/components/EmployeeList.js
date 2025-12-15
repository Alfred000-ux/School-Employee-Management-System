import React, { useEffect, useState } from "react";
import EmployeeService from "../services/EmployeeService";
import { useAuth } from "../contexts/AuthContext";

function EmployeeList() {
  const { isAdmin } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchEmployees = async () => {
    try {
      const data = await EmployeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🔍 Search & Filter
  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "all" || emp.department === department;

    return matchesSearch && matchesDepartment;
  });

  // 📄 Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ❌ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await EmployeeService.deleteEmployee(id);
      fetchEmployees();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>School Employee Management</h2>

      {/* SEARCH & FILTER */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="all">All Departments</option>
          <option value="Mathematics">Mathematics</option>
          <option value="English">English</option>
          <option value="Science">Science</option>
          <option value="History">History</option>
          <option value="Arts">Arts</option>
        </select>
      </div>

      {/* EMPLOYEE TABLE */}
      <table border="1" width="100%" cellPadding="10">
        <thead style={{ backgroundColor: "#1976d2", color: "white" }}>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Department</th>
            <th>Position</th>
            <th>Email</th>
            <th>Phone</th>
            {isAdmin() && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {paginatedEmployees.length ? (
            paginatedEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.firstName} {emp.lastName}</td>
                <td>{emp.department}</td>
                <td>{emp.position}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>

                {isAdmin() && (
                  <td>
                    <button>Edit</button>{" "}
                    <button onClick={() => handleDelete(emp.id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" align="center">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div style={{ marginTop: "15px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              marginRight: "5px",
              backgroundColor: currentPage === i + 1 ? "#1976d2" : "#eee",
              color: currentPage === i + 1 ? "white" : "black",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmployeeList;
