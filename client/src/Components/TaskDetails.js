import React from "react";
import {
  Button,
  FormHelperText,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { AddCircle, RemoveCircle } from "@material-ui/icons";

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

const TaskDetails = (props) => {
  const classes = useStyles();
  return (
    <form
      noValidate
      autoComplete="off"
      className={classes.form}
      onSubmit={props.onSubmitHandler}
    >
      <div className={classes.textFieldContainer}>
        <TextField
          fullWidth
          label="Task Name"
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          onChange={props.onChangeHandler("taskName")}
          error={props.error && !props.data.taskName}
          helperText={
            props.error && !props.data.taskName
              ? "Task Name is Required Field"
              : null
          }
          onFocus={() => props.setError(false)}
        />
        <TextField
          fullWidth
          label="Project Name"
          variant="outlined"
          color="primary"
          className={classes.formField}
          required
          onChange={props.onChangeHandler("projectName")}
          error={props.error && !props.data.projectName}
          helperText={
            props.error && !props.data.projectName
              ? "Project Name is Required Field"
              : null
          }
          onFocus={() => props.setError(false)}
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
            value={props.data.taskDeadline}
            className={classes.formField}
            onChange={props.handleDateChange("taskDeadline")}
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
        onChange={props.onChangeHandler("taskDesc")}
        error={props.error && !props.data.taskDesc}
        helperText={
          props.error && !props.data.taskDesc
            ? "Task Description is Required Field"
            : null
        }
        onFocus={() => props.setError(false)}
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
        Superadmin have access to all the Tasks. Admins and employees have
        access to only tasks they are assigned to.
      </FormHelperText>
      {props.employees.map((employee) => {
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
              {!props.members.includes(employee._id) ? (
                <Tooltip title="Add to Task">
                  <Button onClick={() => props.onClickAddHandler(employee._id)}>
                    <AddCircle fontSize="large" color="primary" />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Remove from Task">
                  <Button
                    onClick={() => props.onClickRemoveHandler(employee._id)}
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
      })}

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
        {props.error && props.members.length <= 1 && (
          <Typography color="error">Choose atleast one Member</Typography>
        )}
      </div>
    </form>
  );
};

export default TaskDetails;
