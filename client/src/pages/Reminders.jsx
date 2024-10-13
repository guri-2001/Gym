
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
import axios from 'axios';
import Sidebar from './Sidebar'
import '../index.css'
import TopBar from './TopBar';
import { useState } from 'react';
import { Backdrop, Button, Fade, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import style1 from '../styles/AddClient.module.css'
// import styles
import { FaUser } from "react-icons/fa";
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';



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


export default function Reminders() {
    const theme = useTheme();
    const [open, setOpen] = useState(true);

    // ==========use state =================

    const [allUsers, setAllUsers] = useState(null)
    const [imageById, setImageById] = useState(null)
    // eslint-disable-next-line no-unused-vars
    const [limit, setLimit] = useState(10)
    const [pageCount, setPageCount] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const currentPage = useRef()

    const [modalopen, setModalOpen] = React.useState(false);
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);



    const [updateForm, setUpdateForm] = useState({
        _id: null,
        name: '',
        mobileno: '',
        fees: '',
        duration: '',
        enddate: '',
    })

    const navigate = useNavigate()


    React.useEffect(() => {
        currentPage.current = 1
        getPaginatedUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);


    const handlePageClick = async (e) => {
        console.log(e)
        currentPage.current = e.selected + 1
        // setCurrentPage(e.selected + 1);
        getPaginatedUsers()
    }

    // ========get clients request==================

    const getPaginatedUsers = async () => {
        const result = await axios.get(`${process.env.REACT_APP_URL}/paginatedUsers?page=${currentPage.current}&limit=${limit}&search=${searchQuery}`);
        console.log(result);
        setAllUsers(result.data.result);
        setPageCount(result.data.pageCount);
    }


    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    }


    // const handleUpdate = async (id) => {
    //     await axios.put(`http://localhost:5000/update-status/${id}`)
    //         .then(response => navigate(0))
    //         .catch(err => console.log(err));
    // }

    const handleFieldChange = (event) => {
        const { value, name } = event.target;

        setUpdateForm({
            ...updateForm,
            [name]: value
        })
    }

    const handleUserUpdate = (data) => {
        setUpdateForm({ name: data.name, mobileno: data.mobileno, fees: data.fees, duration: data.duration, enddate: data.enddate, _id: data._id })
    }


    const handleFieldUpdate = async () => {
        const { name, mobileno, fees, duration, enddate } = updateForm;

        await axios.put(`${process.env.REACT_APP_URL}/userUpdate/${updateForm._id}`, { name, mobileno, fees, duration, enddate })
            .then((result) => navigate(0))
            .catch((err) => console.log(err))

    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // =============== modal box css =====================

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        height: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const hanleShow = async (id) => {
        try {
          const response = await axios.get(`https://gym-aeyn.onrender.com/imageById/${id}`);
          setImageById(response.data.image);
          // console.log(response.data);
    
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      }

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
            <Main open={open} style={{ minHeight: "100vh" }}>
                <DrawerHeader />

                {/* ===============all users=========== */}

                <div>
                    <div className={style.main_div}>
                        <div className={style.inner_div}>
                            <div style={{ fontSize: "25px", fontWeight: "600" }}>Reminders</div>
                            <div style={{ margin: "20px 0" }}>
                                <input type="search" name="" id="" placeholder='Search...' onChange={handleChange}
                                    style={{ width: "50%", padding: "4px 10px", fontSize: "17px", outline: "none" }}
                                />
                            </div>

                            <TableContainer component={Paper} sx={{ maxWidth: '90%' }}>
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
                                            <TableCell align="right"><strong></strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allUsers == null ? <h4>No Cliend Added</h4> :
                                            allUsers.map((row) => (
                                                <>
                                                    <TableRow
                                                        key={row.name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                                                        onClick={() => handleUserUpdate(row)}
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

                                                        {/* ==========btns div=========== */}
                                                        <TableCell align="right" style={{ display: "flex", gap: "10px", flexDirection: "column", alignContent: "center", justifyContent: "center" }}>
                                                            <Button></Button>

                                                            <Button sx={{
                                                                "&:hover": {
                                                                    backgroundColor: '#1976d2'
                                                                },
                                                                padding: "6px 0"
                                                            }} variant='contained' onClick={() => handleOpen(row)} title='Edit'>Reminder</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                    {/* <!-- Modal --> */}
                                                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div className="modal-dialog modal-dialog-centered">
                                                            <div className="modal-content">
                                                                <div className="modal-body" style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                                                                    <img src={`https://gym-aeyn.onrender.com${imageById}`} alt="Uploaded" style={{ width: '400px' }}
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



                    {/* =================page numbers================= */}

                    <div className={style1.pagination_div}>
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="next >"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="< previous"
                            renderOnZeroPageCount={null}
                            marginPagesDisplayed={2}
                            containerClassName="pagination justify-content-center"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            activeClassName="active"
                        />
                    </div>

                    {/* ===================Update Form ========================= */}

                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={modalopen}
                        onClose={handleClose}
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                            backdrop: {
                                timeout: 500,
                            },
                        }}
                    >
                        <Fade in={modalopen}>
                            <Box sx={style}>
                                <div>
                                    <div className={style1.main_div}>
                                        <div className={style1.inner_div}>
                                            <div className={style1.form_heading}><FaUser className={style1.user_icon} />Update User</div>
                                            <div style={{ margin: "20px 0" }}>
                                                <div className={style1.input_div}>
                                                    <div className={style1.label_div}>
                                                        <label htmlFor="name">Name*</label>
                                                    </div>
                                                    <input type="text" name="name" id="" value={updateForm.name} onChange={handleFieldChange} />
                                                </div>
                                                <div className={style1.input_div}>
                                                    <div className={style1.label_div}>
                                                        <label htmlFor="">Mobile No*</label>
                                                    </div>
                                                    <input type="text" name="mobileno" id="" value={updateForm.mobileno} onChange={handleFieldChange} />
                                                </div>

                                                <div className={style1.input_div}>
                                                    <div className={style1.label_div}>
                                                        <label htmlFor="">Fees*</label>
                                                    </div>
                                                    <input type="text" name="fees" id="" value={updateForm.fees} onChange={handleFieldChange} />
                                                </div>
                                                <div className={style1.input_div}>
                                                    <div className={style1.label_div}>
                                                        <label htmlFor="">Duration*</label>
                                                    </div>
                                                    <input type="text" name="duration" id="" value={updateForm.duration} onChange={handleFieldChange} />
                                                </div>
                                                <div className={style1.input_div}>
                                                    <div className={style1.label_div}>
                                                        <label htmlFor="">Reminder*</label>
                                                    </div>
                                                    <input style={{ width: "26.5%" }} type="date" name="enddate" id="" value={updateForm.enddate} onChange={handleFieldChange} />
                                                </div>

                                                <div className={style1.input_div}>
                                                    <div className={style1.label_div}></div>
                                                    <button type='submit' onClick={handleFieldUpdate} className={style1.submit_btn}>Update</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </Fade>
                    </Modal>


                </div>
            </Main>
        </Box>
    );
}
