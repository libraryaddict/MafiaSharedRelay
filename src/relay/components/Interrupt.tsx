import * as React from "react";
import { setProperties, addNotification } from "../api/ApiRequest";
import { ComponentInterrupt } from "../types/Types";

function Interrupt({ button }: { button: ComponentInterrupt }): JSX.Element {
  return (
    <input
      className="interrupt"
      type="submit"
      value={button.name}
      data-name={button.name}
      onClick={() => {
        setProperties(
          button.actions.map(({ preference, value }) => [preference, value])
        ).then(() => addNotification(button.notification || "Interrupted!"));
      }}
    />
  );
}

export default Interrupt;
