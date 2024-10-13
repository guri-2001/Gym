// import React, { useRef, useState } from 'react'
// import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import AddEvent from './AddEvent'
// import axios from 'axios'
// import moment from 'moment'
// import style from '../styles/Calendar.module.css'
// // import Sidebar from './Sidebar'
// import '../index.css'

// const Calendar = () => {

//     const [modalOpen, setModalOpen] = useState(false)
//     const [events, setEvents] = useState([])
//     const calendarRef = useRef(null)

//     const onEventAdded = (event) => {
//         let calendarApi = calendarRef.current.getApi()
//         calendarApi.addEvent({
//             start: moment(event.start).toDate(),
//             end: moment(event.end).toDate(),
//             title: event.title
//         })

//     }

//     async function handleEventAdd(data) {
//         await axios.post('http://localhost:5000/create-event', data.event)
//         console.log(data.event);
//     }


//     async function handleDateSet(data) {
//         const response = await axios.get('http://localhost:5000/get-event?start=' + moment(data.start).toISOString() + "&end=" + moment(data.end).toISOString());

//         setEvents(response.data);
//         console.log(response.data);

//     }

//     return (
//         <div>
//             <div className='main_grid_div'>
//                 <div style={{width:"1200px",padding:"20px 50px"}}>
//                     <div onClick={() => setModalOpen(true)} className={style.add_btn}>Add Event</div>
//                     <div className={style.calendar_div} style={{ position: "relative", zIndex: "0" }}>
//                         <FullCalendar
//                             ref={calendarRef}
//                             events={events}
//                             plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//                             initialView="dayGridMonth"
//                             eventAdd={event => handleEventAdd(event)}
//                             datesSet={date => handleDateSet(date)}
//                             headerToolbar={{
//                                 start: "today prev,next",
//                                 center: "title",
//                                 end: "dayGridMonth,timeGridWeek,timeGridDay",
//                             }}
//                             buttonText={{
//                                 today: 'Today',
//                                 month: 'Month',
//                                 week: 'Week',
//                                 day: 'Day',
//                             }}
//                             height={'80vh'}
//                         />
//                     </div>

//                     <AddEvent isOpen={modalOpen} onclose={() => setModalOpen(false)} onEventAdded={(event) => onEventAdded(event)} />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Calendar






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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRef } from 'react';
import moment from 'moment'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
// import AddEvent from './AddEvent'
import { Button, Fade, Modal } from '@mui/material';
import { Backdrop } from '@mui/material';
// import Datetime from 'react-datetime'

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


export default function Calendar() {
    const theme = useTheme();
    const [open, setOpen] = useState(true);
    const [modalopen, setModalOpen] = React.useState(false);
    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const navigate = useNavigate()

    const [events, setEvents] = useState([])
    const calendarRef = useRef(null)

    const onEventAdded = (event) => {
        let calendarApi = calendarRef.current.getApi()
        calendarApi.addEvent({
            // start: moment(event.start).toDate(),
            start: event.start,
            end: event.end,
            // end: moment(event.end).toDate(),
            title: event.title
        })

    }

    async function handleEventAdd(data) {
        const res = await axios.post(`${process.env.REACT_APP_URL}/create-event`, data.event)
        if (res) {
            navigate(0)
        }

    }


    async function handleDateSet(data) {
        const response = await axios.get(`${process.env.REACT_APP_URL}/get-event?start=` + moment(data.start).toISOString() + "&end=" + moment(data.end).toISOString());

        setEvents(response.data);
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

    const [title, setTitle] = useState()
    const [start, setStart] = useState()
    // const [end, setEnd] = useState(new Date())

    const onSubmit = (e) => {
        e.preventDefault();

        onEventAdded({
            title,
            start,
            // end
        })
        // onclose()
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

                <div>
                    <div >
                        <div style={{ width: "1200px", padding: "20px 50px", background: "#fff" }}>
                            <Button sx={{
                                "&:hover": {
                                    backgroundColor: '#1976d2'
                                },
                                marginBottom: "20px"
                            }} variant='contained' onClick={() => handleOpen()}>Add Event</Button>
                            <div style={{ position: "relative", zIndex: "0" }}>
                                <FullCalendar
                                    ref={calendarRef}
                                    events={events}
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    initialView="dayGridMonth"
                                    eventAdd={event => handleEventAdd(event)}
                                    datesSet={date => handleDateSet(date)}
                                    headerToolbar={{
                                        start: "today prev,next",
                                        center: "title",
                                        end: "dayGridMonth,timeGridWeek,timeGridDay",
                                    }}
                                    buttonText={{
                                        today: 'Today',
                                        month: 'Month',
                                        week: 'Week',
                                        day: 'Day',
                                    }}
                                    height={'80vh'}
                                />
                            </div>

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
                                        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                            <label htmlFor="">Title</label>
                                            <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{
                                                padding: "5px 10px",
                                                outline: "none"
                                            }} />

                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                <label htmlFor="">Date</label>
                                                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={{
                                                padding: "5px 10px",
                                                outline: "none"
                                            }}/>
                                            </div>

                                            {/* <div>
                                                <label htmlFor="">End Date</label>
                                                <Datetime value={end} onChange={(date) => setEnd(date)} />
                                            </div> */}

                                            <Button sx={{
                                                "&:hover": {
                                                    backgroundColor: '#1976d2'
                                                },
                                                marginTop:"20px"
                                            }} type='submit' variant='contained' >Add Event</Button>
                                        </form>
                                    </Box>
                                </Fade>
                            </Modal>
                        </div>
                    </div>
                </div>
            </Main>
        </Box>
    );
}



