import { memo, useMemo } from 'react';
import './ActionButtons.css';

const ActionButtons = memo(function ActionButtons({ 
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
  hasDrawn
}) {
  const buttons = useMemo(() => {
    const btns = [];
    
    if (isMyTurn && !hasDrawn) {
      btns.push(
        <button key="draw" className="action-btn draw-btn" onClick={onDraw}>
          摸牌
        </button>
      );
    }
    
    if (canHu) {
      btns.push(
        <button key="hu" className="action-btn hu-btn" onClick={onHu}>
          胡 🀅
        </button>
      );
    }
    
    if (canPeng) {
      btns.push(
        <button key="peng" className="action-btn peng-btn" onClick={onPeng}>
          碰
        </button>
      );
    }
    
    if (canGang) {
      btns.push(
        <button key="gang" className="action-btn gang-btn" onClick={onGang}>
          杠
        </button>
      );
    }
    
    if (canChi) {
      btns.push(
        <button key="chi" className="action-btn chi-btn" onClick={onChi}>
          吃
        </button>
      );
    }
    
    if (isMyTurn && hasDrawn) {
      btns.push(
        <button key="pass" className="action-btn pass-btn" onClick={onPass}>
          过
        </button>
      );
    }
    
    return btns;
  }, [isMyTurn, hasDrawn, canHu, canPeng, canGang, canChi, onHu, onPeng, onGang, onChi, onPass, onDraw]);

  return (
    <div className="action-buttons" role="group" aria-label="游戏操作">
      {buttons}
    </div>
  );
});

export default ActionButtons;
