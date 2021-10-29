import { Button, Tooltip } from "@material-ui/core";
import axios from "axios";
import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import { useAuth } from "../Contexts/AuthContext";
import moment from "moment";
import { ChatBubbleOutlined } from "@material-ui/icons";
import AlertBox from "../Components/AlertBox";
import { useHistory } from "react-router";

const Tasks = () => {
  const { auth } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const columns = [
    { title: "Task Name", field: "taskName" },
    { title: "Project Name", field: "projectName" },
    { title: "Task Desc", field: "taskDesc" },
    { title: "Task Deadline", field: "taskDeadline" },
    {
      field: "Task Chat",
      title: "Chat",
      render: (rowData) => {
        return (
          <Tooltip title="Task Chat/Comments">
            <Button
              variant="contained"
              color="primary"
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

  if (auth?.role !== "employee")
    columns.push({
      field: "Task Status",
      title: "Status",
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
        const updatedTimeFormat = data.userIncludedTasks.map((task) => {
          return {
            ...task,
            taskDeadline: capitalizeFirstLetter(
              moment(task.taskDeadline).fromNow()
            ),
          };
        });
        if (mounted) {
          setTasks(updatedTimeFormat);
          setLoading(false);
        }
      } catch (err) {
        if (err.response && err.response.data.message) {
          alert(err.response.data.message || err.message);
          setLoading(false);
        }
      }
    };
    getTasks();
    return () => {
      mounted = false;
    };
  }, [auth]);

  const taskStatusHandler = async (data) => {
    try {
      const res = await axios.post("/api/tasks/updatestatus", data, {
        headers: {
          Authorization: auth?.token,
        },
      });
      let filteredTasks = tasks.filter(
        (task) => task._id !== res.data.updatedTask._id
      );
      const updatedTimeFormat = {
        ...res.data.updatedTask,
        taskDeadline: capitalizeFirstLetter(
          moment(res.data.updatedTask.taskDeadline).fromNow()
        ),
      };
      setTasks([...filteredTasks, updatedTimeFormat]);
    } catch (err) {
      if (err.response && err.response.data.message) {
        alert(err.response.data.message || err.message);
      }
    }
  };

  const onDeleteHandler = async (data) => {
    let result = window.confirm(
      "You want to delete " +
        data.taskName +
        " from the project " +
        data.projectName
    );
    if (result) {
      try {
        const res = await axios.delete("/api/tasks/deletetask/" + data._id, {
          headers: {
            Authorization: auth?.token,
          },
        });
        alert(res.data.message);
        const filterTasks = tasks.filter((task) => task._id !== data._id);
        setTasks(filterTasks);
      } catch (err) {
        if (err.response && err.response.data.message) {
          alert(err.response.data.message);
        }
      }
    }
  };

  if (loading) {
    return <Loading loading={loading} />;
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
        data={tasks}
        options={{ sorting: true, actionsColumnIndex: -1 }}
        title="Tasks"
        actions={[
          // {
          //   icon: "edit",
          //   iconProps: { color: "primary" },
          //   tooltip: "Edit Task",
          //   onClick: (event, rowData) => {
          //     history.push({
          //       pathname: "/edittask",
          //       state: { taskData: rowData },
          //     });
          //   },
          // },
          auth?.role !== "employee" && {
            icon: "delete",
            iconProps: { color: "primary", fontSize: "large" },
            tooltip: "Delete Task",
            onClick: (event, rowData) => onDeleteHandler(rowData),
          },
        ]}
      />
    );
  }
};

export default Tasks;