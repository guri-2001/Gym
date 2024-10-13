import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useEffect, useState } from 'react'
import style from '../styles/Dashboard.module.css'
// import { FaChevronDown } from "react-icons/fa";
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BarChart } from '@mui/x-charts/BarChart';
import { MdOutlineDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
import { FaInstagram } from "react-icons/fa";
import { GrLineChart } from "react-icons/gr";
// import { LineChart } from '@mui/x-charts/LineChart';

ChartJs.register(
  ArcElement, Tooltip, Legend
)

const drawerWidth = 250;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Dasboard() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [allusers, setAllUsers] = useState([])
  const [events, setEvents] = useState([])
  const [value, onChange] = useState(new Date())
  const [upcomingBirthdayUsers, setUpcomingBirthdayUsers] = useState([]);
  const [birthdays, setBirthdays] = useState([]);



  useEffect(() => {
    // Fetch the upcoming birthday users from the backend
    fetch(`${process.env.REACT_APP_URL}/upcoming-birthday-users`)
      .then((response) => response.json())
      .then((data) => {
        setUpcomingBirthdayUsers(data);
      })
      .catch((error) => console.error('Error fetching upcoming birthday users:', error));
  }, []);

  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // ===============get the users=====================


  const getUserData = async () => {
    const res = await axios.get(`${process.env.REACT_APP_URL}/getUsers`, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.data.status === 401 || !res.data) {
      console.log("errror")
    } else {
      setAllUsers(res.data.data)
    }
  }


  // ============format the date===============

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
  };

  const padZero = (num) => num.toString().padStart(2, '0');

  // =============get Events=============

  const getEvents = async () => {
    const res = await axios.get(`${process.env.REACT_APP_URL}/getAllEvents`, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.data.status === 401 || !res.data) {
      console.log("errror")
    } else {
      setEvents(res.data.data)
    }
  }



  useEffect(() => {
    // Fetch the data from the backend
    fetch(`${process.env.REACT_APP_URL}/birthdays`)
      .then(response => response.json())
      .then(data => setBirthdays(data))
      .catch(error => console.error('Error fetching birthdays:', error));
  }, []);



  // =============use Effect===========

  useEffect(() => {
    getUserData()
    // getAllUserData()
    getEvents()
  }, [])

  // ===========delete event============

  const handleDelete = async (id) => {
    await axios.delete(`${process.env.REACT_APP_URL}/deleteEvent/${id}`)
      .then(response => navigate(0))
      .catch(err => console.log(err));
  }

  const data = {
    datasets: [{
      data: [8, 5],
      backgroundColor: ['#52b202', 'white'],
      borderColor: ['#52b202', 'white'],
    }]
  }

  const data2 = {
    datasets: [{
      data: [12, 2],
      backgroundColor: ['#3e99e0', 'white'],
      borderColor: ['#3e99e0', 'white'],
    }]
  }

  const options = {}




  return (
    <>
      
        <Box sx={{ display: 'flex', background: "rgb(244, 244, 244)", height: "100%" }}>
          <CssBaseline />
          <AppBar position="fixed" open={open} sx={{ background: "#313e4b" }}>
            <Toolbar sx={{ width: "100%" }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                  {
                    mr: 2,
                  },
                  open && { display: 'none' },
                ]}
              >
                <MenuIcon />
              </IconButton>
              {/* ==================TopBar================ */}
              <TopBar />

            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: "#313e4b"
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose} sx={{ color: "#fff" }}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </DrawerHeader>

            {/* ===============Sidebar============== */}
            <Sidebar />

          </Drawer>
          <Main open={open}>
            <DrawerHeader />
            <section style={{ padding: "15px" }}>
              <div style={{ display: "flex", gap: "40px" }}>
                <div className={style.allUsers_main_div}>
                  <p>Quick Starts</p>
                  <div className={style.allUsers_div}>
                    <div className={style.inner_div}>
                      <h3 >All Members</h3>
                      <a href="/allclients">

                        <div style={{ width: "150px", height: "150px", position: "relative" }}>
                          <Doughnut
                            data={data2}
                            options={options}
                          />
                          <h5 style={{ position: "absolute", top: "64px", left: "50px", fontSize: "22px", fontWeight: "600", color: "#000" }}>80%</h5>
                        </div>
                      </a>
                    </div>
                    <div className={style.inner_div}>
                      <h3 style={{ margin: "0" }}>Monthly Income</h3>
                      {/* <span style={{ fontSize: "17px" }}>{users.length}</span> */}

                      <div style={{ width: "150px", height: "150px", position: "relative", marginTop: "20px" }}>
                        <Doughnut
                          data={data}
                          options={options}
                        ></Doughnut>
                        <h5 style={{ position: "absolute", top: "64px", left: "50px", fontSize: "22px", fontWeight: "600" }}>60%</h5>
                      </div>

                    </div>
                  </div>

                </div>
                <div className={style.bar_div}>
                  <h5>Client Growth</h5>
                  <BarChart
                    sx={{ background: "#fff" }}
                    xAxis={[{ scaleType: 'band', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'] }]}
                    series={[{ data: [2, 4, 5, 3, 6, 6.5, 4, 1, 2.5, 3.5, 5.1, 4.4] }]}
                    width={750}
                    height={300}
                  />
                </div>

              </div>

              {/* ================Recent Users=============== */}

              <div style={{ display: "flex", gap: "40px" }}>
                <TableContainer component={Paper} sx={{ maxWidth: 400, height: 400, borderRadius: "0" }}>
                  <div className={style.recent_user_heading}>Recent Users</div>
                  <Table sx={{
                    minWidth: 400, "& .MuiTableRow-root:hover": {
                      backgroundColor: "rgb(244, 244, 244)"
                    }
                  }} aria-label="simple table">
                    <TableBody>
                      {allusers.map((row) => (
                        <TableRow

                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                        >
                          <TableCell sx={{ display: "flex", gap: "20px", padding: "10px" }} className={style.recent_user_name_div} component="th" scope="row">
                            <img
                            // src={require(`https://gym-aeyn.onrender.com${row.image}`)}
                            src={`http://localhost:5000${row.image}`}
                            height={45}
                            width={45}
                            alt=""
                            style={{ objectFit: "cover", borderRadius: "50%" }} />
                            {row.name}</TableCell>
                          <TableCell align="right" style={{ padding: "10px" }} >{formatDate(row.dob)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>



                <div style={{ display: "flex", gap: "30px" }}>
                  {/* ===========social media div============ */}
                  <div>
                    <div className={style.insta_div}>
                      <h5><FaInstagram style={{ fontSize: "20px", marginRight: "5px" }} />Instagram</h5>

                      <div>
                        <a href="https://www.instagram.com/zenith.gym" target='blank'> <img src={`${process.env.PUBLIC_URL}/qrcode.png`} alt="qrCode" className={style.qrcode} /></a>
                        <h6>Followers</h6>
                        <p>5480<GrLineChart style={{ marginLeft: "5px" }} /></p>
                      </div>
                    </div>
                  </div>

                  <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>

                    {/* ==========Users Today Birthday=========== */}
                    <TableContainer component={Paper} sx={{ maxWidth: 400, height: "220px", borderRadius: "0", overflowX: "hidden", position: "relative" }}>
                      <div className={style.recent_user_heading} style={{background:"lightgray"}} >Today Birthdays</div>
                      <Table sx={{
                        minWidth: 400, "& .MuiTableRow-root:hover": {
                          backgroundColor: "#3e99e0",
                          transition: "all 0.5s"
                        }
                      }} aria-label="simple table">
                        <TableBody>
                          {birthdays.map((row) => {
                            return (
                              <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                              >

                                <TableCell className={style.event_title_div} sx={{
                                  display: "flex", justifyContent: "space-between", gap: "10px",
                                  "&:hover": {
                                    color: '#fff'
                                  },
                                  padding: "10px"
                                }} component="th" scope="row"> <span> <span className={style.event_title} >{row.name}</span> <br /> <span className={style.event_date}>{row.mobileno}</span> </span> <span>{formatDate(row.dob)}</span> </TableCell>

                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>


                    {/* ==========Users upcomming birthdays============ */}

                    <TableContainer component={Paper} sx={{ maxWidth: 400, height: "200px", borderRadius: "0", overflowX: "hidden", position: "relative" }}>
                      <div className={style.recent_user_heading} style={{background:"lightgray"}}>Upcoming Birthdays</div>
                      <Table sx={{
                        minWidth: 400, "& .MuiTableRow-root:hover": {
                          backgroundColor: "#3e99e0",
                          transition: "all 0.5s"
                        }
                      }} aria-label="simple table">
                        <TableBody>
                          {upcomingBirthdayUsers == null ? <h4>No Upcomming Birthdays</h4> :
                            upcomingBirthdayUsers.map((row) => {
                              return (
                                <TableRow
                                  key={row.name}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                                >

                                  <TableCell className={style.event_title_div} sx={{
                                    display: "flex", justifyContent: "space-between", gap: "10px",
                                    "&:hover": {
                                      color: '#fff'
                                    },
                                    padding: "10px"
                                  }} component="th" scope="row"> <span> <span className={style.event_title} >{row.name}</span> <br /> <span className={style.event_date}>{row.mobileno}</span> </span> <span>{formatDate(row.dob)}</span> </TableCell>

                                </TableRow>
                              )
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>

              </div>

              {/* ==============Calendar============= */}
              <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>

                {/* ====calendar div====== */}

                <div className={style.calendar_div}>
                  {/* <div className={style.calendar_date}> {formatDate(value.toISOString())}</div> */}
                  <Calendar onChange={onChange} value={value} />
                </div>

                {/* <div style={{ background: "#fff", marginTop: "30px" }}>
              <h5 style={{padding:"10px 10px 0 10px"}}>Growth</h5>
              <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10, 11] }]}
                series={[
                  {
                    data: [2, 5, 4, 3.5, 1.5, 3, 4],
                    area: true,
                    baseline: 'min',
                  },
                ]}
                width={700}
                height={280}
              />
            </div> */}

                {/* ==============upcomming events=============== */}
                <TableContainer component={Paper} sx={{ maxWidth: 400, maxHeight: "400px", borderRadius: "0", overflowX: "hidden" }}>
                  <div className={style.recent_user_heading} style={{background:"lightgray"}}>Upcoming Events</div>
                  <Table sx={{
                    minWidth: 400, "& .MuiTableRow-root:hover": {
                      backgroundColor: "#3e99e0",
                      transition: "all 0.5s"
                    }
                  }} aria-label="simple table">
                    <TableBody>
                      {events.map((row) => {
                        return (
                          <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                          >

                            <TableCell className={style.event_title_div} sx={{
                              display: "flex", justifyContent: "space-between", gap: "10px",
                              "&:hover": {
                                color: '#fff'
                              },
                              padding: "10px"
                            }} component="th" scope="row"> <span> <span className={style.event_title} >{row.title}</span> <br /> <span className={style.event_date}>{row.start}</span> </span> <span><MdOutlineDelete className={style.delete_btn} onClick={() => handleDelete(row._id)} /></span> </TableCell>

                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

              </div>
            </section>
          </Main>
        </Box>
    </>
  );
}
