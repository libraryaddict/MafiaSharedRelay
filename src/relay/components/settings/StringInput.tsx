import * as React from "react";
import { ComponentSetting } from "../../types/Types";

function StringInput({ button }: { button: ComponentSetting }): JSX.Element {
  return (
    <input
      className="stringcontainer"
      name={button.name}
      defaultValue={button.value}
      onChange={(e) => button.setValue(e.target.value)}
    />
  );
}

export default StringInput;
