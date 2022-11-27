export type SettingValidator = (value: string, objects: object) => boolean;

export enum RelayComponentType {
  BOOLEAN = "boolean",
  DROPDOWN = "dropdown",
  STRING = "string",
  HTML = "html",
  INTERRUPT = "interrupt",
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

export interface ComponentHtml extends RelayComponent {
  data: string;
}

export interface ComponentSetting extends RelayComponent {
  name: string; // Display name
  description: string; // Display description
  preference: string; // Preference to set
  value: string; // Current value
  setValue: (value: string) => void;
  previousValue: string; // Value before the setting was updated
  validate: SettingValidator; // A javascript function that accepts (string, object) => boolean, where object is a { pref : value } of all the settings this relay page has
  invalidReason: string;
  dropdown: ComponentDropdown[]; // Dropdown values if dropdown
}

export interface ComponentInterrupt extends RelayComponent {
  name: string;
  notification: string;
  actions: InterruptPreference[];
  css: string;
}

export interface ComponentPage {
  file?: string;
  page: string; // The name of the page
  components: RelayComponent[];
}

declare global {
  function getData(callback: (pages: ComponentPage[]) => void): void;
}
