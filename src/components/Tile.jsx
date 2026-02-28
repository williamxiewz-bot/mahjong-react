import { memo, useCallback } from 'react';
import { getTileChar } from '../mahjongGame';
import './Tile.css';

const Tile = memo(function Tile({ tile, selected, onClick, faceDown, size }) {
  const handleClick = useCallback(() => {
    if (onClick && !faceDown) {
      onClick(tile);
    }
  }, [onClick, tile, faceDown]);

  const tileClass = `tile ${selected ? 'selected' : ''} ${size || ''} ${faceDown ? 'face-down' : ''}`;

  return (
    <div 
      className={tileClass}
      onClick={handleClick}
      role="button"
      aria-pressed={selected}
      tabIndex={faceDown ? -1 : 0}
    >
      {faceDown ? '🀫' : getTileChar(tile)}
    </div>
  );
});

export default Tile;
