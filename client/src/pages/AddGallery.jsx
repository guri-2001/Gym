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
import axios from 'axios';
import style from '../styles/Gallery.module.css'
import { GrGallery } from "react-icons/gr";
import { RiGalleryFill } from "react-icons/ri";
import { FaCloudUploadAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';


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


export default function AddGallery() {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [image, setImage] = useState(null);
    const [imageLoad, setImageLoad] = useState(null);

    // console.log(imageLoad);

    const navigate = useNavigate()

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append("image", image);

        await axios.post(`${process.env.REACT_APP_URL}/addGallery`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        )
            .then(() => navigate(0))
            .catch(err => console.log(err))
        // console.log(result, "result");

    }

    const onInputChange = (e) => {
        console.log(e.target.files[0]);
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

    const handleDelete = () => {
        setImage(null);
        setImageLoad(null);
    }

    // const handleImageChange = (event) => {

    // };

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
                <div className={style.main_div}>
                    <h3>Add Image</h3>
                    <div className={style.addgallery_inner_main_div}>
                        <div className={style.gallery_heading}><GrGallery className={style.user_icon} />Add Images</div>
                        <form className={style.form_div}>
                            <p className={style.caption_line}>"Welcome to my visual journey—explore, enjoy, repeat!"</p>
                            <div>
                                <label htmlFor="image">
                                    <div className={style.image_add_div}><RiGalleryFill />Add file</div>
                                    <input style={{ display: "none" }} type="file" name="" id="image" accept="image/*" onChange={onInputChange} />
                                </label>
                                <span className={style.addImage_btn} type='submit' onClick={handleSubmit}><FaCloudUploadAlt />Submit</span>
                                <span className={style.cancel_btn} type='submit' onClick={handleDelete}><RxCross2 style={{ fontSize: "20px" }} />Cancel</span>
                                <span className={style.delete_btn} type='submit' onClick={handleDelete}><MdOutlineDelete style={{ fontSize: "20px" }} />Delete</span>
                            </div>
                            {/* =======data show div========= */}
                            <div className={style.image_show_div}>
                                {(image) ?
                                    <TableContainer component={Paper} sx={{ maxWidth: '60%', borderRadius: "0", marginTop: "50px" }}>
                                        <Table sx={{
                                            minWidth: 400,
                                        }} aria-label="simple table">
                                            <TableBody>
                                                <TableRow
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0, } }}
                                                >
                                                    <TableCell sx={{ display: "flex", gap: "20px", padding: "10px", alignItems: "center", width: "200px", }} className={style.recent_user_name_div} component="th" scope="row">
                                                        <img
                                                            src={imageLoad}
                                                            height={70}
                                                            width={100}
                                                            alt=""
                                                            style={{ objectFit: "cover" }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center" style={{ padding: "10px", width: "300px" }} >{(image) ? image.name : ""}</TableCell>

                                                    <TableCell align="center" style={{ padding: "10px", width: "200px" }} >{(image) ? image.size : ""}</TableCell>

                                                    <TableCell align="right" style={{ padding: "10px", width: "150px" }} ><span className={style.addImage_btn} style={{ fontSize: "17px" }} type='submit' onClick={handleSubmit}>Start</span></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    : ""}
                            </div>
                        </form>
                    </div>
                </div>
            </Main>
        </Box>
    );
}



