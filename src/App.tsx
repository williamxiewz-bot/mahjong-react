import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  createTiles, 
  shuffleTiles, 
  sortHand, 
  canPeng, 
  canGang, 
  canChi, 
  checkHu,
  findChiOptions,
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
  
  // 吃牌选择状态
  const [chiOptions, setChiOptions] = useState<Tile[][]>([]);
  const [selectedChiOption, setSelectedChiOption] = useState<number>(-1);
  
  const isPlayerTurn = currentPlayer === 0;

  // 初始化游戏
  const startGame = useCallback(() => {
    setIsLoading(true);
    setChiOptions([]);
    setSelectedChiOption(-1);
    
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
    setChiOptions([]);
    setSelectedChiOption(-1);
    
    // 切换到下家AI
    setCurrentPlayer(1);
    setMessage('下家摸牌中...');
    
    setTimeout(() => {
      aiPlay(1);
    }, 800);
  }, [isPlayerTurn, hasDrawn, playerHand]);

  // 玩家点击牌
  const handleTileClick = useCallback((tile: Tile) => {
    // 如果正在选择吃牌组合
    if (selectedChiOption >= 0) {
      // 选择要吃掉的牌（从手牌中选择2张）
      const currentOption = chiOptions[selectedChiOption];
      const remaining = playerHand.filter(t => 
        !currentOption.some(o => o.id === t.id)
      );
      // 选择一张打出去
      if (remaining.length > 0) {
        discardTile(remaining[0]);
      }
      return;
    }
    
    if (isPlayerTurn && hasDrawn) {
      setSelectedTile(tile);
    }
  }, [isPlayerTurn, hasDrawn, selectedChiOption, chiOptions, playerHand, discardTile]);

  // 自动打选中牌
  useEffect(() => {
    if (selectedTile && hasDrawn && isPlayerTurn && selectedChiOption < 0) {
      discardTile(selectedTile);
    }
  }, [selectedTile, hasDrawn, isPlayerTurn, discardTile, selectedChiOption]);

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
    
    setTimeout(() => drawTile(), 500);
  }, [playerLastDrawn, playerHand, drawTile]);

  // 玩家吃牌 - 选择吃牌组合
  const handleChi = useCallback(() => {
    if (!lastDiscarded || !canChi(playerHand, lastDiscarded)) return;
    
    const options = findChiOptions(playerHand, lastDiscarded);
    if (options.length > 0) {
      setChiOptions(options);
      setMessage('请选择吃牌组合 (点击)');
    }
  }, [lastDiscarded, playerHand]);

  // 选择吃牌组合
  const selectChiOption = useCallback((index: number) => {
    const option = chiOptions[index];
    if (!option) return;
    
    // 从手牌中移除要吃的两张牌，加上lastDiscarded
    const newHand = playerHand.filter(t => 
      !option.some(o => o.id === t.id)
    );
    setPlayerHand([...newHand, lastDiscarded]);
    setDiscardedTiles(prev => prev.filter(t => t.id !== lastDiscarded.id));
    setLastDiscarded(null);
    setChiOptions([]);
    setSelectedChiOption(index);
    setHasDrawn(true);
    setMessage('吃了！请选择要打出的牌');
  }, [chiOptions, lastDiscarded, playerHand]);

  // 玩家胡牌
  const handleHu = useCallback(() => {
    if (checkHu(playerHand)) {
      setMessage('🎉 胡牌了！恭喜！');
      setGameStarted(false);
    }
  }, [playerHand]);

  // 玩家过牌
  const handlePass = useCallback(() => {
    setSelectedTile(null);
    setChiOptions([]);
    setSelectedChiOption(-1);
    setCurrentPlayer(1);
    setMessage('下家摸牌中...');
    setTimeout(() => aiPlay(1), 800);
  }, []);

  // AI打牌
  const aiPlay = useCallback((aiIndex: number) => {
    if (!gameStarted) return;
    
    if (tiles.length === 0) {
      setMessage('流局！');
      setGameStarted(false);
      return;
    }
    
    const newTiles = [...tiles];
    const drawnTile = newTiles.shift();
    if (!drawnTile) return;
    setTiles(newTiles);
    
    const handIdx = aiIndex - 1;
    
    setAiHands(prev => {
      const updated = [...prev];
      if (!updated[handIdx]) updated[handIdx] = [];
      updated[handIdx] = sortHand([...updated[handIdx], drawnTile]);
      return updated;
    });
    
    setTimeout(() => {
      aiDiscard(aiIndex, drawnTile);
    }, 500);
  }, [gameStarted, tiles]);

  const aiDiscard = useCallback((aiIndex: number, drawnTile: Tile) => {
    const handIdx = aiIndex - 1;
    const currentHand = aiHands[handIdx] || [];
    
    if (currentHand.length === 0) {
      const nextPlayer = (aiIndex + 1) % 4;
      if (nextPlayer === 0) {
        setCurrentPlayer(0);
        setMessage('轮到你摸牌了');
      } else {
        setCurrentPlayer(nextPlayer);
        setTimeout(() => aiPlay(nextPlayer), 800);
      }
      return;
    }
    
    if (checkHu([...currentHand, drawnTile])) {
      setMessage(`AI${aiIndex} 胡牌了！`);
      setGameStarted(false);
      return;
    }
    
    const discardIndex = Math.floor(Math.random() * currentHand.length);
    const discardTile = currentHand[discardIndex];
    
    setAiHands(prev => {
      const updated = [...prev];
      if (updated[handIdx]) {
        updated[handIdx] = currentHand.filter((_, i) => i !== discardIndex);
      }
      return updated;
    });
    
    setDiscardedTiles(prev => [...prev, discardTile]);
    setLastDiscarded(discardTile);
    
    const nextPlayer = (aiIndex + 1) % 4;
    
    if (nextPlayer === 0) {
      setCurrentPlayer(0);
      setMessage('轮到你摸牌了');
    } else {
      setCurrentPlayer(nextPlayer);
      setTimeout(() => aiPlay(nextPlayer), 800);
    }
  }, [aiHands]);

  // 自动摸牌/行动
  useEffect(() => {
    if (!gameStarted || !isPlayerTurn) return;
    
    if (chiOptions.length > 0) return;
    
    const timer = setTimeout(() => {
      if (!hasDrawn && !playerLastDrawn) {
        drawTile();
        return;
      }
      
      const canHuNow = checkHu(playerHand);
      const canPengNow = lastDiscarded ? canPeng(playerHand, lastDiscarded) : false;
      const canGangNow = playerLastDrawn ? canGang(playerHand, playerLastDrawn) : false;
      const canChiNow = lastDiscarded ? canChi(playerHand, lastDiscarded) : false;
      
      if (!canHuNow && !canPengNow && !canGangNow && !canChiNow && hasDrawn && !playerLastDrawn) {
        if (playerHand.length > 0) {
          setSelectedTile(playerHand[0]);
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [gameStarted, isPlayerTurn, hasDrawn, playerHand, playerLastDrawn, lastDiscarded, chiOptions, drawTile]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || !isPlayerTurn) return;
      
      switch (e.key) {
        case 'h':
        case 'H':
          if (canHu) handleHu();
          break;
        case 'p':
        case 'P':
          if (canPengResult) handlePeng();
          break;
        case 'g':
        case 'G':
          if (canGangResult) handleGang();
          break;
        case 'c':
        case 'C':
          if (canChiResult) handleChi();
          break;
        case ' ':
        case 'Enter':
          if (!hasDrawn) {
            e.preventDefault();
            drawTile();
          }
          break;
        case 'Escape':
          handlePass();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, isPlayerTurn, canHu, canPengResult, canGangResult, canChiResult, hasDrawn, handleHu, handlePeng, handleGang, handleChi, handlePass, drawTile]);

  // 计算能力
  const canHu = useMemo(() => checkHu(playerHand), [playerHand]);
  const canPengResult = useMemo(() => lastDiscarded ? canPeng(playerHand, lastDiscarded) : false, [lastDiscarded, playerHand]);
  const canGangResult = useMemo(() => playerLastDrawn ? canGang(playerHand, playerLastDrawn) : false, [playerLastDrawn, playerHand]);
  const canChiResult = useMemo(() => lastDiscarded ? canChi(playerHand, lastDiscarded) : false, [lastDiscarded, playerHand]);

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
              chiOptions={chiOptions}
              selectedChiOption={selectedChiOption}
              onChiOptionClick={selectChiOption}
            />
          </div>
          
          {chiOptions.length > 0 && (
            <div className="chi-selection">
              <p>选择吃牌组合：</p>
              <div className="chi-options">
                {chiOptions.map((option, idx) => (
                  <button 
                    key={idx} 
                    className={`chi-option ${selectedChiOption === idx ? 'selected' : ''}`}
                    onClick={() => selectChiOption(idx)}
                  >
                    {option.map(t => t.id.slice(0, 6)).join(' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
          
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
