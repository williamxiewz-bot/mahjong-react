import { getTileChar } from '../mahjongGame';
import './TableArea.css';

function TableArea({ discardedTiles, lastDiscarded, onTileClick }) {
  const renderTile = (tile, index) => {
    const isLast = lastDiscarded?.id === tile.id;
    return (
      <div 
        key={`${tile.id}-${index}`}
        className={`discarded-tile ${isLast ? 'last-discarded' : ''}`}
        onClick={() => onTileClick && onTileClick(tile)}
      >
        {getTileChar(tile)}
      </div>
    );
  };

  const rows = [[], [], [], [], [], []];
  discardedTiles.forEach((tile, index) => {
    rows[index % 6].push({ tile, index });
  });

  return (
    <div className="table-area">
      <div className="table-center">
        <div className="mahjong-logo">🀄</div>
        <div className="dice-area">🎲</div>
      </div>
      <div className="discards">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="discard-row">
            {row.map(({ tile, index }) => renderTile(tile, index))}
          </div>
        ))}
      </div>
      <div className="remaining-count">
        剩余: {136 - discardedTiles.length} 🀄
      </div>
    </div>
  );
}

export default TableArea;
