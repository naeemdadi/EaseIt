import {
  Button,
  CircularProgress,
  Container,
  makeStyles,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../Contexts/AuthContext";
import { useOrg } from "../Contexts/OrgContaxt";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const SelectFirm = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [loader, setLoader] = useState(false);
  const [joiningPassword, setJoinigPassword] = useState("");
  const loading = open && options.length === 0;

  const { setOrg } = useOrg();
  const { auth, setAuth } = useAuth();

  const classes = useStyles();

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const { data } = await axios.get("/api/company/list");

      if (active) {
        setOptions(data.companiesList);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  const onJoiningRequest = async () => {
    setLoader(true);
    try {
      const { data } = await axios.post(
        "/api/company/sendjoiningrequest",
        { selectedOption, joiningPassword },
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      setLoader(false);
      setOrg(data.updateCompanyData);
      setAuth({ ...auth, companyId: data.updateUserData.companyId });
      setOrg((prev) => {
        localStorage.setItem("orgInfo", JSON.stringify(prev));
        return prev;
      });
      setAuth((prev) => {
        localStorage.setItem("userInfo", JSON.stringify(prev));
        return prev;
      });
      handleClose();
    } catch (err) {
      setLoader(false);
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <ToastContainer />
      <Typography
        variant="h4"
        color="textSecondary"
        component="h2"
        gutterBottom
        align="center"
      >
        {/* <Link component={RouterLink} to="/selectfirm"> */}
        <Button onClick={handleOpen} variant="contained">
          Please select your employeement firm
        </Button>
        {/* </Link> */}
      </Typography>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Container maxWidth="xs" className={classes.paper}>
          <Autocomplete
            id="orgs-list"
            fullWidth
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            getOptionSelected={(option, value) =>
              option.uniqueId === value.uniqueId
            }
            onChange={(e, value) => setSelectedOption(value)}
            getOptionLabel={(option) => option.uniqueId}
            options={options}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Firm"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          {selectedOption ? (
            <TextField
              style={{ marginTop: "12px" }}
              label="Joining Password"
              type="password"
              variant="outlined"
              required
              fullWidth
              onChange={(e) => setJoinigPassword(e.target.value)}
            />
          ) : null}
          <Button
            type="submit"
            style={{ marginTop: "10px" }}
            fullWidth
            color="primary"
            variant="contained"
            className={classes.submit}
            disabled={!selectedOption || !joiningPassword}
            onClick={onJoiningRequest}
          >
            {loader ? <CircularProgress color="inherit" size="25px" /> : "Join"}
          </Button>
        </Container>
      </Modal>
    </>
  );
};

export default SelectFirm;
