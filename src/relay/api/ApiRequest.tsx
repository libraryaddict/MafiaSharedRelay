import { ComponentSetting } from "../types/Types";

export function addNotification(notification: string) {
  const ele = document.createElement("div");
  ele.className = "notification";
  ele.addEventListener("animationend", () => ele.remove());
  ele.innerText = notification;

  const container = document.getElementById("notificationsContainer");

  if (!container) {
    return;
  }

  container.appendChild(ele);
}

export function saveSettings(
  properties: ComponentSetting[]
): Promise<string[]> {
  return setProperties(
    properties
      .filter((p) => {
        if (p.previousValue === p.value) {
          return false;
        }

        p.previousValue = p.value;
        return true;
      })
      .map((prop) => [prop.preference, prop.value.trim()])
  );
}

export function setProperties(
  properties: [string, string][]
): Promise<string[]> {
  return runRelay("setProperties", JSON.stringify(properties)).then((val) =>
    JSON.parse(val)
  );
}

async function runRelay(formName: string, param: string): Promise<string> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "text";
    xhr.open("POST", document.location.href, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(formName + "=" + encodeURIComponent(param));
    xhr.onreadystatechange = () => {
      if (xhr.readyState != 4 || xhr.status != 200) {
        return;
      }

      resolve(xhr.responseText);
    };
  });
}
