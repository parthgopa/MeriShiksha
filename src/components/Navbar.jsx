import { NavLink } from "react-router";
import { FaHome, FaBook } from "react-icons/fa";
import { TbSettings2 } from "react-icons/tb";
import { HiClipboardList } from "react-icons/hi";
import { GiCubes } from "react-icons/gi";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { ImProfile } from "react-icons/im";
import { IoMdLogIn } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { MdOutlineAccountCircle } from "react-icons/md";
import logo from "../assets/MyLogo.png";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <>
      <div className={styles.compName}>
        <img src={logo} className={styles.logo} />
        <p>ParthAI</p>
      </div>

      <Sidebar rootStyles={{ height: "100%" }} width="auto">
        <Menu
          menuItemStyles={{
            button: {
              borderRadius: "25px 0 0 25px",
              "&:before": {
                content: '""',
                position: "absolute",
                top: "-25px",
                right: "0",
                height: "25px",
                width: "25px",
                borderBottomRightRadius: "50%",
                backgroundColor: "transparent",
              },
              "&:after": {
                content: '""',
                position: "absolute",
                top: "50px",
                right: "0",
                height: "25px",
                width: "25px",
                borderTopRightRadius: "50%",
                backgroundColor: "transparent",
              },
              "&:hover": {
                backgroundColor: "rgb(163, 233, 249)",
                "&:before": {
                  boxShadow: "0 8.5px 0 0 rgb(163, 233, 249)",
                },
                "&:after": {
                  boxShadow: "0 -8.5px 0 0 rgb(163, 233, 249)",
                },
              },
              ["&.active"]: {
                backgroundColor: "#547CFF",
                color: "white",
                "&:before": {
                  boxShadow: "0 12.5px 0 0 #547CFF",
                },
                "&:after": {
                  boxShadow: "0 -12.5px 0 0 #547CFF",
                },
              },
            },
          }}
        >
          <SubMenu label="Account" icon={<MdOutlineAccountCircle />}>
            <MenuItem
              icon={<VscAccount />}
              component={
                <NavLink
                  to="/sign-up"
                  className={({ isActive }) => (isActive ? "active" : "")}
                />
              }
            >
              Sign up
            </MenuItem>
            <MenuItem
              icon={<IoMdLogIn />}
              component={
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "active" : "")}
                />
              }
            >
              Login
            </MenuItem>
            <MenuItem
              icon={<ImProfile />}
              component={
                <NavLink
                  to="./profile"
                  className={({ isActive }) => (isActive ? "active" : "")}
                />
              }
            >
              Profile
            </MenuItem>
          </SubMenu>
          <MenuItem
            icon={<FaHome />}
            component={
              <NavLink
                to="./home"
                className={({ isActive }) => (isActive ? "active" : "")}
              />
            }
          >
            Home
          </MenuItem>
          <MenuItem
            icon={<FaBook />}
            component={
              <NavLink
                to="/app/topic-learning"
                className={({ isActive }) => (isActive ? "active" : "")}
              />
            }
          >
            Topic Learning
          </MenuItem>
          <MenuItem
            icon={<TbSettings2 />}
            component={
              <NavLink
                to="/app/generate-mcqs"
                className={({ isActive }) => (isActive ? "active" : "")}
              />
            }
          >
            MCQ Generator
          </MenuItem>
          <MenuItem
            icon={<GiCubes />}
            component={
              <NavLink
                to="/app/paragraph-mcqs"
                className={({ isActive }) => (isActive ? "active" : "")}
              />
            }
          >
            Passage test
          </MenuItem>
          <MenuItem
            icon={<HiClipboardList />}
            component={
              <NavLink
                to="/app/dotpoint-summary"
                className={({ isActive }) => (isActive ? "active" : "")}
              />
            }
          >
            Summarizer (Dot Point)
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
};

export default Navbar;
