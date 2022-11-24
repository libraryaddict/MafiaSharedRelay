import { Routes, Route, MemoryRouter, Navigate } from "react-router-dom";
import React from "react";
import Layout from "./components/Layout";
import { ComponentPage } from "./types/Types";
import RelayPage from "./routes/RelayPage";

function App({ pages }: { pages: ComponentPage[] }) {
  return (
    <MemoryRouter>
      {" "}
      <Routes>
        {" "}
        <Route element={<Layout pages={pages} />}>
          {" "}
          <Route
            path="/"
            element={<Navigate to={"/" + pages[0].file} replace={true} />}
          />{" "}
          {pages.map((p, index) => {
            return (
              <Route
                key={index}
                path={"/" + p.file}
                element={<RelayPage page={p} />}
              ></Route>
            );
          })}{" "}
        </Route>{" "}
      </Routes>{" "}
    </MemoryRouter>
  );
}

export default App;
