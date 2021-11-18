import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import Loading from "../Components/Loading";
import AlertBox from "../Components/AlertBox";
import TaskDetails from "../Components/TaskDetails";

const NewTask = () => {
  const history = useHistory();
  const { auth } = useAuth();

  const initialvalue = {
    taskName: "",
    projectName: "",
    taskDesc: "",
    taskDeadline: new Date(),
  };

  const [data, setData] = useState(initialvalue);
  const [error, setError] = useState(false);
  const [dataError, setDataError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [members, setMembers] = useState([]);

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
        const superAdmin = data.employees.find(
          (emp) => emp.role === "superAdmin"
        );
        if (mounted) {
          setEmployees(data.employees);
          setMembers([superAdmin._id]);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        setDataError(
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

  const onChangeHandler = (input) => (e) => {
    if ([input] === "taskName" || "projectName") {
      setData({
        ...data,
        [input]: capitalizeFirstLetter(e.target.value),
      });
    } else {
      setData({
        ...data,
        [input]: e.target.value,
      });
    }
  };

  const onClickAddHandler = (id) => {
    setMembers([...members, id]);
  };

  const onClickRemoveHandler = (id) => {
    const filteredMembers = members.filter((member) => member !== id);
    setMembers(filteredMembers);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (
      !data.taskName ||
      !data.projectName ||
      !data.taskDesc ||
      !data.taskDeadline ||
      members.length <= 1
    ) {
      setError(true);
      return;
    }

    try {
      const res = await axios.post(
        "/api/tasks/newtask",
        { data, companyId: auth.companyId, members },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      if (res.data) history.push("/");
    } catch (err) {
      alert(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  const handleDateChange = (input) => (e) => {
    setData({
      ...data,
      [input]: e,
    });
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (loading) {
    return <Loading loading={loading} />;
  } else if (dataError) {
    return <AlertBox severity="error" errorMessage={dataError} />;
  } else {
    return (
      <>
        <Typography
          variant="h6"
          color="textSecondary"
          component="h2"
          gutterBottom
        >
          Add New Task
        </Typography>
        <TaskDetails
          onSubmitHandler={onSubmitHandler}
          onChangeHandler={onChangeHandler}
          handleDateChange={handleDateChange}
          onClickAddHandler={onClickAddHandler}
          onClickRemoveHandler={onClickRemoveHandler}
          employees={employees}
          members={members}
          error={error}
          setError={setError}
          data={data}
        />
      </>
    );
  }
};

export default NewTask;
