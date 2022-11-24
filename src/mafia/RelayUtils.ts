import { propertyExists, getProperty, fileToBuffer } from "kolmafia";

export interface RelayPage {
  file?: string;
  page: string; // The name of the page
  components: RelayComponent[];
}

export enum RelayComponentType {
  BOOLEAN = "boolean",
  DROPDOWN = "dropdown",
  STRING = "string",
  HTML = "html",
  INTERRUPT = "interrupt",
}

export interface RelayComponent {
  type: RelayComponentType;
}

export interface ComponentInterrupt extends RelayComponent {
  name: string;
  notification?: string;
  actions: RelayPreference[];
  css?: string;
}

export interface RelayPreference {
  preference: string;
  value: string;
}

export interface ComponentHtml extends RelayComponent {
  data?: string; // If missing, will be skipped. Useful for splitting setting buttons into different tables.
}

export interface ComponentSetting extends RelayComponent {
  name?: string; // Display name, if missing will default to preference
  description: string; // Display description
  preference: string; // Preference to set/load from
  default?: string; // Value to default to if preference has not been set
  value?: string; // Current value, is set on runtime
  //  validates: string; // A javascript function that accepts (string, object) => boolean, where object is a { pref : value } of all the settings this relay page has
  dropdown?: ComponentDropdown[]; // Dropdown values if dropdown setting
  dropdownFiller?: string;
}

export interface ComponentDropdown {
  display?: string;
  value: string;
}

export interface ExtraHtml {
  cssFiles?: string[]; // Points to a file.css
  css?: string; // Inline css, basically contents of a css file
}

export function validateComponents(components: RelayComponent[]) {
  for (const component of components) {
    const button = component as ComponentSetting;

    if (button.preference == null) {
      continue;
    }

    button.name = button.name ?? button.preference;

    if (button.value != null) {
      continue;
    }

    let val: string;

    if (propertyExists(button.preference)) {
      val = getProperty(button.preference);
    } else if (button.default != null) {
      val = button.default;
    } else {
      if (button.type == RelayComponentType.DROPDOWN) {
        val = button.dropdown[0].value;
      } else if (button.type == RelayComponentType.BOOLEAN) {
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

  const cssFiles = ["/shared_relay/main.css"];

  if (extraHtml && extraHtml.cssFiles) {
    cssFiles.push(...extraHtml.cssFiles);
  }

  buffer.push("<head>");

  cssFiles.forEach((s) => {
    buffer.push(`<link rel="stylesheet" href="${s}">`);
  });

  if (extraHtml && extraHtml.css) {
    buffer.push("<style>");

    buffer.push(extraHtml.css);

    buffer.push("</style>");
  }

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
  buffer.push('<script src="./shared_relay/shared_relay.js"></script>');

  return buffer.join("\n");
}

/**
 * Parses from relay/shared_relay/pages/ if no slashes are in the name, otherwise expects a valid json file
 */
export function parsePageFromFile(file: string): RelayPage {
  let fileName = file.includes("/")
    ? file
    : "relay/shared_relay/pages/" + file + ".json";

  if (!fileName.endsWith(".json") && fileToBuffer(fileName).length == 0) {
    fileName += ".json";
  }

  const data = fileToBuffer(fileName);

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
    if (button.type != RelayComponentType.DROPDOWN) {
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
