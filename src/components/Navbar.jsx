import { Link, NavLink } from "react-router";
import { FaHome } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { TbSettings2 } from "react-icons/tb";
import { HiClipboardList } from "react-icons/hi";
import { GiCubes } from "react-icons/gi";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { ImProfile } from "react-icons/im";
import { IoMdLogIn } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { MdOutlineAccountCircle } from "react-icons/md";
import image from "../assets/MyLogo.png";

const Navbar = ({ currentSidebar, setSidebar }) => {
  let handlesidebarclick = (tabname) => {
    setSidebar(tabname);
  };

  return (
    <Sidebar rootStyles={{ height: "100%" }} width="auto">
      <Menu
        menuItemStyles={{
          button: {
            // the active class will be added automatically by react router
            // so we can use it to style the active menu item
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
                boxShadow: "0 12.5px 0 0 rgb(163, 233, 249)",
              },
              "&:after": {
                boxShadow: "0 -12.5px 0 0 rgb(163, 233, 249)",
              },
            },
            [`&.active`]: {
              backgroundColor: "#547CFF",
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
                to="/"
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
            {" "}
            Login
          </MenuItem>
          <MenuItem
            icon={<ImProfile />}
            component={
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              />
            }
          >
            {" "}
            Profile
          </MenuItem>
        </SubMenu>

        <MenuItem
          icon={<FaHome />}
          component={
            <NavLink
              to="/"
              end
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
              to="/topic-learning"
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
              to="/generate-mcqs"
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
              to="/paragraph-mcqs"
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
              to="/dotpoint-summary"
              className={({ isActive }) => (isActive ? "active" : "")}
            />
          }
        >
          Summarizer(dot.point)
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
export default Navbar;
