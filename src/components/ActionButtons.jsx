import './ActionButtons.css';

function ActionButtons({ 
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
  return (
    <div className="action-buttons">
      {isMyTurn && !hasDrawn && (
        <button className="action-btn draw-btn" onClick={onDraw}>
          摸牌
        </button>
      )}
      
      {canHu && (
        <button className="action-btn hu-btn" onClick={onHu}>
          胡 🀅
        </button>
      )}
      
      {canPeng && (
        <button className="action-btn peng-btn" onClick={onPeng}>
          碰
        </button>
      )}
      
      {canGang && (
        <button className="action-btn gang-btn" onClick={onGang}>
          杠
        </button>
      )}
      
      {canChi && (
        <button className="action-btn chi-btn" onClick={onChi}>
          吃
        </button>
      )}
      
      {isMyTurn && hasDrawn && (
        <button className="action-btn pass-btn" onClick={onPass}>
          过
        </button>
      )}
    </div>
  );
}

export default ActionButtons;
