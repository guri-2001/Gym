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
import style from '../styles/AddClient.module.css'
import { FaUser } from "react-icons/fa";
import {Checkbox, FormControlLabel, TextareaAutosize, TextField } from '@mui/material';
import TopBar from './TopBar';
import { useState } from 'react';

import style1 from '../styles/Gallery.module.css'
import { useNavigate } from 'react-router-dom';


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


export default function AddClient() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const [image, setImage] = useState();
  const [name, setName] = useState(null)
  const [fname, setFname] = useState(null)
  const [mobileno, setMobileno] = useState(null)
  const [dob, setDob] = useState(null)
  const [weight, setWeight] = useState(null)
  const [address, setAddress] = useState(null)
  const [checkedValues, setCheckedValues] = useState([])
  const [imageLoad, setImageLoad] = useState(null)


  const navigate = useNavigate()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // ===============get the users=====================

  const handleSubmit = async (e) => {
    e.preventDefault()


    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("fname", fname);
    formData.append("mobileno", mobileno);
    formData.append("dob", dob);
    formData.append("weight", weight);
    formData.append("address", address);
    formData.append("checkedValues", JSON.stringify(checkedValues));

    await axios.post(
      `${process.env.REACT_APP_URL}/addClient`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
      .then(() => navigate(0))
      .catch(err => console.log(err))
  }

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

  const handleReset = () => {
    setImage(null)
  }


  const handleCheckbocChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter((item) => item !== value));
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
      <Main open={open}>
        <DrawerHeader />

        <div className={style.main_div}>
          <div className={style.inner_div}>
            <div className={style.form_heading}><FaUser className={style.user_icon} />Add User</div>
            <form>

              {/* ====image div==== */}

              <div className={style.input_div}>
                <div className={style.label_div}>
                  <label htmlFor="image">Image*</label>
                </div>
                <div style={{ display: "flex", gap: "10px", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  {(image) ?
                    <div style={{ padding: "4px", border: "1px solid gray", borderRadius: "5px" }}><img src={imageLoad} alt='add-images' width={200} height={150} style={{ objectFit: "cover" }} /></div>
                    :
                    <div style={{ padding: "4px", border: "1px solid gray", borderRadius: "5px" }}><img src={`${process.env.PUBLIC_URL}/dummy.png`} alt='add-images' width={200} height={150} style={{ objectFit: "cover" }} /></div>
                  }
                  <div style={{ display: "flex", gap: "10px" }}>
                    <label htmlFor="image" style={{ display: "flex", gap: "10px" }}>
                      <span className={style1.addImage_btn}>Add Image</span>
                      <input type="file" name="" id="image" accept="image/*" onChange={onInputChange} className={style.image} />
                    </label>
                    {(image) ? <span className={style1.addImage_btn} style={{ background: "gray" }} onClick={handleReset} >Reset</span> : ""}
                  </div>
                </div>
              </div>

              {/* name */}
              <div className={style.input_div}>
                <div className={style.label_div}>
                  <label htmlFor="name">Name*</label>
                </div>
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  sx={{ width: "50%", backgroundColor: "white" }}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              {/* father name */}

              <div className={style.input_div}>
                <div className={style.label_div}>
                  <label htmlFor="">Father Name*</label>
                </div>
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  sx={{ width: "50%", backgroundColor: "white" }}
                  onChange={e => setFname(e.target.value)}
                />
              </div>

              {/* mobile no. */}

              <div className={style.input_div}>
                <div className={style.label_div}>
                  <label htmlFor="">Mobile No*</label>
                </div>
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  sx={{ width: "50%", backgroundColor: "white" }}
                  onChange={e => setMobileno(e.target.value)}
                />
              </div>

              {/* dob */}

              <div className={style.input_div}>
                <div className={style.label_div}>
                  <label htmlFor="">DOB*</label>
                </div>
                <input type='date' onChange={(e) => setDob(e.target.value)} style={{ width: "50%" }} />
              </div>

              {/* weight */}

              <div className={style.input_div}>
                <div className={style.label_div}>
                  <label htmlFor="">Weight*</label>
                </div>
                <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  sx={{ width: "50%", backgroundColor: "white" }}
                  onChange={e => setWeight(e.target.value)}
                />

                {/* address */}

              </div>
              <div className={style.input_div}>
                <div className={style.label_div}>
                  <label htmlFor="">Address*</label>
                </div>
                <TextareaAutosize
                  minRows={4}
                  aria-label="empty textarea"
                  onChange={e => setAddress(e.target.value)}
                />
              </div>

              {/* input div */}

              <div className={style.input_div}>
                <div className={style.label_div}>
                  <label htmlFor=""></label>
                </div>
                <FormControlLabel control={<Checkbox />} label="Cardio" onChange={handleCheckbocChange} value='Cardio'/>
                <FormControlLabel control={<Checkbox />} label="Strength" onChange={handleCheckbocChange} value='Strength'/>
                <FormControlLabel control={<Checkbox />} label="Hybrid" onChange={handleCheckbocChange} value='Hybrid'/>
                <FormControlLabel control={<Checkbox />} label="Personal Trainer" onChange={handleCheckbocChange} value='Personal Trainer'/>
                <FormControlLabel control={<Checkbox />} label="Transformstion" onChange={handleCheckbocChange} value='Transformstion'/>
              </div>

              {/* submit button */}

              <div className={style.input_div}>
                <div className={style.label_div}></div>
                <button type='submit' onClick={handleSubmit} className={style.submit_btn}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      </Main>
    </Box>
  );
}
