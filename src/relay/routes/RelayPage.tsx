import * as React from "react";
import { addNotification, saveSettings } from "../api/ApiRequest";
import Interrupt from "../components/Interrupt";
import Setting from "../components/settings/Setting";
import {
  ComponentSetting,
  RelayComponentType,
  RelayComponent,
  ComponentHtml,
  ComponentPage,
  ComponentInterrupt
} from "../types/Types";

function RelayPage({ page }: { page: ComponentPage }): JSX.Element {
  const groups: (RelayComponent | RelayComponent[])[] = [];
  let currentGroup: RelayComponent[] | null = null;

  for (const component of page.components) {
    if (
      component.type == RelayComponentType.HTML ||
      component.type == RelayComponentType.INTERRUPT
    ) {
      groups.push(component as ComponentHtml);
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

  groups.forEach((components) => {
    if ((components as RelayComponent).type == RelayComponentType.HTML) {
      const html = components as ComponentHtml;

      if (html.data == null) {
        return;
      }

      elements.push(
        <div
          dangerouslySetInnerHTML={{
            __html: (components as ComponentHtml).data
          }}
        />
      );
      return;
    }

    if ((components as RelayComponent).type == RelayComponentType.INTERRUPT) {
      elements.push(
        <Interrupt button={components as ComponentInterrupt}></Interrupt>
      );
      return;
    }

    const buttons = components as ComponentSetting[];

    elements.push(
      <table>
        <tbody>
          {buttons.map((setting, index) => (
            <Setting key={index} button={setting} />
          ))}
        </tbody>
      </table>
    );
  });

  return (
    <>
      {" "}
      {elements} <br></br>
      <input
        className="save"
        onClick={() =>
          saveSettings(
            (page.components as ComponentSetting[]).filter(
              (b) => b.preference != null
            )
          ).then((e) => {
            const changed: [string, string, string][] = JSON.parse(e);

            for (const [prop, prev, now] of changed) {
              addNotification(`${prop} changed from \`${prev}\` to \`${now}\``);
            }

            if (changed.length == 0) {
              addNotification("No settings were modified.");
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
