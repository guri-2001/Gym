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
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import style1 from '../styles/AddClient.module.css'
// import styles
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Loading from './Loading';
import { useEffect } from 'react';



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


export default function NonActiveClients() {
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

  const navigate = useNavigate()

  useEffect(() => {
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
    await axios.put(`${process.env.REACT_APP_URL}/addUser/${id}`)
      .then(response => navigate(0))
      .catch(err => console.log(err));

  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  if (!allUsers) {
    return <Loading />
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


  // =============== modal box css =====================

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
          <div >
            <div>
              <div style={{ fontSize: "25px", fontWeight: "600" }}>In-Active Clients</div>
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
                    {allUsers == null ? <h6>No Clients Added</h6> :
                      allUsers.map((row) => (
                        <>
                          {(row.status === false) ?
                            <TableRow
                              key={row.name}
                              sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                            >
                              <TableCell component="th" scope="row" sx={{ padding: "10px" }}>
                                <img
                                  // src={require(`../../../server/uploads/${row.image}`)}
                                  src={`https://gym-aeyn.onrender.com${row.image}`}
                                  height={70}
                                  width={70}
                                  alt=""
                                  style={{ objectFit: "cover" }} 
                                  data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => hanleShow(row._id)}
                                  />
                              </TableCell>
                              <TableCell component="th" scope="row">{row.name}</TableCell>
                              <TableCell component="th" scope="row">{row.fname}</TableCell>
                              <TableCell align="right">{row.mobileno}</TableCell>
                              <TableCell align="right">{formatDate(row.dob)}</TableCell>
                              <TableCell align="right">{row.weight}</TableCell>
                              <TableCell align="right">{row.address}</TableCell>
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
                                    backgroundColor: '#1976d2'
                                  }
                                }} variant='contained' onClick={() => handleUpdate(row._id)} title='Active'>Active</Button>

                              </TableCell>
                            </TableRow> : ''}
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
        </div>
      </Main>
    </Box>
  );
}



