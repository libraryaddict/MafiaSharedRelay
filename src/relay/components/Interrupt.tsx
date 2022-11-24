import * as React from "react";
import { setProperties, addNotification } from "../api/ApiRequest";
import { ComponentInterrupt } from "../types/Types";

function Interrupt({ button }: { button: ComponentInterrupt }): JSX.Element {
  const CSSstring = (string: string) => {
    const css_json = `{"${string
      .replace(/; /g, '", "')
      .replace(/: /g, '": "')
      .replace(";", "")}"}`;

    const obj = JSON.parse(css_json);

    const keyValues = Object.keys(obj).map((key) => {
      const camelCased = key.replace(/-[a-z]/g, (g) => g[1].toUpperCase());
      return { [camelCased]: obj[key] };
    });

    return Object.assign({}, ...keyValues);
  };

  return (
    <input
      className="interrupt"
      style={button.css ? CSSstring(button.css) : null}
      type="submit"
      value={button.name}
      onClick={() => {
        setProperties(
          button.actions.map(({ preference, value }) => [preference, value])
        ).then(() => addNotification(button.notification || "Interrupted!"));
      }}
    />
  );
}

export default Interrupt;
