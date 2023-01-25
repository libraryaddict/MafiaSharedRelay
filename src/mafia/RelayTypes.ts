export interface PreferenceValue {
  preference: string;
  value: string;
}

export interface DropdownValue {
  display?: string;
  value: string;
}

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
  | "interrupt"
  | "tags";

export interface RelayComponent {
  type: RelayComponentType;
}

export interface RelayInterrupt extends RelayComponent {
  type: "interrupt";
  name: string;
  notification?: string;
  actions: PreferenceValue[];
}

export interface RelayHtml extends RelayComponent {
  type: "html";
  data?: string; // If missing, will be skipped. Useful for splitting setting buttons into different tables.
}

export interface RelaySetting extends RelayComponent {
  type: "boolean" | "dropdown" | "string" | "tags";
  name?: string; // Display name, if missing will default to preference
  preference: string; // Preference to set/load from
  description: string; // Display description
  default?: string; // Value to default to if preference has not been set. If boolean, will default to true if missing
  value?: string; // Current value, is set on runtime
  validate?: string; // A javascript function that accepts (string, object) => boolean, where object is a { pref : value } of all the settings this relay page has
  invalidReason?: string; // Reason this is invalid if 'validate' is false
  placeholderText: string; // Text that displays in string inputs if no text, default is <Default Value>
}

export interface RelayDropdown extends RelaySetting {
  type: "dropdown" | "tags";
  dropdown?: DropdownValue[] | string[]; // Dropdown values if dropdown setting
  dropdownFiller?: string;
}

export interface RelayTags extends RelayDropdown {
  type: "tags";
  allowDuplicateTags?: boolean; // If using the tags, do we allow dupes. Comparison is case insensitive. Default true
  tagsSeperator?: string; // Text that seperates each tag from each other. Defaults to `,`
  maxTags?: number;
}

export interface ExtraHtml {
  cssFiles?: string[]; // Points to a file.css
  css?: string; // Inline css, basically contents of a css file
}
