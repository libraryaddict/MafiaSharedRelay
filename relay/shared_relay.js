/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 616:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ar": () => (/* binding */ generateHTML),
/* harmony export */   "jU": () => (/* binding */ parsePageFromFile)
/* harmony export */ });
/* unused harmony exports RelayComponentType, validateComponents, parsePageFromJson */
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(530);
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(kolmafia__WEBPACK_IMPORTED_MODULE_0__);
function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _iterableToArrayLimit(arr, i) {var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];if (_i == null) return;var _arr = [];var _n = true;var _d = false;var _s, _e;try {for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _iterableToArray(iter) {if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) return _arrayLikeToArray(arr);}function _createForOfIteratorHelper(o, allowArrayLike) {var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];if (!it) {if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {if (it) o = it;var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e2) {throw _e2;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var normalCompletion = true,didErr = false,err;return { s: function s() {it = it.call(o);}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e3) {didErr = true;err = _e3;}, f: function f() {try {if (!normalCompletion && it.return != null) it.return();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}







var RelayComponentType;(function (RelayComponentType) {RelayComponentType["BOOLEAN"] = "boolean";RelayComponentType["DROPDOWN"] = "dropdown";RelayComponentType["STRING"] = "string";RelayComponentType["HTML"] = "html";RelayComponentType["INTERRUPT"] = "interrupt";})(RelayComponentType || (RelayComponentType = {}));
















































function validateComponents(components) {var _iterator = _createForOfIteratorHelper(
    components),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var _button$name;var component = _step.value;
      var button = component;

      if (button.preference == null) {
        continue;
      }

      button.name = (_button$name = button.name) !== null && _button$name !== void 0 ? _button$name : button.preference;

      if (button.value != null) {
        continue;
      }

      var val = void 0;

      if ((0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.propertyExists)(button.preference)) {
        val = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.getProperty)(button.preference);
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
    }} catch (err) {_iterator.e(err);} finally {_iterator.f();}
}

function generateHTML(
pages,
extraHtml)
{
  pages = pages.filter((p) => p != null);var _iterator2 = _createForOfIteratorHelper(

    pages),_step2;try {for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {var page = _step2.value;
      validateComponents(page.components);
    }} catch (err) {_iterator2.e(err);} finally {_iterator2.f();}

  var buffer = [];

  var cssFiles = ["/shared_relay/main.css"];

  if (extraHtml && extraHtml.cssFiles) {
    cssFiles.push.apply(cssFiles, _toConsumableArray(extraHtml.cssFiles));
  }

  buffer.push("<head>");

  cssFiles.forEach((s) => {
    buffer.push("<link rel=\"stylesheet\" href=\"".concat(s, "\">"));
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
  buffer.push("let getData = function(callback) {callback(".concat(
  JSON.stringify(pages), ")}"));


  // close notifications when they are clicked on
  buffer.push("document.onclick = (e) => {\n    if(e.target.classList.contains('notification')) e.target.remove();\n  }");



  buffer.push("</script>");

  // include react script
  buffer.push('<script src="./shared_relay/shared_relay.js"></script>');

  return buffer.join("\n");
}

/**
 * Parses from relay/shared_relay/pages/ if no slashes are in the name, otherwise expects a valid json file
 */
function parsePageFromFile(file) {
  var fileName = file.includes("/") ?
  file :
  "relay/shared_relay/pages/" + file + ".json";

  var data = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.fileToBuffer)(fileName);

  return parsePageFromJson(file, data);
}

function parsePageFromJson(id, jsonData) {
  if (jsonData.length == 0) {
    return null;
  }

  var subpage = JSON.parse(jsonData);

  subpage.file = id;

  for (var _i = 0, _arr = subpage.components; _i < _arr.length; _i++) {var _button$dropdown;var button = _arr[_i];
    if (button.type != RelayComponentType.DROPDOWN) {
      continue;
    }

    if (button.dropdown == null) {
      button.dropdown = [];
    } else if (typeof button.dropdown[0] == "string") {
      button.dropdown = button.dropdown.map((s) => {
        return {
          display: s,
          value: s
        };
      });
    }

    if (button.dropdownFiller == null) {
      continue;
    }

    var data =
    eval(button.dropdownFiller).
    map((_ref) => {var _ref2 = _slicedToArray(_ref, 2),display = _ref2[0],value = _ref2[1];
      return {
        display: display,
        value: value
      };
    });

    (_button$dropdown = button.dropdown).push.apply(_button$dropdown, _toConsumableArray(data));
  }

  return subpage;
}

/***/ }),

/***/ 530:
/***/ ((module) => {

module.exports = require("kolmafia");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "main": () => (/* binding */ main)
/* harmony export */ });
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(530);
/* harmony import */ var kolmafia__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(kolmafia__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _RelayUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(616);
function _createForOfIteratorHelper(o, allowArrayLike) {var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];if (!it) {if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {if (it) o = it;var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var normalCompletion = true,didErr = false,err;return { s: function s() {it = it.call(o);}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it.return != null) it.return();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}


function main() {for (var _len = arguments.length, pagesToLoad = new Array(_len), _key = 0; _key < _len; _key++) {pagesToLoad[_key] = arguments[_key];}
  var fields = (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.formFields)();

  if (fields["api"] != null) {
    var returns = eval(fields["api"]) || "";
    // We include the ' ' because otherwise the browser doesn't like an empty page
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.write)(returns + (returns ? "" : " "));
    return;
  }

  if (pagesToLoad.length == 0) {
    // Find any 'page' or 'pages' parameters
    pagesToLoad = (fields["page"] || fields["pages"] || "").
    split(",").
    filter((s) => s.length > 0);
  }

  var pages = [];

  if (pagesToLoad.length > 0) {var _iterator = _createForOfIteratorHelper(
      pagesToLoad),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var page = _step.value;
        // If the parameter is a string, then try to load from file
        if (typeof page == "string") {
          page = (0,_RelayUtils__WEBPACK_IMPORTED_MODULE_1__/* .parsePageFromFile */ .jU)(page);
        }

        if (page == null) {
          continue;
        }

        // Assume at this point it must be a RelayPage
        pages.push(page);
      }} catch (err) {_iterator.e(err);} finally {_iterator.f();}
  }

  if (pages.length == 0) {
    (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.write)(
    "<h3>The relay script could not find any pages to load, either invalid/missing pages were provided or nothing was.</h3>");

    return;
  }

  (0,kolmafia__WEBPACK_IMPORTED_MODULE_0__.write)((0,_RelayUtils__WEBPACK_IMPORTED_MODULE_1__/* .generateHTML */ .ar)(pages));
}
})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;