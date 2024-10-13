
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
import Sidebar from './Sidebar'
import '../index.css'
import TopBar from './TopBar';
import { useState } from 'react';
import { useEffect } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';


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


// =================main function===============


export default function Notifications() {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [imageById, setImageById] = useState(null)
    // const [loading, setLoading] = useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };



    useEffect(() => {
        fetchBirthdays();
    }, []);

    const hanleShow = async (id) => {
        try {
          const response = await axios.get(`https://gym-aeyn.onrender.com/imageById/${id}`);
          setImageById(response.data.image);
          // console.log(response.data);
    
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }

    const fetchBirthdays = async () => {
        // setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/notifications`, { method: 'POST' });
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching birthdays:', error);
        }
    };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    return (
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
            <Main open={open} style={{ height: "100vh" }}>
                <DrawerHeader />

                <div>
                    <div >
                        <div style={{ fontSize: "25px", fontWeight: "600" }}>Notifications</div>
                        <TableContainer component={Paper} sx={{ maxWidth: '90%', marginTop: "50px" }}>
                            <Table sx={{
                                minWidth: '100%', "& .MuiTableRow-root:hover": {
                                    backgroundColor: "rgb(244, 234, 244)"
                                }
                            }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell ><strong>Image</strong></TableCell>
                                        <TableCell align='centre'><strong>Name</strong></TableCell>
                                        <TableCell align="right"><strong>Mobile No.</strong></TableCell>
                                        <TableCell align="right"><strong>Fees</strong></TableCell>
                                        <TableCell align="right"><strong>Duration</strong></TableCell>
                                        <TableCell align="right"><strong>Last Date</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {notifications == null ? <h4>No Cliend Added</h4> :
                                        notifications.map((row) => (
                                            <>
                                                <TableRow
                                                    key={row.name}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                                                >
                                                    <TableCell sx={{ padding: "10px" }} component="th" scope="row">
                                                        <img
                                                            // src={require(`../../../server/uploads/${row.image}`)}
                                                            src={`https://gym-aeyn.onrender.com${row.image}`}
                                                            height={60}
                                                            width={60}
                                                            alt=""
                                                            style={{ objectFit: "cover" }} 
                                                            data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => hanleShow(row._id)}
                                                            />
                                                    </TableCell>
                                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                                    <TableCell align="right">{row.mobileno}</TableCell>
                                                    <TableCell align="right">{row.fees}</TableCell>
                                                    <TableCell align="right">{row.duration}</TableCell>
                                                    <TableCell align="right">{row.enddate}</TableCell>

                                                </TableRow>

                                                {/* <!-- Modal --> */}
                                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="modal-body" style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                                                                <img src={`http://localhost:5000${imageById}`} alt="Uploaded" style={{ width: '400px' }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </Main>
        </Box>
    );
}



