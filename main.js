// ファイル: main.js

const MAP_WIDTH = 5;
const MAP_HEIGHT = 5;
const terrain = ['🟩', '⬛'];
const playerIcon = '🧙‍♂️';
const enemyIcon = '👾';
const bossIcon = '💀';

let map = [];
let playerX = 0;
let playerY = 0;
let inBattle = false;
let enemyX = 2;
let enemyY = 2;
let bossX = 4;
let bossY = 4;
let level = 1;
let exp = 0;

const levelMagic = {
  1: ['メラ'],
  2: ['メラ', 'ギラ'],
  3: ['メラ', 'ギラ', 'ベギラマ']
};

function generateMap() {
  map = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    let row = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (x === enemyX && y === enemyY) {
        row.push(enemyIcon);
      } else if (x === bossX && y === bossY) {
        row.push(bossIcon);
      } else {
        row.push(terrain[Math.floor(Math.random() * terrain.length)]);
      }
    }
    map.push(row);
  }
}

function renderMap() {
  const game = document.getElementById("game");
  let output = `<div>Lv${level} / EXP: ${exp}</div><br>`;
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      output += (x === playerX && y === playerY) ? playerIcon : map[y][x];
    }
    output += "<br>";
  }
  game.innerHTML = output;
}

function startBattle(type) {
  inBattle = true;
  const game = document.getElementById("game");
  const magics = levelMagic[level] || ['メラ'];
  let magicButtons = magics.map(m => `<button onclick="castMagic('${m}', '${type}')">▶ まほう（${m}）</button>`).join('');
  let enemyName = type === 'boss' ? '💀 魔王ゾーマ' : '👾 敵';

  game.innerHTML = `
    <div>${enemyName}があらわれた！</div><br>
    <button onclick="attack('${type}')">▶ たたかう</button>
    ${magicButtons}
  `;
}

function attack(type) {
  exp += type === 'boss' ? 20 : 5;
  checkLevelUp();
  showVictory(type);
}

function castMagic(name, type) {
  exp += type === 'boss' ? 25 : 7;
  checkLevelUp();
  showVictory(type, `🪄 ${name}をとなえた！ 敵をたおした！`);
}

function checkLevelUp() {
  if (exp >= 20 && level === 1) {
    level++;
    alert(`🎉 レベルアップ！ Lv${level}になった！`);
  } else if (exp >= 40 && level === 2) {
    level++;
    alert(`🎉 レベルアップ！ Lv${level}になった！`);
  }
}

function showVictory(type, message = "敵をたおした！") {
  const game = document.getElementById("game");
  const endText = type === 'boss' ? '<br><strong>✨ 世界に平和が戻った！</strong>' : '';
  game.innerHTML = `<div>${message}${endText}</div><br><button onclick="endBattle('${type}')">▶ つづける</button>`;
}

function endBattle(type) {
  inBattle = false;
  if (type === 'boss') {
    map[bossY][bossX] = '🟩';
  } else {
    map[enemyY][enemyX] = '🟩';
  }
  renderMap();
}

function move(dx, dy) {
  if (inBattle) return;

  const newX = playerX + dx;
  const newY = playerY + dy;
  if (newX < 0 || newY < 0 || newX >= MAP_WIDTH || newY >= MAP_HEIGHT) return;

  playerX = newX;
  playerY = newY;

  if (playerX === enemyX && playerY === enemyY) {
    startBattle('normal');
  } else if (playerX === bossX && playerY === bossY) {
    startBattle('boss');
  } else {
    renderMap();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  generateMap();
  renderMap();
  document.addEventListener("keydown", e => {
    if (e.key === 'ArrowUp') move(0, -1);
    if (e.key === 'ArrowDown') move(0, 1);
    if (e.key === 'ArrowLeft') move(-1, 0);
    if (e.key === 'ArrowRight') move(1, 0);
  });

  // バーチャルパッド操作
  document.getElementById("btn-up").addEventListener("click", () => move(0, -1));
  document.getElementById("btn-down").addEventListener("click", () => move(0, 1));
  document.getElementById("btn-left").addEventListener("click", () => move(-1, 0));
  document.getElementById("btn-right").addEventListener("click", () => move(1, 0));
});