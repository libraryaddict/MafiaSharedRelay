import React, { useState } from "react";
import SettingValidator from "../../api/SettingValidator";
import { ComponentSetting, RelayComponentType } from "../../types/Types";
import BooleanInput from "./BooleanInput";
import DropdownInput from "./DropdownInput";
import StringInput from "./StringInput";

function Setting({
  button,
  validator,
}: {
  button: ComponentSetting;
  validator: SettingValidator;
}): JSX.Element {
  const [valid, setValid] = useState(validator.isValid(button));

  button.setValue = (val) => {
    button.value = val;
    validator.updateSetting(button);
  };

  validator.addSetting(button, setValid);

  return (
    <tr id="userPreference">
      <td className="setting">
        {button.name}
        <div className="settingHover">{button.preference}</div>
      </td>
      <td className={valid ? "" : "invalid-setting"}>
        {button.type === RelayComponentType.BOOLEAN ? (
          <BooleanInput button={button} />
        ) : button.type === RelayComponentType.DROPDOWN ? (
          <DropdownInput button={button} />
        ) : (
          <StringInput button={button} />
        )}
        {button.invalidReason != null ? (
          <div className="invalid-reason" hidden={valid}>
            <small>{button.invalidReason}</small>
          </div>
        ) : (
          <></>
        )}
      </td>
      <td>{button.description}</td>
    </tr>
  );
}

export default Setting;
