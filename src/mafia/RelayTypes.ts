export interface RelayPage {
  file?: string;
  page: string; // The name of the page
  components: RelayComponent[];
}

export type RelayComponentType =
  | "boolean"
  | "dropdown"
  | "string"
  | "html"
  | "interrupt";

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
  preference: string; // Preference to set/load from
  description: string; // Display description
  default?: string; // Value to default to if preference has not been set
  value?: string; // Current value, is set on runtime
  validate?: string; // A javascript function that accepts (string, object) => boolean, where object is a { pref : value } of all the settings this relay page has
  invalidReason?: string; // Reason this is invalid if 'validate' is false
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
