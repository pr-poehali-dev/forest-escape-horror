import React, { useEffect, useRef, useState, useCallback } from 'react';

const FOREST_BG = 'https://cdn.poehali.dev/projects/c01b491a-77b2-45ff-8880-d11279fe9a5f/files/7f2302bf-3c1b-4182-b51c-325bbe44532e.jpg';

/* ─────────── ITEM TYPES ─────────── */
const ITEM_TYPES = [
  { id: 'mushroom', name: 'Гриб' },
  { id: 'berries',  name: 'Ягоды' },
  { id: 'branch',   name: 'Ветка' },
  { id: 'stone',    name: 'Камень' },
  { id: 'acorn',    name: 'Жёлудь' },
  { id: 'herb',     name: 'Трава' },
  { id: 'candle',   name: 'Свеча' },
  { id: 'leaf',     name: 'Лист' },
] as const;
type ItemId = typeof ITEM_TYPES[number]['id'];

/* ─────────── 3D SVG RESOURCES ─────────── */
function ItemSprite({ id }: { id: ItemId }) {
  switch (id) {
    case 'mushroom': return (
      <svg width="36" height="40" viewBox="0 0 36 40">
        <defs>
          <radialGradient id="mg1" cx="40%" cy="35%"><stop offset="0%" stopColor="#f4a05a"/><stop offset="100%" stopColor="#a83010"/></radialGradient>
          <radialGradient id="mg2" cx="50%" cy="30%"><stop offset="0%" stopColor="#f8c880"/><stop offset="100%" stopColor="#e8864a"/></radialGradient>
        </defs>
        {/* Shadow */}
        <ellipse cx="18" cy="38" rx="10" ry="3" fill="rgba(0,0,0,0.35)"/>
        {/* Stem side */}
        <path d="M13 38 Q12 26 14 22 Q18 20 22 22 Q24 26 23 38 Z" fill="#d4b890"/>
        {/* Stem front */}
        <path d="M14 38 Q13 27 15 23 Q18 21 21 23 Q23 27 22 38 Z" fill="#f0d4a8"/>
        {/* Cap underside */}
        <ellipse cx="18" cy="23" rx="14" ry="5" fill="#f8d0a0" opacity="0.9"/>
        {/* Cap top */}
        <path d="M4 23 Q6 10 18 8 Q30 10 32 23 Z" fill="url(#mg1)"/>
        {/* Cap highlight */}
        <path d="M9 18 Q12 11 18 10 Q24 11 26 17" fill="none" stroke="url(#mg2)" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
        {/* White spots */}
        <circle cx="13" cy="16" r="2.5" fill="rgba(255,255,255,0.85)"/>
        <circle cx="22" cy="13" r="2" fill="rgba(255,255,255,0.85)"/>
        <circle cx="17" cy="12" r="1.5" fill="rgba(255,255,255,0.7)"/>
      </svg>
    );
    case 'berries': return (
      <svg width="34" height="36" viewBox="0 0 34 36">
        <defs>
          <radialGradient id="bg1" cx="35%" cy="30%"><stop offset="0%" stopColor="#9060e0"/><stop offset="100%" stopColor="#3a1880"/></radialGradient>
          <radialGradient id="bg2" cx="35%" cy="30%"><stop offset="0%" stopColor="#7848c8"/><stop offset="100%" stopColor="#2a1060"/></radialGradient>
        </defs>
        <ellipse cx="17" cy="34" rx="9" ry="2.5" fill="rgba(0,0,0,0.3)"/>
        {/* Stem */}
        <path d="M17 28 Q15 20 12 16 M17 28 Q18 19 22 14" stroke="#2a5a10" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M17 28 Q20 22 24 20" stroke="#2a5a10" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {/* Berries */}
        <circle cx="11" cy="14" r="6" fill="url(#bg1)"/>
        <circle cx="22" cy="13" r="5.5" fill="url(#bg2)"/>
        <circle cx="24" cy="21" r="5" fill="url(#bg1)"/>
        <circle cx="15" cy="24" r="5.5" fill="url(#bg2)"/>
        {/* Highlights */}
        <circle cx="9" cy="12" r="2" fill="rgba(200,170,255,0.5)"/>
        <circle cx="20" cy="11" r="1.8" fill="rgba(200,170,255,0.5)"/>
        <circle cx="22" cy="19" r="1.5" fill="rgba(200,170,255,0.4)"/>
        <circle cx="13" cy="22" r="1.8" fill="rgba(200,170,255,0.5)"/>
        {/* Tip dots */}
        <circle cx="11" cy="8" r="1.2" fill="#1a3a08"/>
        <circle cx="22" cy="7" r="1.1" fill="#1a3a08"/>
        <circle cx="24" cy="16" r="1" fill="#1a3a08"/>
        <circle cx="15" cy="18" r="1.1" fill="#1a3a08"/>
      </svg>
    );
    case 'branch': return (
      <svg width="42" height="28" viewBox="0 0 42 28">
        <defs>
          <linearGradient id="br1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a06840"/><stop offset="100%" stopColor="#5a3010"/></linearGradient>
          <linearGradient id="br2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#c08850"/><stop offset="100%" stopColor="#7a4818"/></linearGradient>
        </defs>
        <ellipse cx="21" cy="26" rx="14" ry="2.5" fill="rgba(0,0,0,0.3)"/>
        {/* Main branch body (3D cylinder effect) */}
        <path d="M4 20 Q14 14 28 12 Q36 11 40 13 Q36 16 28 17 Q14 19 4 24 Z" fill="url(#br1)"/>
        <path d="M4 20 Q14 16 28 14 Q36 13 40 13" fill="none" stroke="url(#br2)" strokeWidth="3" strokeLinecap="round"/>
        {/* Sub branch */}
        <path d="M22 15 Q24 10 28 7 Q30 9 28 10 Q26 12 24 16 Z" fill="#8a5828"/>
        <path d="M22 15 Q25 11 29 8" fill="none" stroke="#b07840" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Bark texture lines */}
        <path d="M10 21 Q12 17 14 19" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8"/>
        <path d="M18 19 Q20 15 22 17" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8"/>
        <path d="M28 16 Q30 13 32 14" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8"/>
        {/* End rings */}
        <ellipse cx="4" cy="22" rx="2.5" ry="4" fill="#6a3a18" transform="rotate(-10,4,22)"/>
        <ellipse cx="40" cy="13" rx="2" ry="3" fill="#7a4820" transform="rotate(-5,40,13)"/>
      </svg>
    );
    case 'stone': return (
      <svg width="38" height="30" viewBox="0 0 38 30">
        <defs>
          <radialGradient id="sg1" cx="35%" cy="30%"><stop offset="0%" stopColor="#a0a8b0"/><stop offset="100%" stopColor="#505860"/></radialGradient>
          <linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#80888a"/><stop offset="100%" stopColor="#383c40"/></linearGradient>
        </defs>
        <ellipse cx="19" cy="28" rx="13" ry="3" fill="rgba(0,0,0,0.35)"/>
        {/* Stone bottom face (darker) */}
        <path d="M6 20 Q10 26 19 27 Q28 26 32 20 Q30 22 19 23 Q8 22 6 20Z" fill="url(#sg2)"/>
        {/* Stone main face */}
        <path d="M5 18 Q7 8 14 5 Q22 3 30 7 Q35 12 33 18 Q29 22 19 23 Q9 22 5 18Z" fill="url(#sg1)"/>
        {/* Side face */}
        <path d="M5 18 Q7 22 19 23 Q9 22 5 18Z" fill="#606870"/>
        <path d="M33 18 Q32 22 19 23 Q29 22 33 18Z" fill="#484e56"/>
        {/* Highlight */}
        <path d="M11 10 Q16 6 24 8 Q28 10 30 14" fill="none" stroke="rgba(200,210,220,0.6)" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Cracks */}
        <path d="M18 8 Q20 12 18 16 Q19 18 20 20" fill="none" stroke="rgba(40,45,50,0.5)" strokeWidth="0.8"/>
        <path d="M24 10 Q22 13 25 15" fill="none" stroke="rgba(40,45,50,0.4)" strokeWidth="0.7"/>
        {/* Moss patch */}
        <path d="M8 14 Q10 10 13 12 Q10 15 8 14Z" fill="#3a6020" opacity="0.6"/>
      </svg>
    );
    case 'acorn': return (
      <svg width="28" height="36" viewBox="0 0 28 36">
        <defs>
          <radialGradient id="ac1" cx="35%" cy="30%"><stop offset="0%" stopColor="#d09050"/><stop offset="100%" stopColor="#804a18"/></radialGradient>
          <radialGradient id="ac2" cx="40%" cy="35%"><stop offset="0%" stopColor="#7a6040"/><stop offset="100%" stopColor="#3a2810"/></radialGradient>
        </defs>
        <ellipse cx="14" cy="34" rx="7" ry="2" fill="rgba(0,0,0,0.3)"/>
        {/* Stem */}
        <path d="M14 6 Q13 2 15 1 Q16 3 14 6Z" fill="#3a2808" stroke="#5a3810" strokeWidth="0.5"/>
        {/* Cap */}
        <path d="M5 14 Q6 7 14 6 Q22 7 23 14 Q22 17 14 18 Q6 17 5 14Z" fill="url(#ac2)"/>
        {/* Cap texture */}
        <path d="M6 12 Q10 9 14 9 Q18 9 22 12" fill="none" stroke="rgba(80,50,20,0.5)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M7 14 Q11 11 14 11 Q17 11 21 14" fill="none" stroke="rgba(100,70,30,0.4)" strokeWidth="3" strokeLinecap="round"/>
        {/* Body */}
        <path d="M7 16 Q6 26 10 31 Q14 34 18 31 Q22 26 21 16 Q18 18 14 18 Q10 18 7 16Z" fill="url(#ac1)"/>
        {/* Highlight */}
        <path d="M9 19 Q9 25 11 29" fill="none" stroke="rgba(230,180,100,0.6)" strokeWidth="2" strokeLinecap="round"/>
        {/* Shadow side */}
        <path d="M18 17 Q21 24 20 30 Q19 28 18 24 Q17 20 18 17Z" fill="rgba(0,0,0,0.2)"/>
      </svg>
    );
    case 'herb': return (
      <svg width="36" height="38" viewBox="0 0 36 38">
        <defs>
          <linearGradient id="hg1" x1="0%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stopColor="#2a6010"/><stop offset="100%" stopColor="#6ab830"/></linearGradient>
          <linearGradient id="hg2" x1="100%" y1="100%" x2="50%" y2="0%"><stop offset="0%" stopColor="#1a4a08"/><stop offset="100%" stopColor="#50a020"/></linearGradient>
        </defs>
        <ellipse cx="18" cy="36" rx="8" ry="2" fill="rgba(0,0,0,0.3)"/>
        {/* Stems */}
        <path d="M18 34 Q16 28 12 22 Q10 18 11 14" stroke="#2a6010" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M18 34 Q18 26 18 18 Q18 14 17 10" stroke="#1e5008" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M18 34 Q20 27 24 22 Q26 18 25 13" stroke="#2a6010" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Leaves left */}
        <path d="M12 22 Q6 20 5 14 Q8 12 12 16 Q14 19 12 22Z" fill="url(#hg1)"/>
        <path d="M11 15 Q7 11 8 6 Q11 5 13 10 Q13 13 11 15Z" fill="url(#hg1)"/>
        {/* Leaves center */}
        <path d="M17 10 Q15 4 18 2 Q21 4 19 10 Z" fill="url(#hg2)"/>
        <path d="M17 18 Q12 16 11 10 Q14 8 17 14Z" fill="#4a9818"/>
        {/* Leaves right */}
        <path d="M24 22 Q30 20 31 14 Q28 12 24 16 Q22 19 24 22Z" fill="url(#hg2)"/>
        <path d="M25 14 Q29 10 28 5 Q25 4 23 9 Q23 12 25 14Z" fill="url(#hg2)"/>
        {/* Leaf veins */}
        <path d="M12 22 Q9 18 7 14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7"/>
        <path d="M24 22 Q27 18 29 14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"/>
      </svg>
    );
    case 'candle': return (
      <svg width="24" height="44" viewBox="0 0 24 44">
        <defs>
          <radialGradient id="cg1" cx="50%" cy="20%"><stop offset="0%" stopColor="#fff8a0"/><stop offset="40%" stopColor="#ffa020" stopOpacity="0.9"/><stop offset="100%" stopColor="#ff4000" stopOpacity="0"/></radialGradient>
          <linearGradient id="cg2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#b0987a"/><stop offset="40%" stopColor="#e8d8b8"/><stop offset="100%" stopColor="#907058"/></linearGradient>
        </defs>
        <ellipse cx="12" cy="42" rx="7" ry="2" fill="rgba(0,0,0,0.3)"/>
        {/* Wax drip */}
        <path d="M7 28 Q5 32 6 36 Q8 38 12 38 Q16 38 18 36 Q19 32 17 28Z" fill="#c8b898"/>
        <path d="M6 30 Q5 35 7 37" fill="none" stroke="#e0cca8" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Candle body */}
        <path d="M7 28 Q6 18 7 12 Q8 10 12 10 Q16 10 17 12 Q18 18 17 28Z" fill="url(#cg2)"/>
        {/* Body highlight */}
        <path d="M9 12 Q8 18 9 26" fill="none" stroke="rgba(255,255,240,0.5)" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Top of candle */}
        <ellipse cx="12" cy="12" rx="5" ry="2" fill="#d8c8a0"/>
        {/* Wick */}
        <path d="M12 12 Q11 9 12 7" stroke="#2a1a08" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {/* Flame glow */}
        <ellipse cx="12" cy="7" rx="7" ry="7" fill="url(#cg1)" opacity="0.7"/>
        {/* Flame */}
        <path d="M12 2 Q9 5 10 8 Q11 10 12 10 Q13 10 14 8 Q15 5 12 2Z" fill="#fff060"/>
        <path d="M12 4 Q10 6 11 8 Q12 9 13 8 Q14 6 12 4Z" fill="white" opacity="0.8"/>
        {/* Wax pool */}
        <ellipse cx="12" cy="12" rx="4" ry="1.5" fill="#f0e0c0" opacity="0.6"/>
      </svg>
    );
    case 'leaf': return (
      <svg width="38" height="34" viewBox="0 0 38 34">
        <defs>
          <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#88c830"/><stop offset="100%" stopColor="#2a6010"/></linearGradient>
          <linearGradient id="lg2" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#a0d840"/><stop offset="100%" stopColor="#408018"/></linearGradient>
        </defs>
        <ellipse cx="19" cy="32" rx="9" ry="2" fill="rgba(0,0,0,0.25)"/>
        {/* Stem */}
        <path d="M19 30 Q18 26 15 20" stroke="#3a6818" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* Leaf shadow underside */}
        <path d="M4 18 Q8 28 19 30 Q28 26 34 16 Q26 20 19 21 Q10 20 4 18Z" fill="#2a5808" opacity="0.7"/>
        {/* Main leaf */}
        <path d="M15 20 Q4 16 3 8 Q8 2 16 6 Q22 10 19 21 Z" fill="url(#lg1)"/>
        <path d="M15 20 Q26 14 34 6 Q30 0 22 4 Q16 8 19 21 Z" fill="url(#lg2)"/>
        {/* Central vein */}
        <path d="M15 20 Q13 14 10 8 Q13 5 16 8 Q17 13 19 20" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"/>
        <path d="M15 20 Q18 14 22 8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        {/* Side veins */}
        <path d="M10 13 Q13 11 14 15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"/>
        <path d="M8 10 Q11 8 12 12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"/>
        <path d="M22 10 Q24 13 22 16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"/>
      </svg>
    );
    default: return <span style={{ fontSize: 22 }}>🌿</span>;
  }
}

/* ─────────── 3D PLAYER SVG ─────────── */
function PlayerSprite({ crouch, moveDir }: { crouch: boolean; moveDir: number }) {
  const legAnim = moveDir !== 0 ? Math.sin(Date.now() * 0.012) * 5 : 0;
  const scaleY = crouch ? 0.75 : 1;
  return (
    <svg
      width="44" height="68"
      viewBox="0 0 44 68"
      style={{ transform: `scaleY(${scaleY})`, transformOrigin: 'bottom center', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.7))' }}
    >
      <defs>
        <radialGradient id="ph1" cx="38%" cy="32%"><stop offset="0%" stopColor="#d4a870"/><stop offset="100%" stopColor="#8a5a30"/></radialGradient>
        <linearGradient id="pc1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1e4a12"/><stop offset="100%" stopColor="#0c2a06"/></linearGradient>
        <linearGradient id="pc2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0c2a06"/><stop offset="50%" stopColor="#2a6018"/><stop offset="100%" stopColor="#0c2a06"/></linearGradient>
        <linearGradient id="pb1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2a5a18"/><stop offset="100%" stopColor="#142e0a"/></linearGradient>
        <radialGradient id="psh" cx="50%" cy="50%"><stop offset="0%" stopColor="rgba(0,0,0,0.4)"/><stop offset="100%" stopColor="rgba(0,0,0,0)"/></radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="22" cy="66" rx="12" ry="3" fill="url(#psh)"/>

      {/* Legs */}
      <rect x={14 - legAnim} y="50" width="7" height="14" rx="3" fill="#1a3a0c" transform={`rotate(${legAnim * 0.8}, 17, 50)`}/>
      <rect x={23 + legAnim} y="50" width="7" height="14" rx="3" fill="#142e08" transform={`rotate(${-legAnim * 0.8}, 27, 50)`}/>
      {/* Boots */}
      <path d={`M${13 - legAnim} 63 Q${12 - legAnim} 65 ${18 - legAnim} 65 Q${22 - legAnim} 65 ${22 - legAnim} 63 Z`} fill="#2a1a08"/>
      <path d={`M${22 + legAnim} 63 Q${22 + legAnim} 65 ${27 + legAnim} 65 Q${31 + legAnim} 65 ${31 + legAnim} 63 Z`} fill="#1e1406"/>

      {/* Cloak back layer */}
      <path d="M10 28 Q8 42 9 54 Q14 58 22 58 Q30 58 35 54 Q36 42 34 28 Q28 32 22 32 Q16 32 10 28Z" fill="url(#pc1)"/>

      {/* Body / tunic */}
      <path d="M14 32 Q13 44 14 52 Q18 55 22 55 Q26 55 30 52 Q31 44 30 32 Q26 35 22 35 Q18 35 14 32Z" fill="url(#pb1)"/>

      {/* Belt */}
      <rect x="13" y="43" width="18" height="4" rx="2" fill="#5a3010"/>
      <rect x="20" y="42" width="4" height="6" rx="1" fill="#c89040"/>

      {/* Arms */}
      <path d="M14 34 Q8 38 7 48 Q9 50 12 48 Q14 40 16 36Z" fill="#1e4a12" stroke="#0c2a06" strokeWidth="0.5"/>
      <path d="M30 34 Q36 38 37 48 Q35 50 32 48 Q30 40 28 36Z" fill="#1e4a12" stroke="#0c2a06" strokeWidth="0.5"/>
      {/* Hands */}
      <ellipse cx="9" cy="49" rx="3.5" ry="3" fill="#c4986a"/>
      <ellipse cx="35" cy="49" rx="3.5" ry="3" fill="#b08860"/>

      {/* Neck */}
      <rect x="19" y="26" width="6" height="7" rx="3" fill="#c4986a"/>

      {/* Hood back */}
      <path d="M10 22 Q8 12 14 8 Q18 5 22 5 Q26 5 30 8 Q36 12 34 22 Q30 18 22 18 Q14 18 10 22Z" fill="url(#pc1)"/>

      {/* Face */}
      <ellipse cx="22" cy="22" rx="9" ry="10" fill="url(#ph1)"/>

      {/* Eyes */}
      <ellipse cx="18.5" cy="21" rx="1.8" ry="2" fill="#2a1a08"/>
      <ellipse cx="25.5" cy="21" rx="1.8" ry="2" fill="#2a1a08"/>
      <circle cx="18" cy="20.5" r="0.7" fill="rgba(255,255,255,0.6)"/>
      <circle cx="25" cy="20.5" r="0.7" fill="rgba(255,255,255,0.6)"/>

      {/* Nose */}
      <path d="M22 22 Q21 24 22 25 Q23 24 22 22Z" fill="#9a6840" opacity="0.7"/>

      {/* Hood front */}
      <path d="M13 20 Q12 14 16 10 Q18 8 22 8 Q26 8 28 10 Q32 14 31 20 Q28 16 22 16 Q16 16 13 20Z" fill="#2a6018"/>

      {/* Cloak collar */}
      <path d="M10 28 Q14 24 22 23 Q30 24 34 28 Q30 32 22 32 Q14 32 10 28Z" fill="url(#pc2)"/>

      {/* Scarf/wrap detail */}
      <path d="M13 26 Q18 28 22 28 Q26 28 31 26" fill="none" stroke="#3a8028" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

/* ─────────── 3D ENEMY SVG ─────────── */
function EnemySprite({ state }: { state: 'patrol' | 'alert' | 'chase' }) {
  const armRaise = state === 'chase' ? -15 : state === 'alert' ? -8 : 0;
  const helmetColor = state === 'chase' ? '#6a1008' : '#2a2a1a';
  return (
    <svg width="42" height="66" viewBox="0 0 42 66" style={{ filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.8))' }}>
      <defs>
        <radialGradient id="eh1" cx="38%" cy="32%"><stop offset="0%" stopColor="#8a6050"/><stop offset="100%" stopColor="#4a2a1a"/></radialGradient>
        <linearGradient id="ea1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4a4a38"/><stop offset="100%" stopColor="#1a1a10"/></linearGradient>
        <linearGradient id="ea2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1a1a10"/><stop offset="50%" stopColor="#5a5a40"/><stop offset="100%" stopColor="#1a1a10"/></linearGradient>
        <radialGradient id="esh" cx="50%" cy="50%"><stop offset="0%" stopColor="rgba(0,0,0,0.45)"/><stop offset="100%" stopColor="rgba(0,0,0,0)"/></radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="21" cy="64" rx="12" ry="3" fill="url(#esh)"/>

      {/* Legs / greaves */}
      <rect x="13" y="48" width="7" height="14" rx="2" fill="#252518"/>
      <rect x="22" y="48" width="7" height="14" rx="2" fill="#1a1a10"/>
      {/* Boots */}
      <path d="M12 61 Q11 64 18 64 Q21 64 21 61Z" fill="#151510"/>
      <path d="M21 61 Q21 64 28 64 Q31 64 30 61Z" fill="#101008"/>
      {/* Boot buckles */}
      <rect x="13" y="60" width="5" height="2" rx="1" fill="#5a5030"/>
      <rect x="22" y="60" width="5" height="2" rx="1" fill="#504828"/>

      {/* Tabard/skirt */}
      <path d="M13 42 Q12 50 13 56 Q17 58 21 58 Q25 58 29 56 Q30 50 29 42Z" fill="#2a2a18"/>
      {/* Tabard pattern */}
      <path d="M17 44 L17 54 M21 43 L21 55 M25 44 L25 54" stroke="rgba(100,90,50,0.4)" strokeWidth="0.8"/>

      {/* Armor body */}
      <path d="M11 28 Q10 38 11 48 Q16 52 21 52 Q26 52 31 48 Q32 38 31 28 Q27 32 21 32 Q15 32 11 28Z" fill="url(#ea1)"/>
      {/* Armor plates */}
      <path d="M13 32 Q21 35 29 32 Q27 36 21 37 Q15 36 13 32Z" fill="#505040" opacity="0.8"/>
      <path d="M12 38 Q21 41 30 38 Q28 42 21 43 Q14 42 12 38Z" fill="#404030" opacity="0.7"/>
      {/* Center stripe */}
      <rect x="19" y="28" width="4" height="22" rx="2" fill="#3a3828" opacity="0.6"/>

      {/* Pauldrons (shoulder armor) */}
      <path d="M11 30 Q6 26 5 32 Q6 38 11 36 Q10 33 11 30Z" fill="#404038"/>
      <path d="M31 30 Q36 26 37 32 Q36 38 31 36 Q32 33 31 30Z" fill="#383830"/>

      {/* Spear / polearm arm */}
      <path
        d="M31 30 Q36 32 38 40 Q37 46 35 50"
        stroke="#5a4020" strokeWidth="3" fill="none" strokeLinecap="round"
        transform={`rotate(${armRaise}, 31, 30)`}
      />
      {/* Spear tip */}
      <path
        d="M37 38 Q40 32 38 28 Q36 30 37 38Z"
        fill="#8a8878"
        transform={`rotate(${armRaise}, 31, 30)`}
      />
      <path
        d="M37 38 Q39 33 38 30"
        fill="none" stroke="#c0c0b0" strokeWidth="1"
        transform={`rotate(${armRaise}, 31, 30)`}
      />
      {/* Shield arm */}
      <path d="M11 30 Q6 34 5 42 Q7 46 10 44 Q11 38 12 34Z" fill="#404038" stroke="#282820" strokeWidth="0.5"/>
      {/* Shield */}
      <path d="M5 34 Q3 40 5 46 Q8 50 11 48 Q14 44 12 36 Z" fill="#3a3a28"/>
      <path d="M5 36 Q4 41 6 45 Q8 48 11 46 Q13 43 12 38Z" fill="#484838"/>
      {/* Shield emblem */}
      <circle cx="8" cy="41" r="3" fill="rgba(180,50,30,0.7)"/>
      <path d="M8 38 L8 44 M5 41 L11 41" stroke="rgba(220,180,50,0.8)" strokeWidth="0.8"/>

      {/* Neck */}
      <rect x="18" y="24" width="6" height="6" rx="3" fill="#6a4838"/>
      {/* Gorget (neck guard) */}
      <path d="M15 28 Q18 26 21 26 Q24 26 27 28 Q24 30 21 30 Q18 30 15 28Z" fill="#505040"/>

      {/* Head */}
      <ellipse cx="21" cy="20" rx="9" ry="10" fill="url(#eh1)"/>
      {/* Face features */}
      <ellipse cx="17.5" cy="19" rx="2" ry="2.2" fill="#1a0e08"/>
      <ellipse cx="24.5" cy="19" rx="2" ry="2.2" fill="#1a0e08"/>
      {/* Eye glow when chasing */}
      {state === 'chase' && <>
        <circle cx="17.5" cy="19" r="1.2" fill="rgba(220,60,30,0.8)"/>
        <circle cx="24.5" cy="19" r="1.2" fill="rgba(220,60,30,0.8)"/>
      </>}
      {state !== 'chase' && <>
        <circle cx="17" cy="18.5" r="0.7" fill="rgba(255,255,255,0.4)"/>
        <circle cx="24" cy="18.5" r="0.7" fill="rgba(255,255,255,0.4)"/>
      </>}
      {/* Scar */}
      <path d="M20 21 Q22 23 21 25" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8"/>

      {/* Helmet */}
      <path d="M12 18 Q12 8 21 7 Q30 8 30 18 Q27 14 21 14 Q15 14 12 18Z" fill={helmetColor}/>
      {/* Helmet rim */}
      <path d="M11 20 Q12 16 21 15 Q30 16 31 20 Q27 22 21 22 Q15 22 11 20Z" fill={state === 'chase' ? '#8a2010' : '#383830'}/>
      {/* Helmet nasal guard */}
      <rect x="19.5" y="15" width="3" height="10" rx="1.5" fill={state === 'chase' ? '#6a1a08' : '#282820'}/>
      {/* Plume */}
      <path d="M21 7 Q19 3 21 1 Q23 3 21 7Z" fill={state === 'chase' ? '#c03020' : '#4a4020'}/>
      {/* Cheek guards */}
      <path d="M12 18 Q10 20 11 24 Q13 24 14 22 Q13 20 12 18Z" fill={helmetColor}/>
      <path d="M30 18 Q32 20 31 24 Q29 24 28 22 Q29 20 30 18Z" fill={helmetColor}/>
    </svg>
  );
}

/* ─────────── INTERFACES ─────────── */
interface ItemDrop { id: number; x: number; y: number; typeId: ItemId; picked: boolean; }
interface Enemy { id: number; x: number; y: number; angle: number; speed: number; visionAngle: number; patrolAngle: number; alertLevel: number; state: 'patrol' | 'alert' | 'chase'; }
interface InventoryEntry { typeId: ItemId; name: string; count: number; }

const GAME_W = () => window.innerWidth;
const GAME_H = () => window.innerHeight;
const PLAYER_SPEED = 2.8;
const VISION_RANGE = 185;
const VISION_HALF_ANGLE = Math.PI / 4.5;
const CROUCH_SPEED_MULT = 0.5;
const DETECTION_RATE = 0.018;
const DEDETECTION_RATE = 0.008;
const MAX_DETECT_DIST = 230;
const ITEM_PICKUP_DIST = 38;

function generateItems(): ItemDrop[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 80 + Math.random() * (GAME_W() - 160),
    y: 80 + Math.random() * (GAME_H() - 160),
    typeId: ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)].id,
    picked: false,
  }));
}

function generateEnemies(): Enemy[] {
  return Array.from({ length: 4 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    return { id: i, x: 150 + Math.random() * (GAME_W() - 300), y: 150 + Math.random() * (GAME_H() - 300), angle, speed: 0.7 + Math.random() * 0.3, visionAngle: angle, patrolAngle: angle, alertLevel: 0, state: 'patrol' as const };
  });
}

function angleDiff(a: number, b: number): number {
  return Math.abs(((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
}

/* ─────────── MAIN COMPONENT ─────────── */
export default function Index() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'caught' | 'escaped'>('start');
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<ItemDrop[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [isCrouching, setIsCrouching] = useState(false);
  const [moveDir, setMoveDir] = useState(0);
  const [nearbyItem, setNearbyItem] = useState<ItemDrop | null>(null);
  const [isDetected, setIsDetected] = useState(false);
  const [maxAlertLevel, setMaxAlertLevel] = useState(0);
  const [footsteps, setFootsteps] = useState<{ id: number; x: number; y: number }[]>([]);
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, delay: Math.random() * 8, duration: 6 + Math.random() * 8 }))
  );
  const [tick, setTick] = useState(0);

  const keysRef = useRef<Set<string>>(new Set());
  const playerRef = useRef({ x: GAME_W() / 2, y: GAME_H() / 2 });
  const enemiesRef = useRef<Enemy[]>([]);
  const itemsRef = useRef<ItemDrop[]>([]);
  const crouchRef = useRef(false);
  const frameRef = useRef<number>(0);
  const footstepTimerRef = useRef(0);
  const footstepIdRef = useRef(0);
  const gameStateRef = useRef<'start' | 'playing' | 'caught' | 'escaped'>('start');
  const tickRef = useRef(0);

  useEffect(() => { enemiesRef.current = enemies; }, [enemies]);
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { crouchRef.current = isCrouching; }, [isCrouching]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const startGame = useCallback(() => {
    const px = GAME_W() / 2, py = GAME_H() / 2;
    playerRef.current = { x: px, y: py };
    const newItems = generateItems(), newEnemies = generateEnemies();
    itemsRef.current = newItems; enemiesRef.current = newEnemies;
    setPlayerPos({ x: px, y: py });
    setItems(newItems); setEnemies(newEnemies);
    setInventory([]); setScore(0); setIsDetected(false); setMaxAlertLevel(0); setFootsteps([]);
    setGameState('playing');
  }, []);

  const pickupItem = useCallback((id: number) => {
    const item = itemsRef.current.find(it => it.id === id);
    if (!item || item.picked) return;
    itemsRef.current = itemsRef.current.map(it => it.id === id ? { ...it, picked: true } : it);
    setItems(prev => prev.map(it => it.id === id ? { ...it, picked: true } : it));
    const typeName = ITEM_TYPES.find(t => t.id === item.typeId)?.name ?? item.typeId;
    setInventory(prev => {
      const ex = prev.find(e => e.typeId === item.typeId);
      if (ex) return prev.map(e => e.typeId === item.typeId ? { ...e, count: e.count + 1 } : e);
      return [...prev, { typeId: item.typeId, name: typeName, count: 1 }];
    });
    setScore(s => s + 10);
  }, []);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (e.key === 'Shift') { crouchRef.current = true; setIsCrouching(true); }
      if (e.key === ' ') { crouchRef.current = true; setIsCrouching(true); }
      if (e.key.toLowerCase() === 'e') {
        const near = itemsRef.current.find(it => { if (it.picked) return false; const dx = it.x - playerRef.current.x, dy = it.y - playerRef.current.y; return Math.sqrt(dx*dx+dy*dy) < ITEM_PICKUP_DIST; });
        if (near) pickupItem(near.id);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
      if (e.key === 'Shift' || e.key === ' ') { crouchRef.current = false; setIsCrouching(false); }
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
      let dx = 0, dy = 0;
      if (keys.has('arrowleft') || keys.has('a')) dx -= 1;
      if (keys.has('arrowright') || keys.has('d')) dx += 1;
      if (keys.has('arrowup') || keys.has('w')) dy -= 1;
      if (keys.has('arrowdown') || keys.has('s')) dy += 1;

      const moving = dx !== 0 || dy !== 0;
      if (moving) { const len = Math.sqrt(dx*dx+dy*dy); dx = (dx/len)*PLAYER_SPEED*(crouch?CROUCH_SPEED_MULT:1); dy = (dy/len)*PLAYER_SPEED*(crouch?CROUCH_SPEED_MULT:1); }

      const newPx = Math.max(24, Math.min(GAME_W()-24, playerRef.current.x + dx));
      const newPy = Math.max(24, Math.min(GAME_H()-24, playerRef.current.y + dy));
      playerRef.current = { x: newPx, y: newPy };

      if (moving && !crouch) {
        footstepTimerRef.current += dt;
        if (footstepTimerRef.current > 260) {
          footstepTimerRef.current = 0;
          const fid = ++footstepIdRef.current;
          setFootsteps(prev => [...prev.slice(-14), { id: fid, x: newPx, y: newPy }]);
          setTimeout(() => setFootsteps(prev => prev.filter(f => f.id !== fid)), 3000);
        }
      }

      tickRef.current += 1;
      if (tickRef.current % 2 === 0) setTick(t => t + 1);

      const updatedEnemies = enemiesRef.current.map(enemy => {
        let { angle, visionAngle, patrolAngle, alertLevel } = enemy;
        const { x, y, state, speed } = enemy;
        const moveSpeed = state === 'chase' ? speed * 2.8 : speed;
        let nx = x + Math.cos(angle) * moveSpeed;
        let ny = y + Math.sin(angle) * moveSpeed;
        if (nx < 40 || nx > GAME_W()-40) angle = Math.PI - angle;
        if (ny < 40 || ny > GAME_H()-40) angle = -angle;
        nx = Math.max(40, Math.min(GAME_W()-40, nx));
        ny = Math.max(40, Math.min(GAME_H()-40, ny));

        if (state !== 'chase') { patrolAngle += 0.008; visionAngle = angle + Math.sin(patrolAngle)*VISION_HALF_ANGLE*1.2; }
        else { const a = Math.atan2(playerRef.current.y-ny, playerRef.current.x-nx); visionAngle = a; angle = a; }

        const pdx = playerRef.current.x-nx, pdy = playerRef.current.y-ny;
        const dist = Math.sqrt(pdx*pdx+pdy*pdy);
        const inCone = angleDiff(visionAngle, Math.atan2(pdy,pdx)) < VISION_HALF_ANGLE;
        const inRange = dist < (state==='chase'?MAX_DETECT_DIST*1.5:VISION_RANGE);
        const noise = crouchRef.current ? 0.3 : 1.0;
        if (inCone && inRange) alertLevel = Math.min(1, alertLevel + DETECTION_RATE*noise*(1+(VISION_RANGE-dist)/VISION_RANGE));
        else if (dist < 60 && !crouchRef.current) alertLevel = Math.min(1, alertLevel + DETECTION_RATE*0.5);
        else alertLevel = Math.max(0, alertLevel - DEDETECTION_RATE);

        const newState: Enemy['state'] = alertLevel>0.85?'chase':alertLevel>0.35?'alert':'patrol';
        return { ...enemy, x: nx, y: ny, angle, visionAngle, patrolAngle, alertLevel, state: newState };
      });

      enemiesRef.current = updatedEnemies;
      const maxAlert = Math.max(0, ...updatedEnemies.map(e => e.alertLevel));
      const caught = updatedEnemies.some(e => { const d2x=e.x-newPx, d2y=e.y-newPy; return Math.sqrt(d2x*d2x+d2y*d2y)<32 && e.state==='chase'; });
      const near = itemsRef.current.find(it => { if (it.picked) return false; const d2x=it.x-newPx, d2y=it.y-newPy; return Math.sqrt(d2x*d2x+d2y*d2y)<ITEM_PICKUP_DIST; });

      setPlayerPos({ x: newPx, y: newPy });
      setMoveDir(moving ? (dx > 0 ? 1 : -1) : 0);
      setEnemies([...updatedEnemies]);
      setMaxAlertLevel(maxAlert);
      setIsDetected(maxAlert > 0.5);
      setNearbyItem(near || null);

      if (caught) { setGameState('caught'); return; }
      if (itemsRef.current.filter(i=>!i.picked).length===0) { setGameState('escaped'); return; }
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState]);

  const mobilePress = useCallback((key: string, down: boolean) => { if (down) keysRef.current.add(key); else keysRef.current.delete(key); }, []);

  const stealthColor = maxAlertLevel < 0.35 ? '#4dc038' : maxAlertLevel < 0.7 ? '#d4a020' : '#c03a2b';
  const stealthLabel = maxAlertLevel < 0.35 ? 'Скрытность: Полная' : maxAlertLevel < 0.7 ? 'Заметили...' : 'ОПАСНОСТЬ!';

  return (
    <div className="game-container">
      <div className="forest-bg"/>
      <div className="fog-layer"/>

      {particles.map(p => (
        <div key={p.id} className="particle" style={{ left:`${p.x}%`, bottom:`${p.y}%`, animationDelay:`${p.delay}s`, animationDuration:`${p.duration}s` }}/>
      ))}
      {footsteps.map(f => <div key={f.id} className="footstep" style={{ left:f.x, top:f.y }}/>)}

      {/* Items (3D SVG) */}
      {gameState === 'playing' && items.filter(i=>!i.picked).map(item => (
        <div key={item.id} style={{ position:'absolute', left:item.x, top:item.y, transform:'translate(-50%,-100%)', zIndex:7, animation:'float 2.8s ease-in-out infinite', filter:'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }}>
          <ItemSprite id={item.typeId}/>
          {nearbyItem?.id === item.id && (
            <div className="pickup-hint" style={{ left:'50%' }}>[E] Подобрать</div>
          )}
        </div>
      ))}

      {/* Enemies (3D SVG) */}
      {gameState === 'playing' && enemies.map(enemy => {
        const coneColor = enemy.state==='chase'?'rgba(200,50,30,0.16)':enemy.state==='alert'?'rgba(200,160,20,0.11)':'rgba(80,180,50,0.06)';
        const coneStroke = enemy.state==='chase'?'rgba(200,50,30,0.5)':enemy.state==='alert'?'rgba(200,160,20,0.4)':'rgba(80,180,50,0.18)';
        const vr = enemy.state==='chase'?MAX_DETECT_DIST*1.5:VISION_RANGE;
        const a1=enemy.visionAngle-VISION_HALF_ANGLE, a2=enemy.visionAngle+VISION_HALF_ANGLE;
        const x1=Math.cos(a1)*vr, y1=Math.sin(a1)*vr, x2=Math.cos(a2)*vr, y2=Math.sin(a2)*vr;
        const facingRight = Math.cos(enemy.visionAngle) >= 0;

        return (
          <div key={enemy.id}>
            <svg style={{ position:'absolute', left:enemy.x-vr, top:enemy.y-vr, width:vr*2, height:vr*2, pointerEvents:'none', zIndex:8 }}>
              <path d={`M ${vr} ${vr} L ${vr+x1} ${vr+y1} A ${vr} ${vr} 0 0 1 ${vr+x2} ${vr+y2} Z`} fill={coneColor} stroke={coneStroke} strokeWidth="1"/>
            </svg>

            {enemy.alertLevel > 0.1 && (
              <div style={{ position:'absolute', left:enemy.x, top:enemy.y-74, transform:'translateX(-50%)', zIndex:15, pointerEvents:'none', textAlign:'center' }}>
                <div style={{ fontSize:11, fontFamily:'Golos Text,sans-serif', letterSpacing:'0.05em', color:enemy.state==='chase'?'#e05030':'#d4a020', marginBottom:2 }}>
                  {enemy.state==='chase'?'⚠ ЗАСЕЧЁН':enemy.state==='alert'?'? …':''}
                </div>
                <div style={{ width:32, height:4, background:'rgba(0,0,0,0.5)', borderRadius:2, border:'1px solid rgba(255,255,255,0.1)', margin:'0 auto' }}>
                  <div style={{ width:`${enemy.alertLevel*100}%`, height:'100%', borderRadius:2, background:enemy.alertLevel>0.7?'#c03a2b':enemy.alertLevel>0.35?'#d4a020':'#4dc038', transition:'all 0.15s' }}/>
                </div>
              </div>
            )}

            <div style={{ position:'absolute', left:enemy.x, top:enemy.y, transform:`translate(-50%,-100%) scaleX(${facingRight?1:-1})`, zIndex:9 }}>
              <EnemySprite state={enemy.state}/>
            </div>
          </div>
        );
      })}

      {/* Player (3D SVG) */}
      {gameState === 'playing' && (
        <div style={{ position:'absolute', left:playerPos.x, top:playerPos.y, transform:'translate(-50%,-100%)', zIndex:10 }}>
          <PlayerSprite crouch={isCrouching} moveDir={moveDir}/>
          {isCrouching && <div className="crouch-indicator">крадётся</div>}
        </div>
      )}

      <div className={`detection-flash ${isDetected?'active':''}`}/>
      <div className="vignette"/>

      {/* HUD */}
      {gameState === 'playing' && (
        <>
          <div className="hud hud-top">
            <div className="stealth-bar">
              <span style={{ color:stealthColor }}>{stealthLabel}</span>
              <div style={{ width:160, height:4, background:'rgba(255,255,255,0.1)', borderRadius:2, marginTop:4 }}>
                <div style={{ width:`${maxAlertLevel*100}%`, height:'100%', borderRadius:2, background:stealthColor, transition:'all 0.2s' }}/>
              </div>
            </div>
            <div className="score-panel">🌿 {score} очков</div>
            <div className="score-panel">📦 {items.filter(i=>!i.picked).length} осталось</div>
          </div>

          <div className="hud hud-bottom-right">
            <div className="inventory-panel">
              <div className="inventory-title">Инвентарь</div>
              <div className="inventory-grid">
                {Array.from({ length:12 }, (_, i) => {
                  const entry = inventory[i];
                  return (
                    <div key={i} className="inventory-slot" title={entry?.name}>
                      {entry && (
                        <>
                          <div style={{ transform:'scale(0.55)', transformOrigin:'center' }}>
                            <ItemSprite id={entry.typeId}/>
                          </div>
                          {entry.count > 1 && <span className="item-count">{entry.count}</span>}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:8, fontSize:10, color:'rgba(120,180,80,0.5)', letterSpacing:'0.08em', textAlign:'center' }}>
                [E] подобрать · [Shift] красться
              </div>
            </div>
          </div>

          <div className={`alert-indicator ${maxAlertLevel>0.85?'visible':''}`}>Опасность!</div>

          <div className="mobile-dpad">
            <button className="dpad-btn dpad-up" onTouchStart={()=>mobilePress('arrowup',true)} onTouchEnd={()=>mobilePress('arrowup',false)}>↑</button>
            <button className="dpad-btn dpad-down" onTouchStart={()=>mobilePress('arrowdown',true)} onTouchEnd={()=>mobilePress('arrowdown',false)}>↓</button>
            <button className="dpad-btn dpad-left" onTouchStart={()=>mobilePress('arrowleft',true)} onTouchEnd={()=>mobilePress('arrowleft',false)}>←</button>
            <button className="dpad-btn dpad-right" onTouchStart={()=>mobilePress('arrowright',true)} onTouchEnd={()=>mobilePress('arrowright',false)}>→</button>
          </div>

          <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', fontSize:10, letterSpacing:'0.1em', color:'rgba(100,160,70,0.32)', fontFamily:'Golos Text,sans-serif', pointerEvents:'none', zIndex:20 }}>
            WASD / Стрелки · Shift — красться · E — подобрать
          </div>
        </>
      )}

      {/* Start */}
      {gameState === 'start' && (
        <div className="start-screen">
          <div style={{ position:'absolute', inset:0, backgroundImage:`url(${FOREST_BG})`, backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(0.18) saturate(0.5)' }}/>
          <div style={{ position:'relative', textAlign:'center', padding:'0 20px' }}>
            <div style={{ marginBottom:32, filter:'drop-shadow(0 0 40px rgba(100,200,60,0.3))' }}>
              <PlayerSprite crouch={false} moveDir={0}/>
            </div>
            <div className="start-title">Лесной<br/>Скиталец</div>
            <div className="start-subtitle">Выживание в тёмном лесу</div>
            <div className="start-controls">
              <div className="key-hint"><span className="key-badge">WASD</span><span>Движение</span></div>
              <div className="key-hint"><span className="key-badge">Shift</span><span>Красться</span></div>
              <div className="key-hint"><span className="key-badge">E</span><span>Подобрать</span></div>
              <div className="key-hint"><span style={{ fontSize:16 }}>👁</span><span>Избегай стражей</span></div>
            </div>
            <button className="start-btn" onClick={startGame}>Войти в лес</button>
            <div style={{ marginTop:20, fontSize:12, color:'rgba(100,160,70,0.4)', fontFamily:'Golos Text', letterSpacing:'0.08em' }}>
              Собери все ресурсы, оставаясь незамеченным
            </div>
          </div>
        </div>
      )}

      {/* Caught */}
      {gameState === 'caught' && (
        <div className="start-screen" style={{ background:'rgba(30,5,5,0.95)' }}>
          <div style={{ position:'relative', textAlign:'center' }}>
            <div style={{ marginBottom:24, opacity:0.7 }}><EnemySprite state="chase"/></div>
            <div className="start-title" style={{ color:'rgba(220,100,80,0.9)', fontSize:'clamp(36px,6vw,72px)' }}>Пойман!</div>
            <div className="start-subtitle" style={{ color:'rgba(180,80,60,0.6)' }}>Стражник тебя заметил</div>
            <div style={{ marginTop:20, fontSize:22, fontFamily:'Cormorant Garamond', color:'rgba(200,160,100,0.8)', fontStyle:'italic' }}>Собрано очков: {score}</div>
            <div style={{ marginTop:10, display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', alignItems:'center' }}>
              {inventory.map((it,i)=>(
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                  <div style={{ transform:'scale(0.6)', transformOrigin:'center' }}><ItemSprite id={it.typeId}/></div>
                  <span style={{ fontSize:10, color:'rgba(180,160,120,0.7)', fontFamily:'Golos Text' }}>×{it.count}</span>
                </div>
              ))}
            </div>
            <button className="start-btn" style={{ marginTop:32, background:'linear-gradient(135deg,rgba(100,30,20,.8),rgba(60,15,10,.9))', borderColor:'rgba(160,60,50,.5)', color:'rgba(220,160,140,.95)' }} onClick={startGame}>Попробовать снова</button>
          </div>
        </div>
      )}

      {/* Escaped */}
      {gameState === 'escaped' && (
        <div className="start-screen" style={{ background:'rgba(5,20,3,0.95)' }}>
          <div style={{ position:'relative', textAlign:'center' }}>
            <div style={{ marginBottom:24 }}><PlayerSprite crouch={false} moveDir={0}/></div>
            <div className="start-title" style={{ color:'rgba(140,220,100,0.95)', fontSize:'clamp(36px,6vw,72px)' }}>Выжил!</div>
            <div className="start-subtitle" style={{ color:'rgba(100,180,70,0.6)' }}>Все ресурсы собраны</div>
            <div style={{ marginTop:20, fontSize:28, fontFamily:'Cormorant Garamond', color:'rgba(200,240,160,0.9)', fontStyle:'italic' }}>{score} очков</div>
            <div style={{ marginTop:10, display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', alignItems:'center' }}>
              {inventory.map((it,i)=>(
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                  <div style={{ transform:'scale(0.6)', transformOrigin:'center' }}><ItemSprite id={it.typeId}/></div>
                  <span style={{ fontSize:10, color:'rgba(160,200,120,0.7)', fontFamily:'Golos Text' }}>×{it.count}</span>
                </div>
              ))}
            </div>
            <button className="start-btn" onClick={startGame} style={{ marginTop:32 }}>Сыграть снова</button>
          </div>
        </div>
      )}
    </div>
  );
}
