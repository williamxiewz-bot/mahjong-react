import { r as reactExports, j as jsxRuntimeExports } from "./index-BpZusJOR.js";
import { T as Tile } from "./Tile-CE26e5cE.js";
const PlayerHand = reactExports.memo(function PlayerHand2({
  hand,
  selectedTile,
  onTileClick,
  lastDrawn,
  pengs,
  gangs,
  chis,
  chiOptions = [],
  selectedChiOption = -1,
  onChiOptionClick
}) {
  const sortedHand = reactExports.useMemo(() => {
    return [...hand].sort((a, b) => {
      if (a.suit !== b.suit) return a.suit - b.suit;
      return a.num - b.num;
    });
  }, [hand]);
  const handleTileClick = reactExports.useCallback((tile) => {
    onTileClick(tile);
  }, [onTileClick]);
  const renderHand = reactExports.useMemo(() => {
    return sortedHand.map((tile) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tile,
      {
        tile,
        selected: selectedTile?.id === tile.id,
        onClick: handleTileClick,
        size: lastDrawn?.id === tile.id ? "large" : ""
      },
      tile.id
    ));
  }, [sortedHand, selectedTile, handleTileClick, lastDrawn]);
  const renderMelds = reactExports.useMemo(() => {
    const melds = [];
    pengs?.forEach((p, i) => melds.push({ type: "peng", tiles: p, key: `peng-${i}` }));
    gangs?.forEach((g, i) => melds.push({ type: "gang", tiles: g, key: `gang-${i}` }));
    chis?.forEach((c, i) => melds.push({ type: "chi", tiles: c, key: `chi-${i}` }));
    return melds.map((meld) => {
      if (meld.type === "peng") {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meld peng", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { tile: meld.tiles[0], size: "small" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { tile: meld.tiles[1], size: "small" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { tile: meld.tiles[2], size: "small" })
        ] }, meld.key);
      }
      if (meld.type === "gang") {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meld gang", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { tile: meld.tiles[0], size: "small" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { tile: meld.tiles[1], size: "small" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { tile: meld.tiles[2], size: "small" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { tile: meld.tiles[3], size: "small" })
        ] }, meld.key);
      }
      if (meld.type === "chi") {
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meld chi", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { tile: meld.tiles[0], size: "small" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { tile: meld.tiles[1], size: "small" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tile, { tile: meld.tiles[2], size: "small" })
        ] }, meld.key);
      }
      return null;
    });
  }, [pengs, gangs, chis]);
  const renderChiOptions = reactExports.useMemo(() => {
    if (chiOptions.length === 0) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chi-options-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "选择要吃的牌：" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chi-options", children: chiOptions.map((option, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `chi-option-btn ${selectedChiOption === idx ? "selected" : ""}`,
          onClick: () => onChiOptionClick?.(idx),
          children: option.map((t) => `${t.suit}-${t.num}`).join(" + ")
        },
        idx
      )) })
    ] });
  }, [chiOptions, selectedChiOption, onChiOptionClick]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "player-hand", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "melds", children: renderMelds }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hand-tiles", children: renderHand }),
    renderChiOptions
  ] });
});
export {
  PlayerHand as default
};
