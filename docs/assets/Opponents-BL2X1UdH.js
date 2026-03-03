import { r as reactExports, j as jsxRuntimeExports } from "./index-BpZusJOR.js";
const Opponents = reactExports.memo(function Opponents2({ opponents }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opponents", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opponent top-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opponent-name", children: opponents.left?.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opponent-hand horizontal", children: Array.from({ length: opponents.left?.handCount || 13 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opponent-tile back" }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opponent top", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opponent-name", children: opponents.opposite?.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opponent-hand horizontal", children: Array.from({ length: opponents.opposite?.handCount || 13 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opponent-tile back" }, i)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opponent top-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opponent-name", children: opponents.right?.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opponent-hand horizontal", children: Array.from({ length: opponents.right?.handCount || 13 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opponent-tile back" }, i)) })
    ] })
  ] });
});
export {
  Opponents as default
};
