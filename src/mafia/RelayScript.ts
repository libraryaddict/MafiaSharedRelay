import { formFields, write } from "kolmafia";
import { RelayPage, ExtraHtml } from "./RelayTypes";
import {
  generateHTML,
  handledApiRequest,
  parseCssFromFile,
  parsePageFromFile,
} from "./RelayUtils";

export function main(...pagesToLoad: (string | RelayPage)[]) {
  if (handledApiRequest()) {
    return;
  }

  if (pagesToLoad.length == 0) {
    // Find any 'page' or 'pages' parameters
    pagesToLoad = (formFields()["page"] || formFields()["pages"] || "")
      .split(",")
      .filter((s) => s.length > 0);
  }

  const pages = [];
  let extraHtml: ExtraHtml;

  if (pagesToLoad.length > 0) {
    let cssFile: string;
    for (let page of pagesToLoad) {
      // If the parameter is a string, then try to load from file
      if (typeof page == "string") {
        cssFile = parseCssFromFile(page);
        page = parsePageFromFile(page);
      }

      if (page == null) {
        continue;
      }

      // Assume at this point it must be a RelayPage
      pages.push(page);

      if (cssFile == null) {
        continue;
      }

      if (extraHtml == null) {
        extraHtml = { cssFiles: [] };
      }

      extraHtml.cssFiles.push(cssFile);
    }
  }

  if (pages.length == 0) {
    write(
      "<h3>The relay script could not find any pages to load, either invalid/missing pages were provided or nothing was.</h3>"
    );
    return;
  }

  write(generateHTML(pages, extraHtml));
}
