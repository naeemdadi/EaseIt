import React, { useEffect, useState } from "react";
import {
  Button,
  FormHelperText,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import { AddCircle, RemoveCircle } from "@material-ui/icons";
import Loading from "../Components/Loading";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  textFieldContainer: {
    display: "flex",
    gap: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  formField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const NewTask = () => {
  const classes = useStyles();
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
        // const admin = data.employees.find((emp) => emp.role === "admin");
        const superAdmin = data.employees.find(
          (emp) => emp.role === "superAdmin"
        );
        if (mounted) {
          setEmployees(data.employees);
          setMembers([superAdmin._id]);
          setLoading(false);
        }
      } catch (err) {
        alert(err.response.data.message);
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
      members.length === 0
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
      alert(err.response.data.message);
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

      <form
        noValidate
        autoComplete="off"
        className={classes.form}
        onSubmit={onSubmitHandler}
      >
        <div className={classes.textFieldContainer}>
          <TextField
            fullWidth
            label="Task Name"
            variant="outlined"
            color="primary"
            className={classes.formField}
            required
            onChange={onChangeHandler("taskName")}
            error={error && !data.taskName}
            helperText={
              error && !data.taskName ? "Task Name is Required Field" : null
            }
            onFocus={() => setError(false)}
          />
          <TextField
            fullWidth
            label="Project Name"
            variant="outlined"
            color="primary"
            className={classes.formField}
            required
            onChange={onChangeHandler("projectName")}
            error={error && !data.projectName}
            helperText={
              error && !data.projectName
                ? "Project Name is Required Field"
                : null
            }
            onFocus={() => setError(false)}
          />
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              inputVariant="outlined"
              format="MMMM Do YYYY"
              disablePast
              openTo="date"
              required
              fullWidth
              orientation="landscape"
              label="Task Deadline"
              views={["year", "month", "date"]}
              value={data.taskDeadline}
              className={classes.formField}
              onChange={handleDateChange("taskDeadline")}
            />
          </MuiPickersUtilsProvider>
        </div>
        <TextField
          fullWidth
          label="Task Description"
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          multiline
          rows={4}
          onChange={onChangeHandler("taskDesc")}
          error={error && !data.taskDesc}
          helperText={
            error && !data.taskDesc
              ? "Task Description is Required Field"
              : null
          }
          onFocus={() => setError(false)}
        />

        <Typography
          variant="h6"
          color="textSecondary"
          component="h2"
          style={{ paddingTop: "8px" }}
        >
          Add Members to Task
        </Typography>
        <FormHelperText color="textSecondary">
          Superadmin have access to all the Tasks, employees have access to only
          tasks they are assigned to.
        </FormHelperText>
        {loading ? (
          <Loading loading={loading} />
        ) : (
          employees.map((employee) => {
            if (employee.role !== "superAdmin") {
              return (
                <div
                  key={employee._id}
                  className={classes.textFieldContainer}
                  style={{ alignItems: "center" }}
                >
                  <TextField
                    fullWidth
                    label="Name"
                    value={employee.name}
                    variant="standard"
                    className={classes.formField}
                    disabled
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    variant="standard"
                    color="primary"
                    value={employee.email}
                    className={classes.formField}
                    disabled
                  />
                  <TextField
                    label="Designation"
                    variant="standard"
                    fullWidth
                    value={employee.designation}
                    color="primary"
                    className={classes.formField}
                    disabled
                  />
                  {!members.includes(employee._id) ? (
                    <Tooltip title="Add to Task">
                      <Button onClick={() => onClickAddHandler(employee._id)}>
                        <AddCircle fontSize="large" color="primary" />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Remove from Task">
                      <Button
                        onClick={() => onClickRemoveHandler(employee._id)}
                      >
                        <RemoveCircle fontSize="large" color="error" />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              );
            } else {
              return null;
            }
          })
        )}

        <div>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            className={classes.formField}
            size="large"
          >
            Submit
          </Button>
          {error && members.length === 0 && (
            <Typography color="error">Choose atleast one Member</Typography>
          )}
        </div>
      </form>
    </>
  );
};

export default NewTask;