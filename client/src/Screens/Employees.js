import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { useAuth } from "../Contexts/AuthContext";
import axios from "axios";
import Loading from "../Components/Loading";
import AlertBox from "../Components/AlertBox";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { auth } = useAuth();

  const columns = [
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Designation", field: "designation" },
    {
      field: "url",
      title: "Avatar",
      render: (rowData) =>
        auth.role === "superAdmin" ? (
          <Button
            variant="contained"
            color={rowData.role === "employee" ? "primary" : "secondary"}
            onClick={() =>
              rowData.role === "employee"
                ? makeAdminHandler(rowData)
                : removeAdminHandler(rowData)
            }
          >
            {rowData.role === "employee"
              ? "Make an Admin"
              : "Remove from Admin"}
          </Button>
        ) : null,
    },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const getEmployees = async () => {
      try {
        const { data } = await axios.get("/api/company/getemployees", {
          headers: {
            Authorization: auth?.token,
          },
        });
        const updatedEmployess = data.employees.filter(
          (emp) => emp.role !== "superAdmin"
        );
        if (mounted) {
          setEmployees(updatedEmployess);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
      }
    };
    getEmployees();
    return () => {
      mounted = false;
    };
  }, [auth]);

  const makeAdminHandler = async (rowData) => {
    try {
      const { data } = await axios.post(
        "/api/company/makeanadmin",
        { id: rowData._id },
        { headers: { Authorization: auth?.token } }
      );
      let emp = employees.filter((x) => x._id !== data.updatedUser._id);
      setEmployees([...emp, data.updatedUser]);
    } catch (err) {
      alert(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  const removeAdminHandler = async (rowData) => {
    try {
      const { data } = await axios.post(
        "/api/company/removeanadmin",
        { id: rowData._id },
        { headers: { Authorization: auth?.token } }
      );
      let emp = employees.filter((x) => x._id !== data.updatedUser._id);
      setEmployees([...emp, data.updatedUser]);
    } catch (err) {
      alert(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  if (loading) {
    return <Loading loading={loading} />;
  } else if (error) {
    return <AlertBox severity="error" errorMessage={error} />;
  } else {
    return (
      <MaterialTable columns={columns} data={employees} title="Employees" />
    );
  }
};

export default Employees;
