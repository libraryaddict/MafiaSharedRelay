import {
  propertyExists,
  getProperty,
  fileToBuffer,
  formFields,
  write,
  print,
} from "kolmafia";
import {
  RelayComponent,
  ComponentSetting,
  RelayPage,
  ExtraHtml,
  ComponentDropdown,
} from "./RelayTypes";

export function handledApiRequest(): boolean {
  const fields = formFields();

  if (fields["api"] == null) {
    return false;
  }
  const returns = eval(fields["api"]) || "";
  // We include the ' ' because otherwise the browser doesn't like an empty page
  write(returns + (returns ? "" : " "));

  return true;
}

export function validateComponents(components: RelayComponent[]) {
  for (const component of components) {
    const button = component as ComponentSetting;

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
        val = button.dropdown[0].value;
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
    validateComponents(page.components);
  }

  const buffer: string[] = [];

  const cssFiles = [];

  if (extraHtml && extraHtml.cssFiles) {
    cssFiles.push(...extraHtml.cssFiles);
  }

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
    : "shared_relay/pages/" + file + ".css";

  if (!fileName.endsWith(".css")) {
    fileName += ".css";
  }

  const data = fileToBuffer(fileName);

  if (data.length == 0) {
    return null;
  }

  return fileName;
}

export function parsePageFromJson(id: string, jsonData: string): RelayPage {
  if (jsonData.length == 0) {
    return null;
  }

  const subpage = JSON.parse(jsonData) as RelayPage;

  subpage.file = id;

  for (const button of subpage.components as ComponentSetting[]) {
    if (button.type != "dropdown") {
      continue;
    }

    if (button.dropdown == null) {
      button.dropdown = [];
    } else if (typeof button.dropdown[0] == "string") {
      button.dropdown = (button.dropdown as unknown as string[]).map((s) => {
        return {
          display: s,
          value: s,
        };
      });
    }

    if (button.dropdownFiller == null) {
      continue;
    }

    const data: ComponentDropdown[] = (
      eval(button.dropdownFiller) as [string, string][]
    ).map(([display, value]) => {
      return {
        display: display,
        value: value,
      };
    });

    button.dropdown.push(...data);
  }

  return subpage;
}
