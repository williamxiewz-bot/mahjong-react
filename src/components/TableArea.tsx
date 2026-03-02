import { memo, useMemo } from 'react';
import Tile from './Tile';
import type { Tile as TileType } from '../mahjongGame';
import './TableArea.css';

interface TableAreaProps {
  discardedTiles: TileType[];
  lastDiscarded: TileType | null;
}

const TableArea = memo(function TableArea({ discardedTiles, lastDiscarded }: TableAreaProps) {
  const renderTiles = useMemo(() => {
    return discardedTiles.map((tile, index) => (
      <Tile
        key={`${tile.id}-${index}`}
        tile={tile}
        className={lastDiscarded?.id === tile.id ? 'last-discarded' : ''}
      />
    ));
  }, [discardedTiles, lastDiscarded]);

  return (
    <div className="table-area">
      <div className="discarded-tiles">
        {renderTiles}
      </div>
    </div>
  );
});

export default TableArea;
