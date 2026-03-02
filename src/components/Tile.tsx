import { memo, useCallback } from 'react';
import { getTileChar, type Tile } from '../mahjongGame';
import './Tile.css';

interface TileProps {
  tile: Tile | null;
  selected?: boolean;
  onClick?: (tile: Tile) => void;
  faceDown?: boolean;
  size?: 'small' | 'large' | '';
  className?: string;
}

const Tile = memo(function Tile({ tile, selected = false, onClick, faceDown = false, size = '', className = '' }: TileProps) {
  const handleClick = useCallback(() => {
    if (onClick && !faceDown && tile) {
      onClick(tile);
    }
  }, [onClick, tile, faceDown]);

  const tileClass = `tile ${selected ? 'selected' : ''} ${size || ''} ${faceDown ? 'face-down' : ''} ${className}`.trim();

  return (
    <div 
      className={tileClass}
      data-suit={tile?.suit}
      onClick={handleClick}
      role="button"
      aria-pressed={selected}
      tabIndex={faceDown ? -1 : 0}
    >
      {faceDown ? '🀫' : (tile ? getTileChar(tile) : '')}
    </div>
  );
});

export default Tile;
