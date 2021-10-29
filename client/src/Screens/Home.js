// import {
//   Box,
//   Container,
//   Grid,
//   Link,
//   makeStyles,
//   Paper,
//   Typography,
// } from "@material-ui/core";
// import { useAuth } from "../Contexts/AuthContext";
// import React from "react";
// import Chart from "../Components/Chart";
// import clsx from "clsx";
// import Deposits from "../Components/Deposits";
// import Orders from "../Components/Orders";
// import { Link as RouterLink } from "react-router-dom";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//   },
//   menuButton: {
//     marginRight: 36,
//   },
//   menuButtonHidden: {
//     display: "none",
//   },
//   title: {
//     flexGrow: 1,
//   },
//   appBarSpacer: theme.mixins.toolbar,
//   content: {
//     flexGrow: 1,
//     height: "100vh",
//     overflow: "auto",
//   },
//   container: {
//     paddingTop: theme.spacing(4),
//     paddingBottom: theme.spacing(4),
//   },
//   paper: {
//     padding: theme.spacing(2),
//     display: "flex",
//     overflow: "auto",
//     flexDirection: "column",
//   },
//   fixedHeight: {
//     height: 240,
//   },
// }));

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {"Copyright © "}
//       <Link component={RouterLink} color="inherit" to="/">
//         EaseIt
//       </Link>{" "}
//       {new Date().getFullYear()}
//       {"."}
//     </Typography>
//   );
// }

// const Home = () => {
//   const classes = useStyles();

//   const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

//   return (
//     <main className={classes.content}>
//       <div className={classes.appBarSpacer} />
//       <Container maxWidth="lg" className={classes.container}>
//         <Grid container spacing={3}>
//           {/* Chart */}
//           <Grid item xs={12} md={8} lg={9}>
//             <Paper className={fixedHeightPaper}>
//               <Chart />
//             </Paper>
//           </Grid>
//           {/* Recent Deposits */}
//           <Grid item xs={12} md={4} lg={3}>
//             <Paper className={fixedHeightPaper}>
//               <Deposits />
//             </Paper>
//           </Grid>
//           {/* Recent Orders */}
//           <Grid item xs={12}>
//             <Paper className={classes.paper}>
//               <Orders />
//             </Paper>
//           </Grid>
//         </Grid>
//         <Box pt={4}>
//           <Copyright />
//         </Box>
//       </Container>
//     </main>
//   );
// };

// export default Home;
