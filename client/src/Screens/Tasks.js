import { Button, Tooltip } from "@material-ui/core";
import axios from "axios";
import MaterialTable from "material-table";
import React, { forwardRef, useEffect, useState } from "react";
import Loading from "../Components/Loading";
import { useAuth } from "../Contexts/AuthContext";
import moment from "moment";
import {
  ChatBubbleOutlined,
  DeleteOutline,
  EditOutlined,
} from "@material-ui/icons";
import AlertBox from "../Components/AlertBox";
import { useHistory } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      editable: "never",
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
    Edit: forwardRef((props, ref) => (
      <EditOutlined {...props} ref={ref} style={{ fontSize: 32 }} />
    )),
  };

  if (auth?.role !== "employee")
    columns.push({
      field: "Task Status",
      title: "Status",
      editable: "never",
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
        toast.error(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
      }
    }
  };

  const onDeleteHandler = async (data, resolve) => {
    try {
      await axios.delete("/api/tasks/deletetask/" + data._id, {
        headers: {
          Authorization: auth?.token,
        },
      });
      const filterTasks = tasks.filter((task) => task._id !== data._id);
      setTasks(filterTasks);
      resolve();
    } catch (err) {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      resolve();
    }
  };

  const onTaskUpdateHandler = async (newData, oldData, resolve) => {
    const { _id, taskName, taskDesc, taskDeadline, projectName } = newData;
    try {
      const res = await axios.patch(
        "/api/tasks/updatetask",
        { _id, taskName, taskDesc, taskDeadline, projectName },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      let filteredTasks = tasks.filter(
        (task) => task._id !== res.data.updatedTask._id
      );
      setTasks([...filteredTasks, res.data.updatedTask]);
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
      <>
        <ToastContainer />
        <MaterialTable
          style={{ padding: "20px" }}
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
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve) =>
                  onTaskUpdateHandler(newData, oldData, resolve)
                ),
            }
          }
        />
      </>
    );
  }
};

export default Tasks;
