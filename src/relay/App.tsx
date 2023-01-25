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
          {pages.map((p) => {
            return (
              <Route
                key={`${p.file} ${p.page}`}
                path={"/" + p.file}
                element={<RelayPage components={p.components} />}
              ></Route>
            );
          })}{" "}
        </Route>{" "}
      </Routes>{" "}
    </MemoryRouter>
  );
}

export default App;
