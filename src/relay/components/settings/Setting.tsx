import * as React from "react";
import { ComponentSetting, RelayComponentType } from "../../types/Types";
import BooleanInput from "./BooleanInput";
import DropdownInput from "./DropdownInput";
import StringInput from "./StringInput";

function Setting({ button }: { button: ComponentSetting }): JSX.Element {
  return (
    <tr id="userPreference">
      <td className="setting">
        {button.name}
        <div className="settingHover">{button.preference}</div>
      </td>
      <td>
        {button.type === RelayComponentType.BOOLEAN ? (
          <BooleanInput button={button} />
        ) : button.type === RelayComponentType.DROPDOWN ? (
          <DropdownInput button={button} />
        ) : (
          <StringInput button={button} />
        )}
      </td>
      <td>{button.description}</td>
    </tr>
  );
}

export default Setting;
