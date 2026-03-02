import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  createTiles, 
  shuffleTiles, 
  sortHand, 
  canPeng, 
  canGang, 
  canChi, 
  checkHu,
  type Tile
} from './mahjongGame';
import PlayerHand from './components/PlayerHand';
import Opponents from './components/Opponents';
import TableArea from './components/TableArea';
import ActionButtons from './components/ActionButtons';
import './App.css';

interface OpponentInfo {
  name: string;
  handCount: number;
  position: 'left' | 'opposite' | 'right';
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [tiles, setTiles] = useState<Tile[]>([]);
  
  // 玩家手牌
  const [playerHand, setPlayerHand] = useState<Tile[]>([]);
  const [playerLastDrawn, setPlayerLastDrawn] = useState<Tile | null>(null);
  const [playerPengs, setPlayerPengs] = useState<Tile[][]>([]);
  const [playerGangs, setPlayerGangs] = useState<Tile[][]>([]);
  
  // 弃牌区
  const [discardedTiles, setDiscardedTiles] = useState<Tile[]>([]);
  
  // 当前玩家 (0=玩家, 1=下家AI, 2=对家AI, 3=上家AI)
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);
  
  // 选中牌
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [lastDiscarded, setLastDiscarded] = useState<Tile | null>(null);
  
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState('');
  
  // 3个AI的手牌 [下家, 对家, 上家]
  const [aiHands, setAiHands] = useState<Tile[][]>([[], [], []]);
  
  const isPlayerTurn = currentPlayer === 0;
  
  // 定时器
  const timerRef = useRef<number | null>(null);

  // 清理定时器
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // 初始化游戏
  const startGame = useCallback(() => {
    clearTimer();
    setIsLoading(true);
    
    setTimeout(() => {
      const allTiles = shuffleTiles(createTiles());
      setTiles(allTiles);
      
      // 玩家在下家位置(0)
      const playerTiles = sortHand(allTiles.slice(14, 27));
      setPlayerHand(playerTiles);
      setPlayerLastDrawn(allTiles[27]);
      
      // AI手牌
      setAiHands([
        sortHand(allTiles.slice(0, 13)),    // 下家AI
        sortHand(allTiles.slice(28, 41)),   // 对家AI
        sortHand(allTiles.slice(42, 55)),   // 上家AI
      ]);
      
      setDiscardedTiles([]);
      setSelectedTile(null);
      setLastDiscarded(null);
      setCurrentPlayer(0);
      setHasDrawn(true);
      setPlayerPengs([]);
      setPlayerGangs([]);
      
      setGameStarted(true);
      setMessage('请选择要打出的牌');
      setIsLoading(false);
    }, 300);
  }, []);

  // 玩家摸牌
  const drawTile = useCallback(() => {
    if (!isPlayerTurn || hasDrawn) return;
    if (tiles.length === 0) {
      setMessage('流局！');
      setGameStarted(false);
      return;
    }
    
    const newTiles = [...tiles];
    const drawnTile = newTiles.shift();
    if (!drawnTile) return;
    setTiles(newTiles);
    
    const newHand = sortHand([...playerHand, drawnTile]);
    setPlayerHand(newHand);
    setPlayerLastDrawn(drawnTile);
    setHasDrawn(true);
    
    if (checkHu(newHand)) {
      setMessage('🎉 可以胡牌！');
    } else {
      setMessage('请选择要打出的牌');
    }
  }, [isPlayerTurn, hasDrawn, tiles, playerHand]);

  // 玩家打牌
  const discardTile = useCallback((tile: Tile) => {
    if (!isPlayerTurn || !hasDrawn) return;
    
    const newHand = playerHand.filter(t => t.id !== tile.id);
    setPlayerHand(newHand);
    setDiscardedTiles(prev => [...prev, tile]);
    setLastDiscarded(tile);
    setSelectedTile(null);
    setPlayerLastDrawn(null);
    setHasDrawn(false);
    
    // 切换到下家AI
    setCurrentPlayer(1);
    setMessage('下家摸牌中...');
    
    timerRef.current = window.setTimeout(() => {
      aiPlay(1);
    }, 800);
  }, [isPlayerTurn, hasDrawn, playerHand]);

  // 玩家碰牌
  const handlePeng = useCallback(() => {
    if (!lastDiscarded || !canPeng(playerHand, lastDiscarded)) return;
    
    const matchingTiles = playerHand.filter(t => t.suit === lastDiscarded.suit && t.num === lastDiscarded.num);
    if (matchingTiles.length < 2) return;
    
    const pengTiles: Tile[] = [lastDiscarded, matchingTiles[0], matchingTiles[1]];
    const newHand = playerHand.filter(t => t.id !== matchingTiles[0].id && t.id !== matchingTiles[1].id);
    
    setPlayerHand(newHand);
    setPlayerPengs(prev => [...prev, pengTiles]);
    setDiscardedTiles(prev => prev.filter(t => t.id !== lastDiscarded.id));
    setLastDiscarded(null);
    setHasDrawn(true);
    setMessage('碰了！请打出一张牌');
  }, [lastDiscarded, playerHand]);

  // 玩家杠牌
  const handleGang = useCallback(() => {
    if (!playerLastDrawn || !canGang(playerHand, playerLastDrawn)) return;
    
    const gangTiles = playerHand.filter(t => t.suit === playerLastDrawn.suit && t.num === playerLastDrawn.num);
    const newHand = playerHand.filter(t => t.id !== gangTiles[0].id && t.id !== gangTiles[1].id && t.id !== gangTiles[2].id);
    
    setPlayerHand(newHand);
    setPlayerGangs(prev => [...prev, [...gangTiles, playerLastDrawn]]);
    setPlayerLastDrawn(null);
    setHasDrawn(false);
    setMessage('杠了！继续摸牌');
    
    timerRef.current = window.setTimeout(() => drawTile(), 500);
  }, [playerLastDrawn, playerHand, drawTile]);

  // 玩家胡牌
  const handleHu = useCallback(() => {
    if (checkHu(playerHand)) {
      setMessage('🎉 胡牌了！恭喜！');
      setGameStarted(false);
      clearTimer();
    }
  }, [playerHand]);

  // 玩家吃牌
  const handleChi = useCallback(() => {
    if (!lastDiscarded || !canChi(playerHand, lastDiscarded)) return;
    
    const options = findChiOptions(playerHand, lastDiscarded);
    if (options.length > 0) {
      const option = options[0];
      const newHand = playerHand.filter(t => 
        !option.some(o => o.id === t.id)
      );
      setPlayerHand([...newHand, lastDiscarded]);
      setDiscardedTiles(prev => prev.filter(t => t.id !== lastDiscarded.id));
      setLastDiscarded(null);
      setHasDrawn(true);
      setMessage('吃了！请打出一张牌');
    }
  }, [lastDiscarded, playerHand]);

  // 玩家过牌
  const handlePass = useCallback(() => {
    setSelectedTile(null);
    setCurrentPlayer(1);
    setMessage('下家摸牌中...');
    timerRef.current = window.setTimeout(() => aiPlay(1), 800);
  }, []);

  // AI打牌
  const aiPlay = useCallback((aiIndex: number) => {
    if (!gameStarted) return;
    
    // 牌摸完了
    if (tiles.length === 0) {
      setMessage('流局！');
      setGameStarted(false);
      clearTimer();
      return;
    }
    
    // AI摸牌
    const newTiles = [...tiles];
    const drawnTile = newTiles.shift();
    if (!drawnTile) return;
    setTiles(newTiles);
    
    // aiIndex: 1,2,3 -> handIdx: 0,1,2
    const handIdx = aiIndex - 1;
    
    // 更新AI手牌
    setAiHands(prev => {
      const updated = [...prev];
      if (!updated[handIdx]) updated[handIdx] = [];
      updated[handIdx] = sortHand([...updated[handIdx], drawnTile]);
      return updated;
    });
    
    // 延迟后打牌
    timerRef.current = window.setTimeout(() => {
      aiDiscard(aiIndex, drawnTile);
    }, 500);
  }, [gameStarted, tiles]);

  // AI打牌
  const aiDiscard = useCallback((aiIndex: number, drawnTile: Tile) => {
    const handIdx = aiIndex - 1;
    
    // 获取当前手牌
    const currentHand = aiHands[handIdx] || [];
    
    if (currentHand.length === 0) {
      // 下一个玩家
      const nextPlayer = (aiIndex + 1) % 4;
      if (nextPlayer === 0) {
        setCurrentPlayer(0);
        setMessage('轮到你摸牌了');
      } else {
        setCurrentPlayer(nextPlayer);
        timerRef.current = window.setTimeout(() => aiPlay(nextPlayer), 800);
      }
      return;
    }
    
    // 检查胡牌
    if (checkHu([...currentHand, drawnTile])) {
      setMessage(`AI${aiIndex} 胡牌了！`);
      setGameStarted(false);
      clearTimer();
      return;
    }
    
    // 随机打一张牌
    const discardIndex = Math.floor(Math.random() * currentHand.length);
    const discardTile = currentHand[discardIndex];
    
    // 更新手牌
    setAiHands(prev => {
      const updated = [...prev];
      if (updated[handIdx]) {
        updated[handIdx] = currentHand.filter((_, i) => i !== discardIndex);
      }
      return updated;
    });
    
    setDiscardedTiles(prev => [...prev, discardTile]);
    setLastDiscarded(discardTile);
    
    // 下一个玩家
    const nextPlayer = (aiIndex + 1) % 4;
    
    if (nextPlayer === 0) {
      setCurrentPlayer(0);
      setMessage('轮到你摸牌了');
    } else {
      setCurrentPlayer(nextPlayer);
      timerRef.current = window.setTimeout(() => aiPlay(nextPlayer), 800);
    }
  }, [aiHands]);

  // 玩家点击牌
  const handleTileClick = useCallback((tile: Tile) => {
    if (isPlayerTurn && hasDrawn) {
      setSelectedTile(tile);
    }
  }, [isPlayerTurn, hasDrawn]);

  // 自动打选中牌
  useEffect(() => {
    if (selectedTile && hasDrawn && isPlayerTurn) {
      discardTile(selectedTile);
    }
  }, [selectedTile, hasDrawn, isPlayerTurn, discardTile]);

  // 清理
  useEffect(() => {
    return () => clearTimer();
  }, []);

  // 计算能力
  const canHu = useMemo(() => checkHu(playerHand), [playerHand]);
  const canPengResult = useMemo(() => lastDiscarded && canPeng(playerHand, lastDiscarded), [lastDiscarded, playerHand]);
  const canGangResult = useMemo(() => playerLastDrawn && canGang(playerHand, playerLastDrawn), [playerLastDrawn, playerHand]);
  const canChiResult = useMemo(() => lastDiscarded && canChi(playerHand, lastDiscarded), [lastDiscarded, playerHand]);

  // 对手信息
  const opponents = useMemo((): Record<string, OpponentInfo> => ({
    left: { name: '上家 AI', handCount: 13, position: 'left' },
    opposite: { name: '对家 AI', handCount: 13, position: 'opposite' },
    right: { name: '下家 AI', handCount: 13, position: 'right' },
  }), []);

  return (
    <div className="mahjong-game">
      <div className="game-header">
        <h1>🀄 广东麻将 🀄</h1>
        {message && <div className="message" role="status">{message}</div>}
      </div>
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>正在加载游戏...</p>
        </div>
      )}
      
      {!gameStarted && !isLoading && (
        <div className="start-screen">
          <button className="start-btn" onClick={startGame}>
            开始游戏
          </button>
          <p className="game-info">你将对战 3 个 AI 对手</p>
        </div>
      )}
      
      {gameStarted && !isLoading && (
        <>
          <Opponents opponents={opponents} />
          
          <TableArea 
            discardedTiles={discardedTiles}
            lastDiscarded={lastDiscarded}
          />
          
          <div className="player-area">
            <PlayerHand 
              hand={playerHand}
              selectedTile={selectedTile}
              onTileClick={handleTileClick}
              lastDrawn={playerLastDrawn}
              pengs={playerPengs}
              gangs={playerGangs}
              chis={[]}
            />
          </div>
          
          <ActionButtons
            onHu={handleHu}
            onPeng={handlePeng}
            onGang={handleGang}
            onChi={handleChi}
            onPass={handlePass}
            onDraw={drawTile}
            canHu={canHu}
            canPeng={canPengResult}
            canGang={canGangResult}
            canChi={canChiResult}
            isMyTurn={isPlayerTurn}
            hasDrawn={hasDrawn}
          />
        </>
      )}
    </div>
  );
}

export default App;
