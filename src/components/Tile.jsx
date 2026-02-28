import { getTileChar } from '../mahjongGame';
import './Tile.css';

function Tile({ tile, selected, onClick, faceDown, size }) {
  const handleClick = () => {
    if (onClick && !faceDown) {
      onClick(tile);
    }
  };

  return (
    <div 
      className={`tile ${selected ? 'selected' : ''} ${size || ''} ${faceDown ? 'face-down' : ''}`}
      onClick={handleClick}
    >
      {faceDown ? '🀫' : getTileChar(tile)}
    </div>
  );
}

export default Tile;
