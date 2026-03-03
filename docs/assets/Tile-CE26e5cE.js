import { r as reactExports, j as jsxRuntimeExports, g as getTileChar } from "./index-BpZusJOR.js";
const Tile = reactExports.memo(function Tile2({ tile, selected = false, onClick, faceDown = false, size = "", className = "" }) {
  const handleClick = reactExports.useCallback(() => {
    if (onClick && !faceDown && tile) {
      onClick(tile);
    }
  }, [onClick, tile, faceDown]);
  const tileClass = `tile ${selected ? "selected" : ""} ${size || ""} ${faceDown ? "face-down" : ""} ${className}`.trim();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: tileClass,
      "data-suit": tile?.suit?.toString(),
      onClick: handleClick,
      role: "button",
      "aria-pressed": selected,
      tabIndex: faceDown ? -1 : 0,
      children: faceDown ? "🀫" : tile ? getTileChar(tile) : ""
    }
  );
});
export {
  Tile as T
};
