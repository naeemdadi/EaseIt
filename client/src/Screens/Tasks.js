import { Button, Tooltip } from "@material-ui/core";
import axios from "axios";
import MaterialTable from "material-table";
import React, { forwardRef, useEffect, useState } from "react";
import Loading from "../Components/Loading";
import { useAuth } from "../Contexts/AuthContext";
import moment from "moment";
import { ChatBubbleOutlined, DeleteOutline } from "@material-ui/icons";
import AlertBox from "../Components/AlertBox";
import { useHistory } from "react-router";

const Tasks = () => {
  const { auth } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  const columns = [
    { title: "Task Name", field: "taskName" },
    { title: "Project Name", field: "projectName" },
    { title: "Task Desc", field: "taskDesc" },
    {
      title: "Task Deadline",
      field: "taskDeadline",
      render: (rowData) => {
        return capitalizeFirstLetter(moment(rowData.taskDeadline).fromNow());
      },
    },
    {
      field: "Task Chat",
      editable: false,
      title: "Chat",
      render: (rowData) => {
        return (
          <Tooltip title="Task Chat/Comments">
            <Button
              variant="contained"
              onClick={() =>
                history.push({ pathname: "/taskmessages", state: rowData })
              }
            >
              <ChatBubbleOutlined />
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  const tableIcons = {
    Delete: forwardRef((props, ref) => (
      <DeleteOutline {...props} ref={ref} style={{ fontSize: 32 }} />
    )),
  };

  if (auth?.role !== "employee")
    columns.push({
      field: "Task Status",
      title: "Status",
      editable: false,
      render: (rowData) => (
        <Button
          variant="contained"
          color={rowData.status === true ? "secondary" : "primary"}
          onClick={() => taskStatusHandler(rowData)}
          disabled={auth?.role === "employee"}
        >
          {rowData.status === true ? "Add to Incomplete" : "Mark Completed"}
        </Button>
      ),
    });

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const getTasks = async () => {
      try {
        const { data } = await axios.get("/api/tasks/gettasks", {
          headers: {
            Authorization: auth?.token,
          },
        });
        if (mounted) {
          setTasks(data.userIncludedTasks);
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
    getTasks();
    return () => {
      mounted = false;
    };
  }, [auth]);

  const taskStatusHandler = async (data) => {
    let result = window.confirm(
      "You want to change the status of " +
        data.taskName +
        " from the project " +
        data.projectName
    );
    if (result) {
      try {
        const res = await axios.patch("/api/tasks/updatestatus", data, {
          headers: {
            Authorization: auth?.token,
          },
        });
        let filteredTasks = tasks.filter(
          (task) => task._id !== res.data.updatedTask._id
        );
        setTasks([...filteredTasks, res.data.updatedTask]);
      } catch (err) {
        if (err.response && err.response.data.message) {
          alert(err.response.data.message);
        } else {
          alert(err.message);
        }
      }
    }
  };

  const onDeleteHandler = async (data, resolve) => {
    try {
      const res = await axios.delete("/api/tasks/deletetask/" + data._id, {
        headers: {
          Authorization: auth?.token,
        },
      });
      alert(res.data.message);
      const filterTasks = tasks.filter((task) => task._id !== data._id);
      setTasks(filterTasks);
      resolve();
    } catch (err) {
      if (err.response && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert(err.message);
      }
      resolve();
    }
  };

  if (loading) {
    return <Loading loading={loading} />;
  } else if (error) {
    return <AlertBox severity="error" errorMessage={error} />;
  } else {
    if (tasks.length === 0 && auth?.role !== "employee") {
      return <AlertBox errorMessage="Please Add Some Tasks" severity="info" />;
    }
    if (tasks.length === 0 && auth?.role === "employee") {
      return (
        <AlertBox
          errorMessage="You are not part of any of the Tasks."
          severity="info"
        />
      );
    }
    return (
      <MaterialTable
        columns={columns}
        icons={tableIcons}
        data={tasks}
        options={{ sorting: true, actionsColumnIndex: -1 }}
        title="Tasks"
        editable={
          auth.role !== "employee" && {
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                onDeleteHandler(oldData, resolve);
              }),
          }
        }
      />
    );
  }
};

export default Tasks;
