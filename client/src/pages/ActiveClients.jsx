
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
import { FaUser } from "react-icons/fa";
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';


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


export default function ActiveClients() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  // ==========use state =================

  const [allUsers, setAllUsers] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(10)
  const [pageCount, setPageCount] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const currentPage = useRef()
  const [imageById, setImageById] = useState(null)
  const [image, setImage] = useState()
  const [imageLoad, setImageLoad] = useState(null)

  const [modalopen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);



  const [updateForm, setUpdateForm] = useState({
    _id: null,
    name: '',
    fname: '',
    mobileno: '',
    dob: '',
    weight: '',
    address: '',
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

  const getPaginatedUsers = async () => {
    const result = await axios.get(`${process.env.REACT_APP_URL}/paginatedUsers?page=${currentPage.current}&limit=${limit}&search=${searchQuery}`);
    console.log(result);
    setAllUsers(result.data.result);
    setPageCount(result.data.pageCount);
  }

  // ============format the date===============

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
  };

  const padZero = (num) => num.toString().padStart(2, '0');


  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  }


  const handleUpdate = async (id) => {
    await axios.put(`${process.env.REACT_APP_URL}/update-status/${id}`)
      .then(response => navigate(0))
      .catch(err => console.log(err));
  }

  const handleFieldChange = (event) => {
    const { value, name } = event.target;

    setUpdateForm({
      ...updateForm,
      [name]: value
    })
  }

  const handleUserUpdate = (data) => {
    setUpdateForm({ name: data.name, fname: data.fname, mobileno: data.mobileno, dob: data.dob, weight: data.weight, address: data.address, _id: data._id })
  }


  const handleFieldUpdate = async () => {
    // const { name, fname, mobileno, dob, weight, address, } = updateForm;
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', updateForm.name);
    formData.append('fname', updateForm.fname);
    formData.append('mobileno', updateForm.mobileno);
    formData.append('dob', updateForm.dob);
    formData.append('weight', updateForm.weight);
    formData.append('address', updateForm.address);

    // await axios.put(`${process.env.REACT_APP_URL}/userUpdate/${updateForm._id}`, { name, fname, mobileno, dob, weight, address, image })
    await axios.put(`${process.env.REACT_APP_URL}/userUpdate/${updateForm._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((result) => navigate(0))
      // .then((result) => console.log(result))
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
    height: '100%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: '5px',
  };

  const onInputChange = (e) => {
    // console.log(e.target.files[0]);
    setImage(e.target.files[0]);

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageLoad(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

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
              <div style={{ fontSize: "25px", fontWeight: "600" }}>Active Clients</div>
              <div style={{ margin: "20px 0" }}>
                <input type="search" name="" id="" placeholder='Search...' onChange={handleChange}
                  style={{ width: "50%", padding: "4px 10px", fontSize: "17px", outline: "none" }}
                />
              </div>

              <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
                <Table sx={{
                  minWidth: '100%', "& .MuiTableRow-root:hover": {
                    backgroundColor: "rgb(244, 244, 244)"
                  }
                }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell ><strong>Image</strong></TableCell>
                      <TableCell align='centre'><strong>Name</strong></TableCell>
                      <TableCell align="centre"><strong>Father Name</strong></TableCell>
                      <TableCell align="right"><strong>Mobile No.</strong></TableCell>
                      <TableCell align="right"><strong>Date of Birth</strong></TableCell>
                      <TableCell align="right"><strong>Weight</strong></TableCell>
                      <TableCell align="right"><strong>Address</strong></TableCell>
                      <TableCell align="right"><strong></strong></TableCell>
                      <TableCell align="right"><strong></strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allUsers == null ? <h6>No Cliend Added</h6> :
                      allUsers.map((row) => (
                        <>
                          {(row.status === true) ?
                            <TableRow
                              key={row.name}
                              sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                              onClick={() => handleUserUpdate(row)}
                            >
                              <TableCell component="th" scope="row" sx={{ padding: "10px" }}>
                                <img
                                  // src={require(`../../../server/uploads//${row.image}`)}
                                  src={`https://gym-aeyn.onrender.com${row.image}`}
                                  height={70}
                                  width={70}
                                  alt=""
                                  style={{ objectFit: "cover" }} 
                                  data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => hanleShow(row._id)}
                                  />
                              </TableCell>
                              <TableCell style={{ padding: "10px" }} component="th" scope="row">{row.name}</TableCell>
                              <TableCell style={{ padding: "10px" }} component="th" scope="row">{row.fname}</TableCell>
                              <TableCell style={{ padding: "10px" }} align="right">{row.mobileno}</TableCell>
                              <TableCell style={{ padding: "10px" }} align="right">{formatDate(row.dob)}</TableCell>
                              <TableCell style={{ padding: "10px" }} align="right">{row.weight}</TableCell>
                              <TableCell style={{ padding: "10px" }} align="right">{row.address}</TableCell>
                              {/* <TableCell style={{ padding: "10px" }} align="right">{row.address}</TableCell> */}
                              <TableCell style={{ padding: "10px" }} align='center'>
                              {
                                row.checkedValues.map((item) => (
                                  <li style={{ listStyle: "none" }}>{item}</li>
                                ))
                              }
                            </TableCell>
                              {/* ==========btns div=========== */}
                              <TableCell align="right" style={{ display: "flex", gap: "10px", flexDirection: "column", alignContent: "center", justifyContent: "center" }}>

                                <Button sx={{
                                  "&:hover": {
                                    backgroundColor: '#6c757d'
                                  },
                                  backgroundColor: "#6c757d",
                                  color: "#fff"
                                }} onClick={() => handleUpdate(row._id)} className={style.delete_btn} title='In-Active'>In-Active</Button>

                                <Button sx={{
                                  "&:hover": {
                                    backgroundColor: '#1976d2'
                                  }
                                }} variant='contained' onClick={() => handleOpen(row)} title='Edit'>Edit</Button>
                              </TableCell>
                            </TableRow>
                            : ""}
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
                            <label htmlFor="image">Image*</label>
                          </div>
                          <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
                            {(image) ?
                              <div style={{ padding: "4px", border: "1px solid gray", borderRadius: "5px" }}><img src={imageLoad} alt='add-images' width={200} height={150} style={{ objectFit: "cover" }} /></div>
                              :
                              <div style={{ padding: "4px", border: "1px solid gray", borderRadius: "5px" }}><img src={`${process.env.PUBLIC_URL}/dummy.png`} alt='add-images' width={200} height={150} style={{ objectFit: "cover" }} /></div>
                            }
                            <div style={{ display: "flex", gap: "10px" }}>
                              <label htmlFor="image" style={{ display: "flex", gap: "10px" }}>
                                <span style={{background:"#3e99e0",color:"#fff",padding:"4px 10px"}}>Add Image</span>
                                <input type="file" name="" id="image" accept="image/*" onChange={onInputChange} style={{ display: "none" }} />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className={style1.input_div}>
                          <div className={style1.label_div}>
                            <label htmlFor="name">Name*</label>
                          </div>
                          <input type="text" name="name" id="" value={updateForm.name} onChange={handleFieldChange} />
                        </div>

                        <div className={style1.input_div}>
                          <div className={style1.label_div}>
                            <label htmlFor="">Father Name*</label>
                          </div>
                          <input type="text" name="fname" id="" value={updateForm.fname} onChange={handleFieldChange} />
                        </div>
                        
                        <div className={style1.input_div}>
                          <div className={style1.label_div}>
                            <label htmlFor="">Mobile No*</label>
                          </div>
                          <input type="text" name="mobileno" id="" value={updateForm.mobileno} onChange={handleFieldChange} />
                        </div>
                        <div className={style1.input_div}>
                          <div className={style1.label_div}>
                            <label htmlFor="">DOB*</label>
                          </div>
                          <input type="date" name="dob" id="" value={updateForm.dob} onChange={handleFieldChange} />
                        </div>
                        <div className={style1.input_div}>
                          <div className={style1.label_div}>
                            <label htmlFor="">Weight*</label>
                          </div>
                          <input type="text" name="weight" id="" value={updateForm.weight} onChange={handleFieldChange} />
                        </div>
                        <div className={style1.input_div}>
                          <div className={style1.label_div}>
                            <label htmlFor="">Address*</label>
                          </div>
                          <textarea name="address" id="" value={updateForm.address} onChange={handleFieldChange}></textarea>
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



