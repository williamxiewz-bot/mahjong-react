import { memo, useMemo } from 'react';
import './ActionButtons.css';

interface ActionButtonsProps {
  onHu: () => void;
  onPeng: () => void;
  onGang: () => void;
  onChi: () => void;
  onPass: () => void;
  onDraw: () => void;
  canHu: boolean;
  canPeng: boolean;
  canGang: boolean;
  canChi: boolean;
  isMyTurn: boolean;
  hasDrawn: boolean;
  canPass?: boolean; // 是否有可以放弃的行动
}

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
  hasDrawn,
  canPass = false
}: ActionButtonsProps) {
  // 有可以胡/碰/吃/杠的选择时，才能"过"
  const showPass = canPass || canHu || canPeng || canGang || canChi;
  
  const buttons = useMemo(() => {
    const btns: JSX.Element[] = [];
    
    if (isMyTurn && !hasDrawn) {
      btns.push(
        <button key="draw" className="action-btn draw-btn" onClick={onDraw}>
          摸牌 <span className="key-hint">Space</span>
        </button>
      );
    }
    
    if (canHu) {
      btns.push(
        <button key="hu" className="action-btn hu-btn" onClick={onHu}>
          胡 🀅 <span className="key-hint">H</span>
        </button>
      );
    }
    
    if (canPeng) {
      btns.push(
        <button key="peng" className="action-btn peng-btn" onClick={onPeng}>
          碰 <span className="key-hint">P</span>
        </button>
      );
    }
    
    if (canGang) {
      btns.push(
        <button key="gang" className="action-btn gang-btn" onClick={onGang}>
          杠 <span className="key-hint">G</span>
        </button>
      );
    }
    
    if (canChi) {
      btns.push(
        <button key="chi" className="action-btn chi-btn" onClick={onChi}>
          吃 <span className="key-hint">C</span>
        </button>
      );
    }
    
    // 只有在有胡/碰/吃/杠的选择时，才显示"过"按钮
    if (showPass) {
      btns.push(
        <button key="pass" className="action-btn pass-btn" onClick={onPass}>
          过 <span className="key-hint">Esc</span>
        </button>
      );
    }
    
    return btns;
  }, [isMyTurn, hasDrawn, canHu, canPeng, canGang, canChi, showPass, onHu, onPeng, onGang, onChi, onPass, onDraw]);

  return (
    <div className="action-buttons" role="group" aria-label="游戏操作">
      {buttons}
    </div>
  );
});

export default ActionButtons;
