import React, { useState } from 'react'
import style from '../styles/Sidebar.module.css'
import { FaUser } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { FaUsersSlash } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { FaClock } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { RiGalleryFill } from "react-icons/ri";


const Sidebar = () => {
    const [isActive, setIsActive] = useState(false);
    return (
        <>
            <section>
                <div>
                    <div className={style.logo_div}>
                        <a href="/dashboard"><img src={`${process.env.PUBLIC_URL}/logo.png`} alt="logo_img" className={style.logo} /></a>
                    </div>
                    <div className={style.menu_div}>
                        <ul>
                            <li>
                                <FaUser className={style.ul_icons} />
                                <a href="/allclients">All Clients</a>
                            </li>
                            <li>
                                <FaUserCheck className={style.ul_icons} />
                                <a href="/activeClients">Active Clients</a>
                            </li>
                            <li>
                                <FaAddressCard className={style.ul_icons} />
                                <a href="/addclients">Add Client</a>
                            </li>
                            <li>
                                <FaUsersSlash className={style.ul_icons} />
                                <a href="/NonActiveClients">InActive Clients</a>
                            </li>
                            <li>
                                <FaCalendarAlt className={style.ul_icons} />
                                <a href="/calendar">Calendar</a>
                            </li>
                            <div className={style.accordion}>
                                <div className="accordion-item" style={{ background: "transparent" }}>
                                    <div
                                        className={style.accordion_title}
                                        onClick={() => setIsActive(!isActive)}
                                    >
                                        <GrGallery className={style.ul_icons} />
                                        <div className={style.title_div} style={{ display: "flex", gap: "100px" }}>
                                            Gallery
                                            <span>{isActive ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}</span>
                                        </div>
                                    </div>
                                    <div style={{ background: "rgb(50, 50, 50)" }}>
                                        {isActive && <div className={style.accordion_content}>
                                            <span className={style.ul_icons}><FaCloudUploadAlt style={{ color: "#3e99e0" }} /></span>
                                            <a href='/addgallery' >Add</a></div>}
                                        {isActive && <div className={style.accordion_content}>
                                            <span className={style.ul_icons}><RiGalleryFill style={{ color: "rgb(107, 178, 0)" }} /></span>
                                            <a href='/Gallery' >Gallery</a></div>}
                                    </div>
                                </div>
                            </div>
                            <li>
                                <FaClock className={style.ul_icons} />
                                <a href="/reminders">Reminders</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Sidebar