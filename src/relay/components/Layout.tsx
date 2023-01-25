import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ComponentPage } from "../types/Types";

const Layout = ({ pages }: { pages: ComponentPage[] }) => {
  const outlet = (
    <>
      <div id="notificationsContainer"></div>
      <div id="relayContainer">
        <Outlet />
      </div>
    </>
  );

  if (pages.length <= 1) {
    return outlet;
  }

  return (
    <>
      {" "}
      <nav>
        <div className="topBar">
          {" "}
          {pages.map((p) => (
            <div key={`${p.file} ${p.page}`} className="tabEntry">
              <NavLink to={"/" + p.file}>{p.page}</NavLink>{" "}
            </div>
          ))}
        </div>
      </nav>{" "}
      {outlet}
    </>
  );
};

export default Layout;
