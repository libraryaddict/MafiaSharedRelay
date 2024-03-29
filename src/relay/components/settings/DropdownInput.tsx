import * as React from "react";
import { ComponentSetting } from "../../types/Types";

function DropdownInput({ button }: { button: ComponentSetting }): JSX.Element {
  return (
    <select
      className="dropdowncontainer"
      name={button.name}
      defaultValue={button.value}
      onChange={(e) => button.setValue(e.target.value)}
    >
      {button.dropdown.map((option, index) => {
        return (
          <option key={index} value={option.value}>
            {option.display || option.value}
          </option>
        );
      })}
    </select>
  );
}

export default DropdownInput;
