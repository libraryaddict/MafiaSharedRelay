import { formFields, write } from "kolmafia";
import { RelayPage, ExtraHtml } from "./RelayTypes";
import {
  generateHTML,
  getPagePath,
  handleApiRequest,
  parseCssFromFile,
  parsePageFromFile,
} from "./RelayUtils";

export function main(...pagesToLoad: (string | RelayPage)[]) {
  if (handleApiRequest()) {
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
    for (const pageName of pagesToLoad) {
      try {
        let page: RelayPage = null;

        // If the parameter is a string, then try to load from file
        if (typeof pageName == "string") {
          cssFile = parseCssFromFile(pageName);
          page = parsePageFromFile(pageName);
        } else {
          page = pageName;
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
      } catch (e) {
        write(
          "<h2>An error occured while trying to load " +
            (typeof pageName == "string"
              ? getPagePath(pageName) + ", is your json properly formatted?"
              : "a relay page") +
            "</h2>"
        );

        if (e) {
          write("<br>");
          write(e);

          if (e.stack) {
            for (let s of e.stack.split("\n") as string[]) {
              while (s.match(/\t|\r/)) {
                s = s.replace(/\t|\r/, "");
              }

              write("<br>");
              write(s);
            }
          }
        }
        return;
      }
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
