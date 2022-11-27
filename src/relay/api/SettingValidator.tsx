import React from "react";
import { ComponentSetting } from "../types/Types";

class SettingValidator {
  settings: [ComponentSetting, React.Dispatch<boolean>][] = [];
  object = {};

  addSetting(setting: ComponentSetting, setState: React.Dispatch<boolean>) {
    this.settings.push([setting, setState]);
  }

  updateSetting(setting: ComponentSetting) {
    this.object[setting.preference] = setting.value;
    this.doValidates();
  }

  updateObject() {
    for (const [setting] of this.settings) {
      this.object[setting.preference] = setting.value;
    }
  }

  doValidates() {
    for (const [setting, setValid] of this.settings) {
      setValid(this.isValid(setting));
    }
  }

  isValid(setting: ComponentSetting): boolean {
    return (
      setting.validate == null || setting.validate(setting.value, this.object)
    );
  }
}

export default SettingValidator;
