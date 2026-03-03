import { r as reactExports, j as jsxRuntimeExports } from "./index-BpZusJOR.js";
import { T as Tile } from "./Tile-CE26e5cE.js";
const TableArea = reactExports.memo(function TableArea2({ discardedTiles, lastDiscarded }) {
  const renderTiles = reactExports.useMemo(() => {
    return discardedTiles.map((tile, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tile,
      {
        tile,
        className: lastDiscarded?.id === tile.id ? "last-discarded" : ""
      },
      `${tile.id}-${index}`
    ));
  }, [discardedTiles, lastDiscarded]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "table-area", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "discarded-tiles", children: renderTiles }) });
});
export {
  TableArea as default
};
