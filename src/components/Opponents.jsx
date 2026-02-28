import './Opponents.css';

function Opponent({ name, direction, handCount, lastDraw, melds }) {
  const renderTiles = () => {
    const tiles = [];
    for (let i = 0; i < handCount; i++) {
      tiles.push(
        <div 
          key={i} 
          className={`opponent-tile ${i === handCount - 1 && lastDraw ? 'just-drawn' : ''}`}
        >
          🀫
        </div>
      );
    }
    return tiles;
  };

  const getPositionClass = () => {
    switch (direction) {
      case 'top': return 'opponent-top';
      case 'left': return 'opponent-left';
      case 'right': return 'opponent-right';
      default: return '';
    }
  };

  const getRotation = () => {
    switch (direction) {
      case 'top': return 'rotate(180deg)';
      case 'left': return 'rotate(90deg)';
      case 'right': return 'rotate(-90deg)';
      default: return '';
    }
  };

  return (
    <div className={`opponent ${getPositionClass()}`}>
      <div className="opponent-info">
        <span className="opponent-name">{name}</span>
        <span className="opponent-count">{handCount} 🀄</span>
      </div>
      <div className="opponent-hand" style={{ transform: getRotation() }}>
        {renderTiles()}
      </div>
    </div>
  );
}

function Opponents({ opponents }) {
  return (
    <div className="opponents-container">
      <Opponent 
        name={opponents.top?.name || '上家'} 
        direction="top" 
        handCount={opponents.top?.handCount || 13}
        lastDraw={opponents.top?.lastDraw}
      />
      <Opponent 
        name={opponents.left?.name || '对家'} 
        direction="left" 
        handCount={opponents.left?.handCount || 13}
        lastDraw={opponents.left?.lastDraw}
      />
      <Opponent 
        name={opponents.right?.name || '下家'} 
        direction="right" 
        handCount={opponents.right?.handCount || 13}
        lastDraw={opponents.right?.lastDraw}
      />
    </div>
  );
}

export default Opponents;
