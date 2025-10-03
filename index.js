"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
var App_tsx_1 = require("./App.tsx");
var rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}
var root = client_1.default.createRoot(rootElement);
root.render(<react_1.default.StrictMode>
    <App_tsx_1.default />
  </react_1.default.StrictMode>);
