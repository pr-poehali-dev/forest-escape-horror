import React, { useEffect, useRef, useState, useCallback } from 'react';

const FOREST_BG = 'https://cdn.poehali.dev/projects/c01b491a-77b2-45ff-8880-d11279fe9a5f/files/7f2302bf-3c1b-4182-b51c-325bbe44532e.jpg';

const ITEMS = [
  { emoji: '🍄', name: 'Гриб',    color: '#e06030' },
  { emoji: '🌿', name: 'Трава',   color: '#4a9a30' },
  { emoji: '🫐', name: 'Ягоды',   color: '#6040c0' },
  { emoji: '🪵', name: 'Ветка',   color: '#8a5020' },
  { emoji: '🪨', name: 'Камень',  color: '#808080' },
  { emoji: '🌰', name: 'Орех',    color: '#a06030' },
  { emoji: '🍃', name: 'Лист',    color: '#3a8020' },
  { emoji: '🕯️', name: 'Свеча',   color: '#d0a030' },
];

interface ItemDrop {
  id: number;
  x: number;
  y: number;
  type: typeof ITEMS[number];
  picked: boolean;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  visionAngle: number;
  patrolAngle: number;
  alertLevel: number;
  state: 'patrol' | 'alert' | 'chase';
}

interface InventoryEntry {
  emoji: string;
  name: string;
  count: number;
}

const GAME_W = () => window.innerWidth;
const GAME_H = () => window.innerHeight;
const PLAYER_SPEED = 2.8;
const VISION_RANGE = 180;
const VISION_HALF_ANGLE = Math.PI / 4.5;
const CROUCH_SPEED_MULT = 0.5;
const DETECTION_RATE = 0.018;
const DEDETECTION_RATE = 0.008;
const MAX_DETECT_DIST = 220;
const ITEM_PICKUP_DIST = 35;

function generateItems(): ItemDrop[] {
  const items: ItemDrop[] = [];
  for (let i = 0; i < 22; i++) {
    items.push({
      id: i,
      x: 80 + Math.random() * (GAME_W() - 160),
      y: 80 + Math.random() * (GAME_H() - 160),
      type: ITEMS[Math.floor(Math.random() * ITEMS.length)],
      picked: false,
    });
  }
  return items;
}

function generateEnemies(): Enemy[] {
  const enemies: Enemy[] = [];
  for (let i = 0; i < 4; i++) {
    const angle = Math.random() * Math.PI * 2;
    enemies.push({
      id: i,
      x: 150 + Math.random() * (GAME_W() - 300),
      y: 150 + Math.random() * (GAME_H() - 300),
      angle,
      speed: 0.7 + Math.random() * 0.3,
      visionAngle: angle,
      patrolAngle: angle,
      alertLevel: 0,
      state: 'patrol',
    });
  }
  return enemies;
}

function angleDiff(a: number, b: number): number {
  const diff = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return Math.abs(diff);
}

export default function Index() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'caught' | 'escaped'>('start');
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<ItemDrop[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [isCrouching, setIsCrouching] = useState(false);
  const [nearbyItem, setNearbyItem] = useState<ItemDrop | null>(null);
  const [isDetected, setIsDetected] = useState(false);
  const [maxAlertLevel, setMaxAlertLevel] = useState(0);
  const [footsteps, setFootsteps] = useState<{ id: number; x: number; y: number }[]>([]);
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
    }))
  );

  const keysRef = useRef<Set<string>>(new Set());
  const playerRef = useRef({ x: GAME_W() / 2, y: GAME_H() / 2 });
  const enemiesRef = useRef<Enemy[]>([]);
  const itemsRef = useRef<ItemDrop[]>([]);
  const crouchRef = useRef(false);
  const frameRef = useRef<number>(0);
  const footstepTimerRef = useRef(0);
  const footstepIdRef = useRef(0);
  const gameStateRef = useRef<'start' | 'playing' | 'caught' | 'escaped'>('start');

  useEffect(() => { enemiesRef.current = enemies; }, [enemies]);
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { crouchRef.current = isCrouching; }, [isCrouching]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const startGame = useCallback(() => {
    const px = GAME_W() / 2;
    const py = GAME_H() / 2;
    playerRef.current = { x: px, y: py };
    const newItems = generateItems();
    const newEnemies = generateEnemies();
    itemsRef.current = newItems;
    enemiesRef.current = newEnemies;
    setPlayerPos({ x: px, y: py });
    setItems(newItems);
    setEnemies(newEnemies);
    setInventory([]);
    setScore(0);
    setIsDetected(false);
    setMaxAlertLevel(0);
    setFootsteps([]);
    setGameState('playing');
  }, []);

  const pickupItem = useCallback((id: number) => {
    const item = itemsRef.current.find(it => it.id === id);
    if (!item || item.picked) return;
    itemsRef.current = itemsRef.current.map(it => it.id === id ? { ...it, picked: true } : it);
    setItems(prev => prev.map(it => it.id === id ? { ...it, picked: true } : it));
    setInventory(prev => {
      const existing = prev.find(e => e.emoji === item.type.emoji);
      if (existing) return prev.map(e => e.emoji === item.type.emoji ? { ...e, count: e.count + 1 } : e);
      return [...prev, { emoji: item.type.emoji, name: item.type.name, count: 1 }];
    });
    setScore(s => s + 10);
  }, []);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (e.key === ' ' || e.key === 'Shift') {
        crouchRef.current = true;
        setIsCrouching(true);
      }
      if (e.key.toLowerCase() === 'e') {
        const near = itemsRef.current.find(it => {
          if (it.picked) return false;
          const dx = it.x - playerRef.current.x;
          const dy = it.y - playerRef.current.y;
          return Math.sqrt(dx * dx + dy * dy) < ITEM_PICKUP_DIST;
        });
        if (near) pickupItem(near.id);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
      if (e.key === ' ' || e.key === 'Shift') {
        crouchRef.current = false;
        setIsCrouching(false);
      }
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, [pickupItem]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      if (gameStateRef.current !== 'playing') return;

      const keys = keysRef.current;
      const crouch = crouchRef.current;
      const speedMult = crouch ? CROUCH_SPEED_MULT : 1;
      let dx = 0, dy = 0;

      if (keys.has('arrowleft') || keys.has('a')) dx -= 1;
      if (keys.has('arrowright') || keys.has('d')) dx += 1;
      if (keys.has('arrowup') || keys.has('w')) dy -= 1;
      if (keys.has('arrowdown') || keys.has('s')) dy += 1;

      if (dx !== 0 || dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / len) * PLAYER_SPEED * speedMult;
        dy = (dy / len) * PLAYER_SPEED * speedMult;
      }

      const newPx = Math.max(20, Math.min(GAME_W() - 20, playerRef.current.x + dx));
      const newPy = Math.max(20, Math.min(GAME_H() - 20, playerRef.current.y + dy));
      playerRef.current = { x: newPx, y: newPy };

      if ((dx !== 0 || dy !== 0) && !crouch) {
        footstepTimerRef.current += dt;
        if (footstepTimerRef.current > 280) {
          footstepTimerRef.current = 0;
          const fid = ++footstepIdRef.current;
          setFootsteps(prev => [...prev.slice(-12), { id: fid, x: newPx, y: newPy }]);
          setTimeout(() => setFootsteps(prev => prev.filter(f => f.id !== fid)), 3000);
        }
      }

      const updatedEnemies = enemiesRef.current.map(enemy => {
        let { angle, visionAngle, patrolAngle, alertLevel } = enemy;
        const { x, y, state, speed } = enemy;

        const moveSpeed = state === 'chase' ? speed * 2.8 : speed;
        let nx = x + Math.cos(angle) * moveSpeed;
        let ny = y + Math.sin(angle) * moveSpeed;

        if (nx < 40 || nx > GAME_W() - 40) angle = Math.PI - angle;
        if (ny < 40 || ny > GAME_H() - 40) angle = -angle;
        nx = Math.max(40, Math.min(GAME_W() - 40, nx));
        ny = Math.max(40, Math.min(GAME_H() - 40, ny));

        if (state !== 'chase') {
          patrolAngle += 0.008;
          visionAngle = angle + Math.sin(patrolAngle) * VISION_HALF_ANGLE * 1.2;
        } else {
          const toPlayerAngle = Math.atan2(playerRef.current.y - ny, playerRef.current.x - nx);
          visionAngle = toPlayerAngle;
          angle = toPlayerAngle;
        }

        const pdx = playerRef.current.x - nx;
        const pdy = playerRef.current.y - ny;
        const dist = Math.sqrt(pdx * pdx + pdy * pdy);
        const angleToPlayer = Math.atan2(pdy, pdx);
        const inCone = angleDiff(visionAngle, angleToPlayer) < VISION_HALF_ANGLE;
        const inRange = dist < (state === 'chase' ? MAX_DETECT_DIST * 1.5 : VISION_RANGE);
        const noiseFactor = crouchRef.current ? 0.3 : 1.0;

        if (inCone && inRange) {
          alertLevel = Math.min(1, alertLevel + DETECTION_RATE * noiseFactor * (1 + (VISION_RANGE - dist) / VISION_RANGE));
        } else if (dist < 60 && !crouchRef.current) {
          alertLevel = Math.min(1, alertLevel + DETECTION_RATE * 0.5);
        } else {
          alertLevel = Math.max(0, alertLevel - DEDETECTION_RATE);
        }

        const newState: Enemy['state'] = alertLevel > 0.85 ? 'chase' : alertLevel > 0.35 ? 'alert' : 'patrol';
        return { ...enemy, x: nx, y: ny, angle, visionAngle, patrolAngle, alertLevel, state: newState };
      });

      enemiesRef.current = updatedEnemies;

      const maxAlert = Math.max(0, ...updatedEnemies.map(e => e.alertLevel));
      const caught = updatedEnemies.some(e => {
        const dx2 = e.x - newPx, dy2 = e.y - newPy;
        return Math.sqrt(dx2 * dx2 + dy2 * dy2) < 30 && e.state === 'chase';
      });

      const near = itemsRef.current.find(it => {
        if (it.picked) return false;
        const dx2 = it.x - newPx, dy2 = it.y - newPy;
        return Math.sqrt(dx2 * dx2 + dy2 * dy2) < ITEM_PICKUP_DIST;
      });

      setPlayerPos({ x: newPx, y: newPy });
      setEnemies([...updatedEnemies]);
      setMaxAlertLevel(maxAlert);
      setIsDetected(maxAlert > 0.5);
      setNearbyItem(near || null);

      if (caught) { setGameState('caught'); return; }
      if (itemsRef.current.filter(i => !i.picked).length === 0) { setGameState('escaped'); return; }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState]);

  const mobilePress = useCallback((key: string, down: boolean) => {
    if (down) keysRef.current.add(key);
    else keysRef.current.delete(key);
  }, []);

  const stealthColor = maxAlertLevel < 0.35 ? '#4dc038' : maxAlertLevel < 0.7 ? '#d4a020' : '#c03a2b';
  const stealthLabel = maxAlertLevel < 0.35 ? 'Скрытность: Полная' : maxAlertLevel < 0.7 ? 'Заметили...' : 'ОПАСНОСТЬ!';

  return (
    <div className="game-container">
      <div className="forest-bg" />
      <div className="fog-layer" />

      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: `${p.x}%`, bottom: `${p.y}%`,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
        }} />
      ))}

      {footsteps.map(f => (
        <div key={f.id} className="footstep" style={{ left: f.x, top: f.y }} />
      ))}

      {gameState === 'playing' && items.filter(i => !i.picked).map(item => (
        <div key={item.id} className="item" style={{ left: item.x, top: item.y, color: item.type.color }}>
          <span style={{ fontSize: 18 }}>{item.type.emoji}</span>
          {nearbyItem?.id === item.id && (
            <div className="pickup-hint" style={{ left: '50%' }}>[E] Подобрать</div>
          )}
        </div>
      ))}

      {gameState === 'playing' && enemies.map(enemy => {
        const coneColor = enemy.state === 'chase'
          ? 'rgba(200,50,30,0.18)'
          : enemy.state === 'alert'
          ? 'rgba(200,160,20,0.12)'
          : 'rgba(80,180,50,0.07)';
        const coneStroke = enemy.state === 'chase'
          ? 'rgba(200,50,30,0.5)'
          : enemy.state === 'alert'
          ? 'rgba(200,160,20,0.4)'
          : 'rgba(80,180,50,0.2)';
        const vr = enemy.state === 'chase' ? MAX_DETECT_DIST * 1.5 : VISION_RANGE;
        const a1 = enemy.visionAngle - VISION_HALF_ANGLE;
        const a2 = enemy.visionAngle + VISION_HALF_ANGLE;
        const x1 = Math.cos(a1) * vr, y1 = Math.sin(a1) * vr;
        const x2 = Math.cos(a2) * vr, y2 = Math.sin(a2) * vr;

        return (
          <div key={enemy.id}>
            <svg style={{ position: 'absolute', left: enemy.x - vr, top: enemy.y - vr, width: vr * 2, height: vr * 2, pointerEvents: 'none', zIndex: 8 }}>
              <path
                d={`M ${vr} ${vr} L ${vr + x1} ${vr + y1} A ${vr} ${vr} 0 0 1 ${vr + x2} ${vr + y2} Z`}
                fill={coneColor} stroke={coneStroke} strokeWidth="1"
              />
            </svg>

            {enemy.alertLevel > 0.1 && (
              <div style={{ position: 'absolute', left: enemy.x, top: enemy.y - 66, transform: 'translateX(-50%)', zIndex: 15,
                pointerEvents: 'none', fontSize: 10, fontFamily: 'Golos Text, sans-serif', letterSpacing: '0.05em', textAlign: 'center',
                color: enemy.state === 'chase' ? '#e05030' : '#d4a020' }}>
                {enemy.state === 'chase' ? '⚠ ЗАСЕЧЁН' : '? …'}
                <div style={{ width: 30, height: 3, background: 'rgba(0,0,0,0.5)', borderRadius: 2, margin: '2px auto 0', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: `${enemy.alertLevel * 100}%`, height: '100%', borderRadius: 2,
                    background: enemy.alertLevel > 0.7 ? '#c03a2b' : enemy.alertLevel > 0.35 ? '#d4a020' : '#4dc038', transition: 'all 0.15s' }} />
                </div>
              </div>
            )}

            <div className="enemy" style={{ left: enemy.x, top: enemy.y }}>
              <div className="enemy-helmet" />
              <div className="enemy-head" />
              <div className="enemy-body" />
            </div>
          </div>
        );
      })}

      {gameState === 'playing' && (
        <div className="player" style={{
          left: playerPos.x, top: playerPos.y,
          transform: `translate(-50%, -100%) ${isCrouching ? 'scaleY(0.75)' : ''}`,
        }}>
          <div className="player-cloak" />
          <div className="player-body" />
          <div className="player-head" />
          {isCrouching && <div className="crouch-indicator">крадётся</div>}
        </div>
      )}

      <div className={`detection-flash ${isDetected ? 'active' : ''}`} />
      <div className="vignette" />

      {gameState === 'playing' && (
        <>
          <div className="hud hud-top">
            <div className="stealth-bar">
              <span style={{ color: stealthColor }}>{stealthLabel}</span>
              <div style={{ width: 160, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 4 }}>
                <div style={{ width: `${maxAlertLevel * 100}%`, height: '100%', borderRadius: 2, background: stealthColor, transition: 'all 0.2s' }} />
              </div>
            </div>
            <div className="score-panel">🌿 {score} очков</div>
            <div className="score-panel">📦 {items.filter(i => !i.picked).length} осталось</div>
          </div>

          <div className="hud hud-bottom-right">
            <div className="inventory-panel">
              <div className="inventory-title">Инвентарь</div>
              <div className="inventory-grid">
                {Array.from({ length: 12 }, (_, i) => {
                  const entry = inventory[i];
                  return (
                    <div key={i} className="inventory-slot">
                      {entry && (
                        <>
                          <span style={{ fontSize: 16 }}>{entry.emoji}</span>
                          {entry.count > 1 && <span className="item-count">{entry.count}</span>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(120,180,80,0.5)', letterSpacing: '0.08em', textAlign: 'center' }}>
                [E] подобрать · [Shift] красться
              </div>
            </div>
          </div>

          <div className={`alert-indicator ${maxAlertLevel > 0.85 ? 'visible' : ''}`}>Опасность!</div>

          <div className="mobile-dpad">
            <button className="dpad-btn dpad-up" onTouchStart={() => mobilePress('arrowup', true)} onTouchEnd={() => mobilePress('arrowup', false)}>↑</button>
            <button className="dpad-btn dpad-down" onTouchStart={() => mobilePress('arrowdown', true)} onTouchEnd={() => mobilePress('arrowdown', false)}>↓</button>
            <button className="dpad-btn dpad-left" onTouchStart={() => mobilePress('arrowleft', true)} onTouchEnd={() => mobilePress('arrowleft', false)}>←</button>
            <button className="dpad-btn dpad-right" onTouchStart={() => mobilePress('arrowright', true)} onTouchEnd={() => mobilePress('arrowright', false)}>→</button>
          </div>

          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
            fontSize: 10, letterSpacing: '0.1em', color: 'rgba(100,160,70,0.35)',
            fontFamily: 'Golos Text, sans-serif', pointerEvents: 'none', zIndex: 20 }}>
            WASD / Стрелки — движение · Shift — красться · E — подобрать
          </div>
        </>
      )}

      {/* Start Screen */}
      {gameState === 'start' && (
        <div className="start-screen">
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${FOREST_BG})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.2) saturate(0.5)' }} />
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px' }}>
            <div className="start-title">Лесной<br/>Скиталец</div>
            <div className="start-subtitle">Выживание в тёмном лесу</div>
            <div className="start-controls">
              <div className="key-hint"><span className="key-badge">WASD</span><span>Движение</span></div>
              <div className="key-hint"><span className="key-badge">Shift</span><span>Красться</span></div>
              <div className="key-hint"><span className="key-badge">E</span><span>Подобрать</span></div>
              <div className="key-hint"><span style={{ fontSize: 16 }}>👁</span><span>Избегай взглядов</span></div>
            </div>
            <button className="start-btn" onClick={startGame}>Войти в лес</button>
            <div style={{ marginTop: 20, fontSize: 12, color: 'rgba(100,160,70,0.4)', fontFamily: 'Golos Text', letterSpacing: '0.08em' }}>
              Собери все ресурсы, оставаясь незамеченным
            </div>
          </div>
        </div>
      )}

      {/* Caught */}
      {gameState === 'caught' && (
        <div className="start-screen" style={{ background: 'rgba(30,5,5,0.95)' }}>
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div className="start-title" style={{ color: 'rgba(220,100,80,0.9)', fontSize: 'clamp(36px,6vw,72px)' }}>Пойман!</div>
            <div className="start-subtitle" style={{ color: 'rgba(180,80,60,0.6)' }}>Стражник тебя заметил</div>
            <div style={{ marginTop: 24, fontSize: 22, fontFamily: 'Cormorant Garamond', color: 'rgba(200,160,100,0.8)', fontStyle: 'italic' }}>
              Собрано очков: {score}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {inventory.map((it, i) => <span key={i} style={{ fontSize: 20 }}>{it.emoji} ×{it.count}</span>)}
            </div>
            <button className="start-btn" style={{ marginTop: 36, background: 'linear-gradient(135deg,rgba(100,30,20,.8),rgba(60,15,10,.9))', borderColor: 'rgba(160,60,50,.5)', color: 'rgba(220,160,140,.95)' }} onClick={startGame}>
              Попробовать снова
            </button>
          </div>
        </div>
      )}

      {/* Escaped */}
      {gameState === 'escaped' && (
        <div className="start-screen" style={{ background: 'rgba(5,20,3,0.95)' }}>
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div className="start-title" style={{ color: 'rgba(140,220,100,0.95)', fontSize: 'clamp(36px,6vw,72px)' }}>Выжил!</div>
            <div className="start-subtitle" style={{ color: 'rgba(100,180,70,0.6)' }}>Все ресурсы собраны</div>
            <div style={{ marginTop: 24, fontSize: 28, fontFamily: 'Cormorant Garamond', color: 'rgba(200,240,160,0.9)', fontStyle: 'italic' }}>
              {score} очков
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {inventory.map((it, i) => <span key={i} style={{ fontSize: 22 }}>{it.emoji} ×{it.count}</span>)}
            </div>
            <button className="start-btn" onClick={startGame} style={{ marginTop: 36 }}>Сыграть снова</button>
          </div>
        </div>
      )}
    </div>
  );
}