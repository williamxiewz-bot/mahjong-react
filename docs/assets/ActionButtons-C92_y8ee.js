import { r as reactExports, j as jsxRuntimeExports } from "./index-BpZusJOR.js";
const ActionButtons = reactExports.memo(function ActionButtons2({
  onHu,
  onPeng,
  onGang,
  onChi,
  onPass,
  onDraw,
  canHu,
  canPeng,
  canGang,
  canChi,
  isMyTurn,
  hasDrawn,
  canPass = false
}) {
  const showPass = canPass || canHu || canPeng || canGang || canChi;
  const buttons = reactExports.useMemo(() => {
    const btns = [];
    if (isMyTurn && !hasDrawn) {
      btns.push(
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "action-btn draw-btn", onClick: onDraw, children: [
          "摸牌 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "key-hint", children: "Space" })
        ] }, "draw")
      );
    }
    if (canHu) {
      btns.push(
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "action-btn hu-btn", onClick: onHu, children: [
          "胡 🀅 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "key-hint", children: "H" })
        ] }, "hu")
      );
    }
    if (canPeng) {
      btns.push(
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "action-btn peng-btn", onClick: onPeng, children: [
          "碰 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "key-hint", children: "P" })
        ] }, "peng")
      );
    }
    if (canGang) {
      btns.push(
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "action-btn gang-btn", onClick: onGang, children: [
          "杠 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "key-hint", children: "G" })
        ] }, "gang")
      );
    }
    if (canChi) {
      btns.push(
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "action-btn chi-btn", onClick: onChi, children: [
          "吃 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "key-hint", children: "C" })
        ] }, "chi")
      );
    }
    if (showPass) {
      btns.push(
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "action-btn pass-btn", onClick: onPass, children: [
          "过 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "key-hint", children: "Esc" })
        ] }, "pass")
      );
    }
    return btns;
  }, [isMyTurn, hasDrawn, canHu, canPeng, canGang, canChi, showPass, onHu, onPeng, onGang, onChi, onPass, onDraw]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "action-buttons", role: "group", "aria-label": "游戏操作", children: buttons });
});
export {
  ActionButtons as default
};
