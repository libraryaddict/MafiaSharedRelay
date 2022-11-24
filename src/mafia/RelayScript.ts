import { formFields, write } from "kolmafia";
import { generateHTML, parsePageFromFile, RelayPage } from "./RelayUtils";

export function main(...pagesToLoad: (string | RelayPage)[]) {
  const fields = formFields();

  if (fields["api"] != null) {
    const returns = eval(fields["api"]) || "";
    // We include the ' ' because otherwise the browser doesn't like an empty page
    write(returns + (returns ? "" : " "));
    return;
  }

  if (pagesToLoad.length == 0) {
    // Find any 'page' or 'pages' parameters
    pagesToLoad = (fields["page"] || fields["pages"] || "")
      .split(",")
      .filter((s) => s.length > 0);
  }

  const pages = [];

  if (pagesToLoad.length > 0) {
    for (let page of pagesToLoad) {
      // If the parameter is a string, then try to load from file
      if (typeof page == "string") {
        page = parsePageFromFile(page);
      }

      if (page == null) {
        continue;
      }

      // Assume at this point it must be a RelayPage
      pages.push(page);
    }
  }

  if (pages.length == 0) {
    write(
      "<h3>The relay script could not find any pages to load, either invalid/missing pages were provided or nothing was.</h3>"
    );
    return;
  }

  write(generateHTML(pages));
}
