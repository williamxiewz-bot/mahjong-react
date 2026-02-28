import { memo, useMemo, useCallback } from 'react';
import { getTileChar } from '../mahjongGame';
import './TableArea.css';

const TableArea = memo(function TableArea({ discardedTiles, lastDiscarded, onTileClick }) {
  const handleTileClick = useCallback((tile) => {
    if (onTileClick) {
      onTileClick(tile);
    }
  }, [onTileClick]);

  const rows = useMemo(() => {
    const result = [[], [], [], [], [], []];
    discardedTiles.forEach((tile, index) => {
      result[index % 6].push({ tile, index });
    });
    return result;
  }, [discardedTiles]);

  const remainingCount = useMemo(() => 136 - discardedTiles.length, [discardedTiles.length]);

  const renderTile = useCallback((tile, index) => {
    const isLast = lastDiscarded?.id === tile.id;
    return (
      <div 
        key={`${tile.id}-${index}`}
        className={`discarded-tile ${isLast ? 'last-discarded' : ''}`}
        onClick={() => handleTileClick(tile)}
      >
        {getTileChar(tile)}
      </div>
    );
  }, [lastDiscarded, handleTileClick]);

  return (
    <div className="table-area">
      <div className="table-center">
        <div className="mahjong-logo" aria-hidden="true">🀄</div>
        <div className="dice-area" aria-hidden="true">🎲</div>
      </div>
      <div className="discards">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="discard-row">
            {row.map(({ tile, index }) => renderTile(tile, index))}
          </div>
        ))}
      </div>
      <div className="remaining-count">
        剩余: {remainingCount} 🀄
      </div>
    </div>
  );
});

export default TableArea;
