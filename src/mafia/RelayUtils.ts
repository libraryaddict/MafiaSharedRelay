import {
  propertyExists,
  getProperty,
  fileToBuffer,
  formFields,
  write,
  print,
  setProperty,
  propertyHasDefault,
  propertyDefaultValue,
} from "kolmafia";
import {
  RelayComponent,
  RelaySetting,
  RelayPage,
  ExtraHtml,
  DropdownValue,
  RelayTags,
  RelayDropdown,
} from "./RelayTypes";

export function handleApiRequest(): boolean {
  if (handleJavascript()) {
    return true;
  }

  if (handleProperties()) {
    return true;
  }

  return false;
}

function handleProperties(): boolean {
  const toSet: string = formFields()["setProperties"];

  if (toSet == null) {
    return false;
  }

  const props: [string, string][] = JSON.parse(toSet);
  const notifications: string[] = [];

  for (const [key, value] of props) {
    const prevValue = getProperty(key);

    if (prevValue === value) {
      continue;
    }

    setProperty(key, value);
    notifications.push(`${key} changed from \`${prevValue}\` to \`${value}\``);
  }

  if (notifications.length == 0) {
    notifications.push("No settings were modified.");
  }

  // We include the ' ' because otherwise the browser doesn't like an empty page
  write(JSON.stringify(notifications));
  return true;
}

function handleJavascript(): boolean {
  const js = formFields()["javascript"];

  if (js == null) {
    return false;
  }

  const returns = eval(js) || "";
  // We include the ' ' because otherwise the browser doesn't like an empty page
  write(returns + (returns ? "" : " "));
  return true;
}

function validateComponents(components: RelayComponent[]) {
  for (const component of components) {
    const button = component as RelaySetting;

    if (button.preference == null) {
      continue;
    }

    button.name = button.name ?? button.preference;

    if (button.validate != null) {
      try {
        eval(button.validate);
      } catch (e) {
        print(`Unable to load ${button.name}'s validator '${button.validate}'`);
        button.validate = null;
      }
    }

    if (button.default != undefined && typeof button.default != "string") {
      button.default = button.default + "";
    }

    if (button.default == null && propertyHasDefault(button.preference)) {
      button.default = propertyDefaultValue(button.preference);
    }

    if (button.value != undefined && typeof button.value != "string") {
      button.value = button.value + "";
    }

    if (button.default == null && button.type == "boolean") {
      button.default = "true";
    }

    if (button.type == "tags") {
      const tags = button as RelayTags;
      if (tags.allowDuplicateTags == null) {
        tags.allowDuplicateTags = true;
      } else if (typeof tags.allowDuplicateTags == "string") {
        tags.allowDuplicateTags = tags.allowDuplicateTags == "true";
      }

      if (tags.tagsSeperator == null) {
        tags.tagsSeperator = ",";
      }

      if (button.placeholderText == null) {
        button.placeholderText = button.default ? button.default : "";
      }
    }

    if (button.value != null) {
      continue;
    }

    let val: string;

    if (propertyExists(button.preference)) {
      val = getProperty(button.preference);
    } else if (button.default != null) {
      val = button.default;
    } else {
      if (button.type == "dropdown") {
        if (typeof (button as RelayDropdown).dropdown[0] == "string") {
          val = (button as RelayDropdown).dropdown[0] as string;
        } else {
          val = ((button as RelayDropdown).dropdown[0] as DropdownValue).value;
        }
      } else if (button.type == "boolean") {
        val = "true";
      } else {
        val = "";
      }
    }

    button.value = val;
  }
}

export function generateHTML(
  pages: RelayPage[],
  extraHtml?: ExtraHtml
): string {
  pages = pages.filter((p) => p != null);

  for (const page of pages) {
    page.file = page.file ?? page.page;

    validateComponents(page.components);
  }

  const buffer: string[] = [];

  const cssFiles = [];

  if (extraHtml && extraHtml.cssFiles) {
    cssFiles.push(...extraHtml.cssFiles);
  }

  buffer.push("<!DOCTYPE html>");
  buffer.push("<head>");

  cssFiles.forEach((s) => {
    buffer.push(`<link rel="stylesheet" src="${s}">`);
  });

  buffer.push("<style>");
  buffer.push(`${require("../../built/react/main.css")}`);

  if (extraHtml && extraHtml.css) {
    buffer.push(extraHtml.css);
  }

  buffer.push("</style>");

  buffer.push("</head>");

  buffer.push('<div id="root"></div>');

  buffer.push("<script>");

  // add script that react calls when loaded to get kol data
  buffer.push(
    `let getData = function(callback) {callback(${JSON.stringify(pages)})}`
  );

  // close notifications when they are clicked on
  buffer.push(`document.onclick = (e) => {
    if(e.target.classList.contains('notification')) e.target.remove();
  }`);

  buffer.push("</script>");

  // include react script
  buffer.push(
    `<script src="${require("../../built/react/script.js")}"></script>`
  );

  return buffer.join("\n");
}

export function getPagePath(file: string) {
  let fileName = file.includes("/")
    ? file
    : "relay/shared_relay/pages/" + file + ".json";

  if (!fileName.endsWith(".json") && fileToBuffer(fileName).length == 0) {
    fileName += ".json";
  }

  return fileName;
}

/**
 * Parses from relay/shared_relay/pages/ if no slashes are in the name, otherwise expects a valid json file
 */
export function parsePageFromFile(file: string): RelayPage {
  const data = fileToBuffer(getPagePath(file));

  return parsePageFromJson(file, data);
}

export function parseCssFromFile(file: string): string | null {
  let fileName = file.includes("/")
    ? file
    : "relay/shared_relay/pages/" + file + ".css";

  if (!fileName.endsWith(".css")) {
    fileName += ".css";
  }

  const data = fileToBuffer(fileName);

  if (data.length == 0) {
    return null;
  }

  return data;
}

export function parsePageFromJson(id: string, jsonData: string): RelayPage {
  if (jsonData.length == 0) {
    return null;
  }

  const subpage = JSON.parse(jsonData) as RelayPage;

  subpage.file = id;

  for (const button of subpage.components as RelaySetting[]) {
    if (button.type != "dropdown") {
      continue;
    }

    const dropdown = button as RelayDropdown;

    if (dropdown.dropdown == null) {
      dropdown.dropdown = [];
    } else if (typeof dropdown.dropdown[0] == "string") {
      dropdown.dropdown = (dropdown.dropdown as unknown as string[]).map(
        (s) => {
          return {
            display: s,
            value: s,
          };
        }
      );
    }

    if (dropdown.dropdownFiller == null) {
      continue;
    }

    const data: DropdownValue[] = (
      eval(dropdown.dropdownFiller) as [string, string][]
    ).map(([display, value]) => {
      return {
        display: display,
        value: value,
      };
    });

    (dropdown.dropdown as DropdownValue[]).push(...data);
  }

  return subpage;
}
