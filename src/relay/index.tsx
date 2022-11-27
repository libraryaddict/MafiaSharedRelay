import ".//css/App.scss";
import App from "./App";
import { ComponentSetting, ComponentPage } from "./types/Types";
import { createRoot } from "react-dom/client";
import React from "react";

getData((pages: ComponentPage[]) => {
  for (const page of pages) {
    for (const component of page.components as ComponentSetting[]) {
      component.previousValue = component.value;

      if (component.validate != null) {
        component.validate = eval(component.validate as unknown as string);
      }
    }
  }

  const container = document.getElementById("root");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const root = createRoot(container!);
  root.render(<App pages={pages} />);
});
