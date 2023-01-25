import React, { useState } from "react";
import SettingValidator from "../../api/SettingValidator";
import { ComponentSetting, RelayComponentType } from "../../types/Types";
import BooleanInput from "./BooleanInput";
import DropdownInput from "./DropdownInput";
import StringInput from "./StringInput";
import TagsInput from "./TagsInput";

function Setting({
  button,
  validator
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
    <tr className="userPreference" data-name={button.name}>
      <td className="setting">
        {button.name}
        <div className="settingNameHover">{button.preference}</div>
      </td>
      <td className={valid ? "settingInput" : "settingInput invalid-setting"}>
        {button.type === RelayComponentType.BOOLEAN ? (
          <BooleanInput button={button} />
        ) : button.type === RelayComponentType.DROPDOWN ? (
          <DropdownInput button={button} />
        ) : button.type == RelayComponentType.TAGS ? (
          <TagsInput button={button} />
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

        <div className="hoverBox">
          <small className="settingDefaultHover">
            {button.default != null
              ? "Default: " +
                (button.default == "" ? "<Empty>" : button.default)
              : "Default not set"}
          </small>
        </div>
      </td>
      <td>{button.description}</td>
    </tr>
  );
}

export default Setting;
