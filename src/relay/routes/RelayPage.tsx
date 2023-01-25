import * as React from "react";
import { addNotification, saveSettings } from "../api/ApiRequest";
import SettingValidator from "../api/SettingValidator";
import Interrupt from "../components/Interrupt";
import Setting from "../components/settings/Setting";
import {
  ComponentSetting,
  RelayComponentType,
  RelayComponent,
  ComponentHtml,
  ComponentInterrupt
} from "../types/Types";

function RelayPage({
  components
}: {
  components: RelayComponent[];
}): JSX.Element {
  const groups: (RelayComponent | RelayComponent[])[] = [];
  let currentGroup: RelayComponent[] | null = null;

  for (const component of components) {
    if (
      component.type == RelayComponentType.HTML ||
      component.type == RelayComponentType.INTERRUPT
    ) {
      groups.push(component);
      currentGroup = null;
      continue;
    }

    if (currentGroup == null) {
      currentGroup = [];
      groups.push(currentGroup);
    }

    currentGroup.push(component);
  }

  const elements: JSX.Element[] = [];
  const validator = new SettingValidator();

  groups.forEach((components, index) => {
    if ((components as RelayComponent).type == RelayComponentType.HTML) {
      const html = components as ComponentHtml;

      if (html.data == null) {
        return;
      }

      elements.push(
        <div
          key={`HTML ${index}`}
          dangerouslySetInnerHTML={{
            __html: (components as ComponentHtml).data
          }}
        />
      );
      return;
    }

    if ((components as RelayComponent).type == RelayComponentType.INTERRUPT) {
      elements.push(
        <Interrupt
          key={`Interrupt ${index}`}
          button={components as ComponentInterrupt}
        ></Interrupt>
      );
      return;
    }

    const buttons = components as ComponentSetting[];

    elements.push(
      <table key={`Table ${index}`} className="relayTable">
        <tbody>
          {buttons.map((setting, index) => (
            <Setting
              key={`Setting ${setting.name} ${setting.preference} ${index}`}
              button={setting}
              validator={validator}
            />
          ))}
        </tbody>
      </table>
    );
  });

  validator.updateObject();

  // If we have no settings in which we'd save stuff, don't bother rendering save button
  if (
    components.find((c) => (c as ComponentSetting).preference != null) == null
  ) {
    return <>{elements}</>;
  }

  return (
    <>
      {" "}
      {elements} <br></br>
      <input
        className="save"
        onClick={() =>
          saveSettings(
            (components as ComponentSetting[]).filter(
              (b) => b.preference != null
            )
          ).then((notifs) => {
            for (const notif of notifs) {
              addNotification(notif);
            }
          })
        }
        type="submit"
        value="Save Changes"
      />
    </>
  );
}

export default RelayPage;
