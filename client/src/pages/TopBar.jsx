import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepPurple } from '@mui/material/colors';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React from 'react'
import style from '../styles/Dashboard.module.css'
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from 'react';
import { useEffect } from 'react';

const TopBar = () => {

    const navigate = useNavigate()
    const user = window.localStorage.getItem('user')

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notifications, setNotifications] = useState([]);


    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        navigate('/')
        localStorage.clear('user');
    }

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);




    // =================notifications =============================

    useEffect(() => {
        fetchBirthdays();
    }, []);

    const fetchBirthdays = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/notifications`, { method: 'POST' });
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching birthdays:', error);
        }
    };





    return (
        <div>
            <div className={style.topbar_div}>
                <div className={style.search_div}>
                    <input type="search" name="search" placeholder='Search here...' className={style.search_bar} />
                    <div className={style.search_icon_div}>
                        <FaSearch id={style.search_icon} />
                    </div>
                </div>

                {/* ===============user profile================= */}
                <div className={style.notify_div}>
                    <p>Time: {time.toLocaleTimeString()}</p>

                    {
                        (notifications.length > 0) ?
                            <Badge badgeContent={notifications.length} color="primary" >
                                <a href="/notifications" style={{ color: "#fff" }} title='Notifications'><NotificationsIcon /></a>
                            </Badge>
                            :  
                            // <Badge badgeContent={notifications.length} color="primary" >
                            <a href="/notifications" style={{ color: "#fff" }} title='Notifications'><NotificationsIcon /></a>
                        // </Badge>
                    }
                </div>
                <div className={style.user_profile_div}>
                    <Stack direction="row" spacing={2}>
                        <Avatar sx={{ bgcolor: deepPurple[500] }} title='Profile' >Z</Avatar>
                        <h5>{user}</h5>
                    </Stack>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <KeyboardArrowDownIcon style={{ color: "#fff" }} />
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                        {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
                        <MenuItem onClick={handleClose}><span onClick={handleLogout}>Logout</span></MenuItem>
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default TopBar