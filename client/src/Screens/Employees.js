import { Avatar, Button } from "@material-ui/core";
import React, { forwardRef, useEffect, useState } from "react";
import MaterialTable from "material-table";
import { useAuth } from "../Contexts/AuthContext";
import axios from "axios";
import Loading from "../Components/Loading";
import AlertBox from "../Components/AlertBox";
import { deepOrange } from "@material-ui/core/colors";
import { EditOutlined } from "@material-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { auth } = useAuth();

  const columns = [
    {
      title: "Avatar",
      sorting: false,
      editable: "never",
      render: (rowData) =>
        rowData.url ? (
          <Avatar alt={rowData.name} src={rowData.url} />
        ) : (
          <Avatar
            style={{ backgroundColor: deepOrange[500], fontSize: "14px" }}
          >
            {rowData.name.split(" ")[0].slice(0, 2)}
          </Avatar>
        ),
    },
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Designation", field: "designation" },
    {
      title: "Role",
      editable: "never",
      customSort: (a, b) => (a.role === "admin") - (b.role === "admin"),
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

  const tableIcons = {
    Edit: forwardRef((props, ref) => (
      <EditOutlined {...props} ref={ref} style={{ fontSize: 32 }} />
    )),
  };

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
      toast.error(
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
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  const updateEmployeeData = async (newData, oldData, resolve) => {
    const { companyId, designation, email, name, _id } = newData;
    try {
      const res = await axios.patch(
        "/api/users/updateEmployee",
        { companyId, designation, email, name, _id },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      let filteredEmployees = employees.filter(
        (emp) => emp._id !== res.data._id
      );
      setEmployees([...filteredEmployees, res.data]);
    } catch (err) {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
    resolve();
  };

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <AlertBox severity="error" errorMessage={error} />;
  } else {
    return (
      <>
        <ToastContainer />
        <MaterialTable
          style={{ padding: "20px" }}
          columns={columns}
          icons={tableIcons}
          data={employees}
          title="Employees"
          options={{ sorting: true, actionsColumnIndex: -1 }}
          editable={
            auth.role === "superAdmin" && {
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) =>
                  updateEmployeeData(newData, oldData, resolve)
                ),
            }
          }
        />
      </>
    );
  }
};

export default Employees;
