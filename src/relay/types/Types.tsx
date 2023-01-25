export type SettingValidator = (value: string, objects: object) => boolean;

export enum RelayComponentType {
  BOOLEAN = "boolean",
  DROPDOWN = "dropdown",
  STRING = "string",
  HTML = "html",
  INTERRUPT = "interrupt",
  TAGS = "tags"
}

export interface InterruptPreference {
  preference: string;
  value: string;
}

export interface ComponentDropdown {
  display: string;
  value: string;
}

export interface RelayComponent {
  type: RelayComponentType;
}

export interface RelayContainer extends RelayComponent {
  components: RelayComponent[];
}

export interface ComponentHtml extends RelayComponent {
  data: string;
}

export interface ComponentSetting extends RelayComponent {
  name: string; // Display name
  description: string; // Display description
  preference: string; // Preference to set
  value: string; // Current value
  default: string;
  setValue: (value: string) => void;
  previousValue: string; // Value before the setting was updated
  validate: SettingValidator; // A javascript function that accepts (string, object) => boolean, where object is a { pref : value } of all the settings this relay page has
  invalidReason: string;
  dropdown: ComponentDropdown[]; // Dropdown values if dropdown
  placeholderText: string; // Text that displays in string inputs if no text
  allowDuplicateTags: boolean; // If duplicate tags can be input, case insensitive. Default true
  tagsSeperator: string; // Text that seperates each tag from each other. Defaults to `,`
  maxTags: string;
}

export interface ComponentInterrupt extends RelayComponent {
  name: string;
  notification: string;
  actions: InterruptPreference[];
}

export interface ComponentPage {
  file?: string;
  page: string; // The name of the page
  components: RelayComponent[];
}

declare global {
  function getData(callback: (pages: ComponentPage[]) => void): void;
}
