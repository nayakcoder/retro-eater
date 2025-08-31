import React, { useState, useEffect, useRef } from 'react';

const PlatformerGame = () => {
  // Game constants
  const GRAVITY = 0.5;
  const JUMP_FORCE = -12;
  const PLAYER_SPEED = 5;
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 500;
  
  // Game state
  const [player, setPlayer] = useState({
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    velocityY: 0,
    isJumping: false,
    direction: 'right',
    powerUp: null,
    powerUpTimer: 0,
    doubleJumpUsed: false,
  });
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [keys, setKeys] = useState({
    left: false,
    right: false,
    up: false,
  });
  
  // Particle effects
  const [particles, setParticles] = useState([]);
  const particleId = useRef(0);
  
  // Power-ups
  const [powerUps, setPowerUps] = useState([]);
  const powerUpId = useRef(0);
  
  // Game elements for different levels
  const levels = [
    // Level 1 - Forest
    {
      platforms: [
        { x: 0, y: 450, width: 200, height: 50, color: 'from-green-600 to-emerald-800' },
        { x: 250, y: 400, width: 150, height: 20, color: 'from-green-600 to-emerald-800' },
        { x: 450, y: 350, width: 100, height: 20, color: 'from-green-600 to-emerald-800' },
        { x: 600, y: 300, width: 200, height: 20, color: 'from-green-600 to-emerald-800' },
        { x: 300, y: 250, width: 100, height: 20, color: 'from-green-600 to-emerald-800' },
        { x: 100, y: 200, width: 150, height: 20, color: 'from-green-600 to-emerald-800' },
        { x: 500, y: 150, width: 200, height: 20, color: 'from-green-600 to-emerald-800' },
      ],
      coins: [
        { id: 1, x: 300, y: 350, collected: false },
        { id: 2, x: 500, y: 300, collected: false },
        { id: 3, x: 350, y: 200, collected: false },
        { id: 4, x: 150, y: 150, collected: false },
        { id: 5, x: 600, y: 100, collected: false },
      ],
      enemies: [
        { id: 1, x: 300, y: 380, width: 30, height: 20, direction: 1, speed: 2 },
        { id: 2, x: 100, y: 180, width: 30, height: 20, direction: -1, speed: 2 },
        { id: 3, x: 600, y: 280, width: 30, height: 20, direction: 1, speed: 2 },
      ],
      powerUps: [
        { id: 1, x: 400, y: 300, type: 'doubleJump', collected: false },
      ],
      background: 'from-sky-300 to-emerald-500',
      theme: 'forest',
      name: 'Enchanted Forest',
    },
    // Level 2 - Space
    {
      platforms: [
        { x: 0, y: 450, width: 150, height: 50, color: 'from-purple-600 to-indigo-800' },
        { x: 200, y: 400, width: 100, height: 20, color: 'from-purple-600 to-indigo-800' },
        { x: 350, y: 350, width: 100, height: 20, color: 'from-purple-600 to-indigo-800' },
        { x: 500, y: 300, width: 100, height: 20, color: 'from-purple-600 to-indigo-800' },
        { x: 650, y: 250, width: 150, height: 20, color: 'from-purple-600 to-indigo-800' },
        { x: 300, y: 200, width: 100, height: 20, color: 'from-purple-600 to-indigo-800' },
        { x: 100, y: 150, width: 100, height: 20, color: 'from-purple-600 to-indigo-800' },
        { x: 450, y: 100, width: 200, height: 20, color: 'from-purple-600 to-indigo-800' },
      ],
      coins: [
        { id: 1, x: 250, y: 350, collected: false },
        { id: 2, x: 400, y: 300, collected: false },
        { id: 3, x: 550, y: 250, collected: false },
        { id: 4, x: 350, y: 150, collected: false },
        { id: 5, x: 500, y: 50, collected: false },
        { id: 6, x: 150, y: 100, collected: false },
      ],
      enemies: [
        { id: 1, x: 200, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 500, y: 280, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 300, y: 180, width: 30, height: 20, direction: 1, speed: 2 },
        { id: 4, x: 100, y: 130, width: 30, height: 20, direction: -1, speed: 2 },
      ],
      powerUps: [
        { id: 1, x: 300, y: 150, type: 'speedBoost', collected: false },
      ],
      background: 'from-indigo-900 to-purple-900',
      theme: 'space',
      name: 'Cosmic Adventure',
    },
    // Level 3 - Volcano
    {
      platforms: [
        { x: 0, y: 450, width: 100, height: 50, color: 'from-red-600 to-orange-800' },
        { x: 150, y: 400, width: 80, height: 20, color: 'from-red-600 to-orange-800' },
        { x: 280, y: 350, width: 80, height: 20, color: 'from-red-600 to-orange-800' },
        { x: 410, y: 300, width: 80, height: 20, color: 'from-red-600 to-orange-800' },
        { x: 540, y: 250, width: 80, height: 20, color: 'from-red-600 to-orange-800' },
        { x: 670, y: 200, width: 130, height: 20, color: 'from-red-600 to-orange-800' },
        { x: 500, y: 150, width: 80, height: 20, color: 'from-red-600 to-orange-800' },
        { x: 350, y: 100, width: 80, height: 20, color: 'from-red-600 to-orange-800' },
        { x: 200, y: 150, width: 80, height: 20, color: 'from-red-600 to-orange-800' },
        { x: 50, y: 200, width: 100, height: 20, color: 'from-red-600 to-orange-800' },
      ],
      coins: [
        { id: 1, x: 190, y: 350, collected: false },
        { id: 2, x: 320, y: 300, collected: false },
        { id: 3, x: 450, y: 250, collected: false },
        { id: 4, x: 580, y: 200, collected: false },
        { id: 5, x: 700, y: 150, collected: false },
        { id: 6, x: 540, y: 100, collected: false },
        { id: 7, x: 390, y: 50, collected: false },
        { id: 8, x: 240, y: 100, collected: false },
        { id: 9, x: 100, y: 150, collected: false },
      ],
      enemies: [
        { id: 1, x: 150, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 280, y: 330, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 410, y: 280, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 540, y: 230, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 670, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
      ],
      powerUps: [
        { id: 1, x: 400, y: 250, type: 'shield', collected: false },
      ],
      background: 'from-orange-500 to-red-800',
      theme: 'volcano',
      name: 'Molten Challenge',
    },
    // Level 4 - Ice
    {
      platforms: [
        { x: 0, y: 450, width: 150, height: 50, color: 'from-blue-400 to-cyan-600' },
        { x: 200, y: 400, width: 100, height: 20, color: 'from-blue-400 to-cyan-600' },
        { x: 350, y: 350, width: 100, height: 20, color: 'from-blue-400 to-cyan-600' },
        { x: 500, y: 300, width: 100, height: 20, color: 'from-blue-400 to-cyan-600' },
        { x: 650, y: 250, width: 150, height: 20, color: 'from-blue-400 to-cyan-600' },
        { x: 300, y: 200, width: 100, height: 20, color: 'from-blue-400 to-cyan-600' },
        { x: 100, y: 150, width: 100, height: 20, color: 'from-blue-400 to-cyan-600' },
        { x: 450, y: 100, width: 200, height: 20, color: 'from-blue-400 to-cyan-600' },
        { x: 200, y: 50, width: 100, height: 20, color: 'from-blue-400 to-cyan-600' },
      ],
      coins: [
        { id: 1, x: 250, y: 350, collected: false },
        { id: 2, x: 400, y: 300, collected: false },
        { id: 3, x: 550, y: 250, collected: false },
        { id: 4, x: 350, y: 150, collected: false },
        { id: 5, x: 500, y: 50, collected: false },
        { id: 6, x: 150, y: 100, collected: false },
        { id: 7, x: 250, y: 0, collected: false },
        { id: 8, x: 550, y: 0, collected: false },
      ],
      enemies: [
        { id: 1, x: 200, y: 380, width: 30, height: 20, direction: 1, speed: 4 },
        { id: 2, x: 500, y: 280, width: 30, height: 20, direction: -1, speed: 4 },
        { id: 3, x: 300, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 100, y: 130, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 450, y: 80, width: 30, height: 20, direction: 1, speed: 3 },
      ],
      powerUps: [
        { id: 1, x: 300, y: 150, type: 'doubleJump', collected: false },
      ],
      background: 'from-cyan-300 to-blue-500',
      theme: 'ice',
      name: 'Frozen Peaks',
    },
    // Level 5 - Candy
    {
      platforms: [
        { x: 0, y: 450, width: 100, height: 50, color: 'from-pink-500 to-purple-600' },
        { x: 150, y: 400, width: 80, height: 20, color: 'from-pink-500 to-purple-600' },
        { x: 280, y: 350, width: 80, height: 20, color: 'from-pink-500 to-purple-600' },
        { x: 410, y: 300, width: 80, height: 20, color: 'from-pink-500 to-purple-600' },
        { x: 540, y: 250, width: 80, height: 20, color: 'from-pink-500 to-purple-600' },
        { x: 670, y: 200, width: 130, height: 20, color: 'from-pink-500 to-purple-600' },
        { x: 500, y: 150, width: 80, height: 20, color: 'from-pink-500 to-purple-600' },
        { x: 350, y: 100, width: 80, height: 20, color: 'from-pink-500 to-purple-600' },
        { x: 200, y: 150, width: 80, height: 20, color: 'from-pink-500 to-purple-600' },
        { x: 50, y: 200, width: 100, height: 20, color: 'from-pink-500 to-purple-600' },
        { x: 300, y: 50, width: 100, height: 20, color: 'from-pink-500 to-purple-600' },
      ],
      coins: [
        { id: 1, x: 190, y: 350, collected: false },
        { id: 2, x: 320, y: 300, collected: false },
        { id: 3, x: 450, y: 250, collected: false },
        { id: 4, x: 580, y: 200, collected: false },
        { id: 5, x: 700, y: 150, collected: false },
        { id: 6, x: 540, y: 100, collected: false },
        { id: 7, x: 390, y: 50, collected: false },
        { id: 8, x: 240, y: 100, collected: false },
        { id: 9, x: 100, y: 150, collected: false },
        { id: 10, x: 350, y: 0, collected: false },
      ],
      enemies: [
        { id: 1, x: 150, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 280, y: 330, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 410, y: 280, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 540, y: 230, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 670, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 6, x: 300, y: 30, width: 30, height: 20, direction: -1, speed: 4 },
      ],
      powerUps: [
        { id: 1, x: 400, y: 200, type: 'speedBoost', collected: false },
      ],
      background: 'from-pink-300 to-purple-400',
      theme: 'candy',
      name: 'Sweet Paradise',
    },
    // Level 6 - Desert
    {
      platforms: [
        { x: 0, y: 450, width: 150, height: 50, color: 'from-yellow-600 to-orange-800' },
        { x: 200, y: 400, width: 100, height: 20, color: 'from-yellow-600 to-orange-800' },
        { x: 350, y: 350, width: 100, height: 20, color: 'from-yellow-600 to-orange-800' },
        { x: 500, y: 300, width: 100, height: 20, color: 'from-yellow-600 to-orange-800' },
        { x: 650, y: 250, width: 150, height: 20, color: 'from-yellow-600 to-orange-800' },
        { x: 300, y: 200, width: 100, height: 20, color: 'from-yellow-600 to-orange-800' },
        { x: 100, y: 150, width: 100, height: 20, color: 'from-yellow-600 to-orange-800' },
        { x: 450, y: 100, width: 200, height: 20, color: 'from-yellow-600 to-orange-800' },
      ],
      coins: [
        { id: 1, x: 250, y: 350, collected: false },
        { id: 2, x: 400, y: 300, collected: false },
        { id: 3, x: 550, y: 250, collected: false },
        { id: 4, x: 350, y: 150, collected: false },
        { id: 5, x: 500, y: 50, collected: false },
        { id: 6, x: 150, y: 100, collected: false },
        { id: 7, x: 550, y: 50, collected: false },
      ],
      enemies: [
        { id: 1, x: 200, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 500, y: 280, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 300, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 100, y: 130, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 450, y: 80, width: 30, height: 20, direction: 1, speed: 4 },
      ],
      powerUps: [
        { id: 1, x: 300, y: 150, type: 'shield', collected: false },
      ],
      background: 'from-yellow-300 to-orange-500',
      theme: 'desert',
      name: 'Desert Oasis',
    },
    // Level 7 - Jungle
    {
      platforms: [
        { x: 0, y: 450, width: 100, height: 50, color: 'from-green-700 to-emerald-900' },
        { x: 150, y: 400, width: 80, height: 20, color: 'from-green-700 to-emerald-900' },
        { x: 280, y: 350, width: 80, height: 20, color: 'from-green-700 to-emerald-900' },
        { x: 410, y: 300, width: 80, height: 20, color: 'from-green-700 to-emerald-900' },
        { x: 540, y: 250, width: 80, height: 20, color: 'from-green-700 to-emerald-900' },
        { x: 670, y: 200, width: 130, height: 20, color: 'from-green-700 to-emerald-900' },
        { x: 500, y: 150, width: 80, height: 20, color: 'from-green-700 to-emerald-900' },
        { x: 350, y: 100, width: 80, height: 20, color: 'from-green-700 to-emerald-900' },
        { x: 200, y: 150, width: 80, height: 20, color: 'from-green-700 to-emerald-900' },
        { x: 50, y: 200, width: 100, height: 20, color: 'from-green-700 to-emerald-900' },
        { x: 300, y: 50, width: 100, height: 20, color: 'from-green-700 to-emerald-900' },
      ],
      coins: [
        { id: 1, x: 190, y: 350, collected: false },
        { id: 2, x: 320, y: 300, collected: false },
        { id: 3, x: 450, y: 250, collected: false },
        { id: 4, x: 580, y: 200, collected: false },
        { id: 5, x: 700, y: 150, collected: false },
        { id: 6, x: 540, y: 100, collected: false },
        { id: 7, x: 390, y: 50, collected: false },
        { id: 8, x: 240, y: 100, collected: false },
        { id: 9, x: 100, y: 150, collected: false },
        { id: 10, x: 350, y: 0, collected: false },
        { id: 11, x: 500, y: 0, collected: false },
      ],
      enemies: [
        { id: 1, x: 150, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 280, y: 330, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 410, y: 280, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 540, y: 230, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 670, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 6, x: 300, y: 30, width: 30, height: 20, direction: -1, speed: 4 },
        { id: 7, x: 200, y: 130, width: 30, height: 20, direction: 1, speed: 3 },
      ],
      powerUps: [
        { id: 1, x: 400, y: 200, type: 'doubleJump', collected: false },
      ],
      background: 'from-green-400 to-emerald-600',
      theme: 'jungle',
      name: 'Jungle Adventure',
    },
    // Level 8 - Castle
    {
      platforms: [
        { x: 0, y: 450, width: 150, height: 50, color: 'from-gray-600 to-gray-800' },
        { x: 200, y: 400, width: 100, height: 20, color: 'from-gray-600 to-gray-800' },
        { x: 350, y: 350, width: 100, height: 20, color: 'from-gray-600 to-gray-800' },
        { x: 500, y: 300, width: 100, height: 20, color: 'from-gray-600 to-gray-800' },
        { x: 650, y: 250, width: 150, height: 20, color: 'from-gray-600 to-gray-800' },
        { x: 300, y: 200, width: 100, height: 20, color: 'from-gray-600 to-gray-800' },
        { x: 100, y: 150, width: 100, height: 20, color: 'from-gray-600 to-gray-800' },
        { x: 450, y: 100, width: 200, height: 20, color: 'from-gray-600 to-gray-800' },
        { x: 200, y: 50, width: 100, height: 20, color: 'from-gray-600 to-gray-800' },
      ],
      coins: [
        { id: 1, x: 250, y: 350, collected: false },
        { id: 2, x: 400, y: 300, collected: false },
        { id: 3, x: 550, y: 250, collected: false },
        { id: 4, x: 350, y: 150, collected: false },
        { id: 5, x: 500, y: 50, collected: false },
        { id: 6, x: 150, y: 100, collected: false },
        { id: 7, x: 250, y: 0, collected: false },
        { id: 8, x: 550, y: 0, collected: false },
        { id: 9, x: 300, y: 50, collected: false },
      ],
      enemies: [
        { id: 1, x: 200, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 500, y: 280, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 300, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 100, y: 130, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 450, y: 80, width: 30, height: 20, direction: 1, speed: 4 },
        { id: 6, x: 200, y: 30, width: 30, height: 20, direction: -1, speed: 3 },
      ],
      powerUps: [
        { id: 1, x: 300, y: 150, type: 'speedBoost', collected: false },
      ],
      background: 'from-gray-300 to-gray-500',
      theme: 'castle',
      name: 'Royal Castle',
    },
    // Level 9 - Underwater
    {
      platforms: [
        { x: 0, y: 450, width: 100, height: 50, color: 'from-blue-500 to-cyan-700' },
        { x: 150, y: 400, width: 80, height: 20, color: 'from-blue-500 to-cyan-700' },
        { x: 280, y: 350, width: 80, height: 20, color: 'from-blue-500 to-cyan-700' },
        { x: 410, y: 300, width: 80, height: 20, color: 'from-blue-500 to-cyan-700' },
        { x: 540, y: 250, width: 80, height: 20, color: 'from-blue-500 to-cyan-700' },
        { x: 670, y: 200, width: 130, height: 20, color: 'from-blue-500 to-cyan-700' },
        { x: 500, y: 150, width: 80, height: 20, color: 'from-blue-500 to-cyan-700' },
        { x: 350, y: 100, width: 80, height: 20, color: 'from-blue-500 to-cyan-700' },
        { x: 200, y: 150, width: 80, height: 20, color: 'from-blue-500 to-cyan-700' },
        { x: 50, y: 200, width: 100, height: 20, color: 'from-blue-500 to-cyan-700' },
        { x: 300, y: 50, width: 100, height: 20, color: 'from-blue-500 to-cyan-700' },
      ],
      coins: [
        { id: 1, x: 190, y: 350, collected: false },
        { id: 2, x: 320, y: 300, collected: false },
        { id: 3, x: 450, y: 250, collected: false },
        { id: 4, x: 580, y: 200, collected: false },
        { id: 5, x: 700, y: 150, collected: false },
        { id: 6, x: 540, y: 100, collected: false },
        { id: 7, x: 390, y: 50, collected: false },
        { id: 8, x: 240, y: 100, collected: false },
        { id: 9, x: 100, y: 150, collected: false },
        { id: 10, x: 350, y: 0, collected: false },
        { id: 11, x: 500, y: 0, collected: false },
        { id: 12, x: 650, y: 150, collected: false },
      ],
      enemies: [
        { id: 1, x: 150, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 280, y: 330, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 410, y: 280, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 540, y: 230, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 670, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 6, x: 300, y: 30, width: 30, height: 20, direction: -1, speed: 4 },
        { id: 7, x: 200, y: 130, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 8, x: 400, y: 130, width: 30, height: 20, direction: -1, speed: 3 },
      ],
      powerUps: [
        { id: 1, x: 400, y: 200, type: 'shield', collected: false },
      ],
      background: 'from-blue-400 to-cyan-600',
      theme: 'underwater',
      name: 'Deep Sea Dive',
    },
    // Level 10 - Clouds
    {
      platforms: [
        { x: 0, y: 450, width: 150, height: 50, color: 'from-white to-gray-200' },
        { x: 200, y: 400, width: 100, height: 20, color: 'from-white to-gray-200' },
        { x: 350, y: 350, width: 100, height: 20, color: 'from-white to-gray-200' },
        { x: 500, y: 300, width: 100, height: 20, color: 'from-white to-gray-200' },
        { x: 650, y: 250, width: 150, height: 20, color: 'from-white to-gray-200' },
        { x: 300, y: 200, width: 100, height: 20, color: 'from-white to-gray-200' },
        { x: 100, y: 150, width: 100, height: 20, color: 'from-white to-gray-200' },
        { x: 450, y: 100, width: 200, height: 20, color: 'from-white to-gray-200' },
        { x: 200, y: 50, width: 100, height: 20, color: 'from-white to-gray-200' },
      ],
      coins: [
        { id: 1, x: 250, y: 350, collected: false },
        { id: 2, x: 400, y: 300, collected: false },
        { id: 3, x: 550, y: 250, collected: false },
        { id: 4, x: 350, y: 150, collected: false },
        { id: 5, x: 500, y: 50, collected: false },
        { id: 6, x: 150, y: 100, collected: false },
        { id: 7, x: 250, y: 0, collected: false },
        { id: 8, x: 550, y: 0, collected: false },
        { id: 9, x: 300, y: 50, collected: false },
        { id: 10, x: 400, y: 50, collected: false },
      ],
      enemies: [
        { id: 1, x: 200, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 500, y: 280, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 300, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 100, y: 130, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 450, y: 80, width: 30, height: 20, direction: 1, speed: 4 },
        { id: 6, x: 200, y: 30, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 7, x: 350, y: 30, width: 30, height: 20, direction: 1, speed: 3 },
      ],
      powerUps: [
        { id: 1, x: 300, y: 150, type: 'doubleJump', collected: false },
      ],
      background: 'from-sky-200 to-white',
      theme: 'clouds',
      name: 'Sky High',
    },
    // Level 11 - Lava
    {
      platforms: [
        { x: 0, y: 450, width: 100, height: 50, color: 'from-red-700 to-orange-900' },
        { x: 150, y: 400, width: 80, height: 20, color: 'from-red-700 to-orange-900' },
        { x: 280, y: 350, width: 80, height: 20, color: 'from-red-700 to-orange-900' },
        { x: 410, y: 300, width: 80, height: 20, color: 'from-red-700 to-orange-900' },
        { x: 540, y: 250, width: 80, height: 20, color: 'from-red-700 to-orange-900' },
        { x: 670, y: 200, width: 130, height: 20, color: 'from-red-700 to-orange-900' },
        { x: 500, y: 150, width: 80, height: 20, color: 'from-red-700 to-orange-900' },
        { x: 350, y: 100, width: 80, height: 20, color: 'from-red-700 to-orange-900' },
        { x: 200, y: 150, width: 80, height: 20, color: 'from-red-700 to-orange-900' },
        { x: 50, y: 200, width: 100, height: 20, color: 'from-red-700 to-orange-900' },
        { x: 300, y: 50, width: 100, height: 20, color: 'from-red-700 to-orange-900' },
      ],
      coins: [
        { id: 1, x: 190, y: 350, collected: false },
        { id: 2, x: 320, y: 300, collected: false },
        { id: 3, x: 450, y: 250, collected: false },
        { id: 4, x: 580, y: 200, collected: false },
        { id: 5, x: 700, y: 150, collected: false },
        { id: 6, x: 540, y: 100, collected: false },
        { id: 7, x: 390, y: 50, collected: false },
        { id: 8, x: 240, y: 100, collected: false },
        { id: 9, x: 100, y: 150, collected: false },
        { id: 10, x: 350, y: 0, collected: false },
        { id: 11, x: 500, y: 0, collected: false },
        { id: 12, x: 650, y: 150, collected: false },
        { id: 13, x: 150, y: 0, collected: false },
      ],
      enemies: [
        { id: 1, x: 150, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 280, y: 330, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 410, y: 280, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 540, y: 230, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 670, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 6, x: 300, y: 30, width: 30, height: 20, direction: -1, speed: 4 },
        { id: 7, x: 200, y: 130, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 8, x: 400, y: 130, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 9, x: 600, y: 130, width: 30, height: 20, direction: 1, speed: 3 },
      ],
      powerUps: [
        { id: 1, x: 400, y: 200, type: 'speedBoost', collected: false },
      ],
      background: 'from-orange-600 to-red-900',
      theme: 'lava',
      name: 'Lava Fields',
    },
    // Level 12 - Mountains
    {
      platforms: [
        { x: 0, y: 450, width: 150, height: 50, color: 'from-gray-500 to-gray-700' },
        { x: 200, y: 400, width: 100, height: 20, color: 'from-gray-500 to-gray-700' },
        { x: 350, y: 350, width: 100, height: 20, color: 'from-gray-500 to-gray-700' },
        { x: 500, y: 300, width: 100, height: 20, color: 'from-gray-500 to-gray-700' },
        { x: 650, y: 250, width: 150, height: 20, color: 'from-gray-500 to-gray-700' },
        { x: 300, y: 200, width: 100, height: 20, color: 'from-gray-500 to-gray-700' },
        { x: 100, y: 150, width: 100, height: 20, color: 'from-gray-500 to-gray-700' },
        { x: 450, y: 100, width: 200, height: 20, color: 'from-gray-500 to-gray-700' },
        { x: 200, y: 50, width: 100, height: 20, color: 'from-gray-500 to-gray-700' },
      ],
      coins: [
        { id: 1, x: 250, y: 350, collected: false },
        { id: 2, x: 400, y: 300, collected: false },
        { id: 3, x: 550, y: 250, collected: false },
        { id: 4, x: 350, y: 150, collected: false },
        { id: 5, x: 500, y: 50, collected: false },
        { id: 6, x: 150, y: 100, collected: false },
        { id: 7, x: 250, y: 0, collected: false },
        { id: 8, x: 550, y: 0, collected: false },
        { id: 9, x: 300, y: 50, collected: false },
        { id: 10, x: 400, y: 50, collected: false },
        { id: 11, x: 600, y: 200, collected: false },
      ],
      enemies: [
        { id: 1, x: 200, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 500, y: 280, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 300, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 100, y: 130, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 450, y: 80, width: 30, height: 20, direction: 1, speed: 4 },
        { id: 6, x: 200, y: 30, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 7, x: 350, y: 30, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 8, x: 600, y: 230, width: 30, height: 20, direction: -1, speed: 3 },
      ],
      powerUps: [
        { id: 1, x: 300, y: 150, type: 'shield', collected: false },
      ],
      background: 'from-gray-400 to-gray-600',
      theme: 'mountains',
      name: 'Mountain Climb',
    },
    // Level 13 - Factory
    {
      platforms: [
        { x: 0, y: 450, width: 100, height: 50, color: 'from-gray-700 to-gray-900' },
        { x: 150, y: 400, width: 80, height: 20, color: 'from-gray-700 to-gray-900' },
        { x: 280, y: 350, width: 80, height: 20, color: 'from-gray-700 to-gray-900' },
        { x: 410, y: 300, width: 80, height: 20, color: 'from-gray-700 to-gray-900' },
        { x: 540, y: 250, width: 80, height: 20, color: 'from-gray-700 to-gray-900' },
        { x: 670, y: 200, width: 130, height: 20, color: 'from-gray-700 to-gray-900' },
        { x: 500, y: 150, width: 80, height: 20, color: 'from-gray-700 to-gray-900' },
        { x: 350, y: 100, width: 80, height: 20, color: 'from-gray-700 to-gray-900' },
        { x: 200, y: 150, width: 80, height: 20, color: 'from-gray-700 to-gray-900' },
        { x: 50, y: 200, width: 100, height: 20, color: 'from-gray-700 to-gray-900' },
        { x: 300, y: 50, width: 100, height: 20, color: 'from-gray-700 to-gray-900' },
      ],
      coins: [
        { id: 1, x: 190, y: 350, collected: false },
        { id: 2, x: 320, y: 300, collected: false },
        { id: 3, x: 450, y: 250, collected: false },
        { id: 4, x: 580, y: 200, collected: false },
        { id: 5, x: 700, y: 150, collected: false },
        { id: 6, x: 540, y: 100, collected: false },
        { id: 7, x: 390, y: 50, collected: false },
        { id: 8, x: 240, y: 100, collected: false },
        { id: 9, x: 100, y: 150, collected: false },
        { id: 10, x: 350, y: 0, collected: false },
        { id: 11, x: 500, y: 0, collected: false },
        { id: 12, x: 650, y: 150, collected: false },
        { id: 13, x: 150, y: 0, collected: false },
        { id: 14, x: 600, y: 0, collected: false },
      ],
      enemies: [
        { id: 1, x: 150, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 280, y: 330, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 410, y: 280, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 540, y: 230, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 670, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 6, x: 300, y: 30, width: 30, height: 20, direction: -1, speed: 4 },
        { id: 7, x: 200, y: 130, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 8, x: 400, y: 130, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 9, x: 600, y: 230, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 10, x: 100, y: 180, width: 30, height: 20, direction: -1, speed: 3 },
      ],
      powerUps: [
        { id: 1, x: 400, y: 200, type: 'doubleJump', collected: false },
      ],
      background: 'from-gray-500 to-gray-700',
      theme: 'factory',
      name: 'Industrial Zone',
    },
    // Level 14 - Space Station
    {
      platforms: [
        { x: 0, y: 450, width: 150, height: 50, color: 'from-purple-700 to-indigo-900' },
        { x: 200, y: 400, width: 100, height: 20, color: 'from-purple-700 to-indigo-900' },
        { x: 350, y: 350, width: 100, height: 20, color: 'from-purple-700 to-indigo-900' },
        { x: 500, y: 300, width: 100, height: 20, color: 'from-purple-700 to-indigo-900' },
        { x: 650, y: 250, width: 150, height: 20, color: 'from-purple-700 to-indigo-900' },
        { x: 300, y: 200, width: 100, height: 20, color: 'from-purple-700 to-indigo-900' },
        { x: 100, y: 150, width: 100, height: 20, color: 'from-purple-700 to-indigo-900' },
        { x: 450, y: 100, width: 200, height: 20, color: 'from-purple-700 to-indigo-900' },
        { x: 200, y: 50, width: 100, height: 20, color: 'from-purple-700 to-indigo-900' },
      ],
      coins: [
        { id: 1, x: 250, y: 350, collected: false },
        { id: 2, x: 400, y: 300, collected: false },
        { id: 3, x: 550, y: 250, collected: false },
        { id: 4, x: 350, y: 150, collected: false },
        { id: 5, x: 500, y: 50, collected: false },
        { id: 6, x: 150, y: 100, collected: false },
        { id: 7, x: 250, y: 0, collected: false },
        { id: 8, x: 550, y: 0, collected: false },
        { id: 9, x: 300, y: 50, collected: false },
        { id: 10, x: 400, y: 50, collected: false },
        { id: 11, x: 600, y: 200, collected: false },
        { id: 12, x: 100, y: 0, collected: false },
      ],
      enemies: [
        { id: 1, x: 200, y: 380, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 2, x: 500, y: 280, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 3, x: 300, y: 180, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 4, x: 100, y: 130, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 5, x: 450, y: 80, width: 30, height: 20, direction: 1, speed: 4 },
        { id: 6, x: 200, y: 30, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 7, x: 350, y: 30, width: 30, height: 20, direction: 1, speed: 3 },
        { id: 8, x: 600, y: 230, width: 30, height: 20, direction: -1, speed: 3 },
        { id: 9, x: 150, y: 30, width: 30, height: 20, direction: 1, speed: 3 },
      ],
      powerUps: [
        { id: 1, x: 300, y: 150, type: 'speedBoost', collected: false },
      ],
      background: 'from-indigo-800 to-purple-900',
      theme: 'spaceStation',
      name: 'Orbital Station',
    },
    // Level 15 - Final Boss
    {
      platforms: [
        { x: 0, y: 450, width: 100, height: 50, color: 'from-red-800 to-black' },
        { x: 150, y: 400, width: 80, height: 20, color: 'from-red-800 to-black' },
        { x: 280, y: 350, width: 80, height: 20, color: 'from-red-800 to-black' },
        { x: 410, y: 300, width: 80, height: 20, color: 'from-red-800 to-black' },
        { x: 540, y: 250, width: 80, height: 20, color: 'from-red-800 to-black' },
        { x: 670, y: 200, width: 130, height: 20, color: 'from-red-800 to-black' },
        { x: 500, y: 150, width: 80, height: 20, color: 'from-red-800 to-black' },
        { x: 350, y: 100, width: 80, height: 20, color: 'from-red-800 to-black' },
        { x: 200, y: 150, width: 80, height: 20, color: 'from-red-800 to-black' },
        { x: 50, y: 200, width: 100, height: 20, color: 'from-red-800 to-black' },
        { x: 300, y: 50, width: 100, height: 20, color: 'from-red-800 to-black' },
        { x: 600, y: 50, width: 100, height: 20, color: 'from-red-800 to-black' },
      ],
      coins: [
        { id: 1, x: 190, y: 350, collected: false },
        { id: 2, x: 320, y: 300, collected: false },
        { id: 3, x: 450, y: 250, collected: false },
        { id: 4, x: 580, y: 200, collected: false },
        { id: 5, x: 700, y: 150, collected: false },
        { id: 6, x: 540, y: 100, collected: false },
        { id: 7, x: 390, y: 50, collected: false },
        { id: 8, x: 240, y: 100, collected: false },
        { id: 9, x: 100, y: 150, collected: false },
        { id: 10, x: 350, y: 0, collected: false },
        { id: 11, x: 500, y: 0, collected: false },
        { id: 12, x: 650, y: 150, collected: false },
        { id: 13, x: 150, y: 0, collected: false },
        { id: 14, x: 600, y: 0, collected: false },
        { id: 15, x: 700, y: 0, collected: false },
      ],
      enemies: [
        { id: 1, x: 150, y: 380, width: 30, height: 20, direction: 1, speed: 4 },
        { id: 2, x: 280, y: 330, width: 30, height: 20, direction: -1, speed: 4 },
        { id: 3, x: 410, y: 280, width: 30, height: 20, direction: 1, speed: 4 },
        { id: 4, x: 540, y: 230, width: 30, height: 20, direction: -1, speed: 4 },
        { id: 5, x: 670, y: 180, width: 30, height: 20, direction: 1, speed: 4 },
        { id: 6, x: 300, y: 30, width: 30, height: 20, direction: -1, speed: 5 },
        { id: 7, x: 200, y: 130, width: 30, height: 20, direction: 1, speed: 4 },
        { id: 8, x: 400, y: 130, width: 30, height: 20, direction: -1, speed: 4 },
        { id: 9, x: 600, y: 130, width: 30, height: 20, direction: 1, speed: 4 },
        { id: 10, x: 100, y: 180, width: 30, height: 20, direction: -1, speed: 4 },
        { id: 11, x: 500, y: 30, width: 30, height: 20, direction: 1, speed: 5 },
      ],
      powerUps: [
        { id: 1, x: 400, y: 200, type: 'shield', collected: false },
      ],
      background: 'from-red-700 to-black',
      theme: 'finalBoss',
      name: 'Final Showdown',
    }
  ];
  
  const currentLevel = levels[level - 1];
  const [coins, setCoins] = useState(currentLevel.coins);
  const [enemies, setEnemies] = useState(currentLevel.enemies);
  const [levelPowerUps, setLevelPowerUps] = useState(currentLevel.powerUps);
  
  const gameAreaRef = useRef(null);
  
  const keysRef = useRef(keys);
  keysRef.current = keys;
  const playerRef = useRef(player);
  playerRef.current = player;
  const coinsRef = useRef(coins);
  coinsRef.current = coins;
  const enemiesRef = useRef(enemies);
  enemiesRef.current = enemies;
  const levelPowerUpsRef = useRef(levelPowerUps);
  levelPowerUpsRef.current = levelPowerUps;

  // Handle keyboard input (arrow keys and WASD)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setKeys(prev => ({ ...prev, left: true }));
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setKeys(prev => ({ ...prev, right: true }));
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setKeys(prev => ({ ...prev, up: true }));
      if (e.key === ' ' && gameOver) restartGame();
    };
    
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setKeys(prev => ({ ...prev, left: false }));
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setKeys(prev => ({ ...prev, right: false }));
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setKeys(prev => ({ ...prev, up: false }));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);
  
  // Create particle effect
  const createParticles = (x, y, color) => {
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: particleId.current++,
        x,
        y,
        size: Math.random() * 6 + 2,
        color,
        velocityX: (Math.random() - 0.5) * 6,
        velocityY: (Math.random() - 0.5) * 6,
        life: 30,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };
  
  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const gameLoop = setInterval(() => {
      // Update player position
      setPlayer(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newVelocityY = prev.velocityY + GRAVITY;
        let isJumping = true;
        let doubleJumpUsed = prev.doubleJumpUsed;
        
        // Apply speed boost if active
        const speed = prev.powerUp === 'speedBoost' ? PLAYER_SPEED * 1.5 : PLAYER_SPEED;
        
        // Horizontal movement
        if (keysRef.current.left) {
          newX = Math.max(0, prev.x - speed);
        }
        if (keysRef.current.right) {
          newX = Math.min(GAME_WIDTH - prev.width, prev.x + speed);
        }
        
        // Vertical movement
        newY += newVelocityY;
        
        // Boundary checks - falling death
        if (newY >= GAME_HEIGHT) {
          setLives(prevLives => {
            const newLives = prevLives - 1;
            if (newLives <= 0) {
              setGameOver(true);
            }
            return newLives;
          });
          
          // Reset player position
          return {
            ...prev,
            x: 50,
            y: 300,
            velocityY: 0,
            isJumping: false,
            doubleJumpUsed: false,
          };
        }
        
        // Platform collision
        let onPlatform = false;
        for (const platform of currentLevel.platforms) {
          if (
            newX + prev.width > platform.x &&
            newX < platform.x + platform.width &&
            prev.y + prev.height <= platform.y &&
            newY + prev.height >= platform.y &&
            newVelocityY > 0
          ) {
            newY = platform.y - prev.height;
            newVelocityY = 0;
            isJumping = false;
            doubleJumpUsed = false;
            onPlatform = true;
            break;
          }
        }
        
        // Jumping
        if (keysRef.current.up && !prev.isJumping && (onPlatform || newY >= GAME_HEIGHT - prev.height)) {
          newVelocityY = JUMP_FORCE;
          isJumping = true;
        } 
        // Double jump
        else if (keysRef.current.up && prev.powerUp === 'doubleJump' && !onPlatform && !prev.doubleJumpUsed) {
          newVelocityY = JUMP_FORCE;
          isJumping = true;
          doubleJumpUsed = true;
        }
        
        return {
          ...prev,
          x: newX,
          y: newY,
          velocityY: newVelocityY,
          isJumping,
          direction: keysRef.current.left ? 'left' : keysRef.current.right ? 'right' : prev.direction,
          doubleJumpUsed,
        };
      });
      
      // Update power-up timer
      setPlayer(prev => {
        if (prev.powerUp && prev.powerUpTimer > 0) {
          return { ...prev, powerUpTimer: prev.powerUpTimer - 1 };
        } else if (prev.powerUp) {
          return { ...prev, powerUp: null, powerUpTimer: 0 };
        }
        return prev;
      });
      
      // Check coin collection
      setCoins(prevCoins => {
        return prevCoins.map(coin => {
          if (!coin.collected) {
            const distance = Math.sqrt(
              Math.pow(playerRef.current.x + playerRef.current.width/2 - coin.x, 2) +
              Math.pow(playerRef.current.y + playerRef.current.height/2 - coin.y, 2)
            );
            if (distance < 30) {
              setScore(prev => prev + 100);
              createParticles(coin.x, coin.y, '#FBBF24');
              return { ...coin, collected: true };
            }
          }
          return coin;
        });
      });
      
      // Check power-up collection
      setLevelPowerUps(prevPowerUps => {
        return prevPowerUps.map(powerUp => {
          if (!powerUp.collected) {
            const distance = Math.sqrt(
              Math.pow(playerRef.current.x + playerRef.current.width/2 - powerUp.x, 2) +
              Math.pow(playerRef.current.y + playerRef.current.height/2 - powerUp.y, 2)
            );
            if (distance < 30) {
              setPlayer(prev => ({
                ...prev,
                powerUp: powerUp.type,
                powerUpTimer: 600, // 10 seconds at 60fps
              }));
              createParticles(powerUp.x, powerUp.y, 
                powerUp.type === 'doubleJump' ? '#3B82F6' : 
                powerUp.type === 'speedBoost' ? '#10B981' : '#8B5CF6'
              );
              return { ...powerUp, collected: true };
            }
          }
          return powerUp;
        });
      });
      
      // Move enemies
      setEnemies(prev => {
        return prev.map(enemy => {
          let newX = enemy.x + enemy.direction * enemy.speed;
          
          // Reverse direction at edges
          if (newX <= 0 || newX >= GAME_WIDTH - enemy.width) {
            return { ...enemy, direction: -enemy.direction };
          }
          
          return { ...enemy, x: newX };
        });
      });
      
      // Update particles
      setParticles(prev => {
        return prev
          .map(p => ({ ...p, x: p.x + p.velocityX, y: p.y + p.velocityY, size: p.size - 0.1, life: p.life - 1 }))
          .filter(p => p.size > 0 && p.life > 0);
      });
      
      // Check enemy collision
      enemiesRef.current.forEach(enemy => {
        if (
          playerRef.current.x < enemy.x + enemy.width &&
          playerRef.current.x + playerRef.current.width > enemy.x &&
          playerRef.current.y < enemy.y + enemy.height &&
          playerRef.current.y + playerRef.current.height > enemy.y
        ) {
          // Player hit by enemy
          if (playerRef.current.powerUp !== 'shield') {
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameOver(true);
              }
              return newLives;
            });
            
            // Create particles
            createParticles(playerRef.current.x + playerRef.current.width/2, playerRef.current.y + playerRef.current.height/2, '#EF4444');
            
            // Reset player position
            setPlayer(prev => ({
              ...prev,
              x: 50,
              y: 300,
              velocityY: 0,
              isJumping: false,
              doubleJumpUsed: false,
            }));
          } else {
            // Shield protects player
            createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#8B5CF6');
          }
        }
      });
      
      // Check win condition
      const allCoinsCollected = coinsRef.current.every(coin => coin.collected);
      if (allCoinsCollected) {
        if (level < levels.length) {
          // Move to next level
          setLevel(prev => prev + 1);
          setCoins(levels[level].coins);
          setEnemies(levels[level].enemies);
          setLevelPowerUps(levels[level].powerUps);
          setPlayer(prev => ({
            ...prev,
            x: 50,
            y: 300,
            velocityY: 0,
            isJumping: false,
            doubleJumpUsed: false,
            powerUp: null,
            powerUpTimer: 0,
          }));
        } else {
          // Game completed
          setGameOver(true);
        }
      }
    }, 1000 / 60); // ~60fps
    
    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, level]);
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLives(3);
    setLevel(1);
    setPlayer({
      x: 50,
      y: 300,
      width: 40,
      height: 40,
      velocityY: 0,
      isJumping: false,
      direction: 'right',
      powerUp: null,
      powerUpTimer: 0,
      doubleJumpUsed: false,
    });
    
    // Reset coins
    setCoins(levels[0].coins);
    setEnemies(levels[0].enemies);
    setLevelPowerUps(levels[0].powerUps);
    setParticles([]);
  };
  
  const restartGame = () => {
    startGame();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 mb-2">
            Ultimate Anime Platformer
          </h1>
          <p className="text-white/90 text-lg">Collect coins, avoid enemies, and complete all 15 levels!</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-black/30 p-4 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-xl flex items-center shadow-lg">
              <span className="font-bold text-white mr-2">SCORE:</span>
              <span className="text-2xl font-bold text-yellow-300">{score}</span>
            </div>
            
            <div className="bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 rounded-xl flex items-center shadow-lg">
              <span className="font-bold text-white mr-2">LIVES:</span>
              <div className="flex gap-1">
                {[...Array(lives)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-red-400 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 rounded-xl flex items-center shadow-lg">
              <span className="font-bold text-white mr-2">LEVEL:</span>
              <span className="text-2xl font-bold text-green-300">{level}/15</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            {!gameStarted ? (
              <button 
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
              >
                START GAME
              </button>
            ) : (
              <button 
                onClick={restartGame}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
              >
                RESTART
              </button>
            )}
          </div>
        </div>
        
        <div 
          ref={gameAreaRef}
          className={`relative bg-gradient-to-b ${currentLevel.background} rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl mx-auto`}
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Decorative elements based on theme */}
          {currentLevel.theme === 'forest' && (
            <>
              <div className="absolute top-10 left-20 w-24 h-12 bg-white/80 rounded-full"></div>
              <div className="absolute top-30 left-40 w-16 h-8 bg-white/80 rounded-full"></div>
              <div className="absolute top-20 right-40 w-20 h-10 bg-white/80 rounded-full"></div>
              <div className="absolute top-40 right-20 w-28 h-14 bg-white/80 rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-green-800/80 to-transparent"></div>
            </>
          )}
          
          {currentLevel.theme === 'space' && (
            <>
              <div className="absolute top-10 left-20 w-4 h-4 bg-yellow-300 rounded-full animate-pulse"></div>
              <div className="absolute top-30 left-40 w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-40 w-5 h-5 bg-purple-300 rounded-full animate-pulse"></div>
              <div className="absolute top-40 right-20 w-3 h-3 bg-pink-300 rounded-full animate-pulse"></div>
              <div className="absolute top-60 left-60 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-20 left-60 w-3 h-3 bg-cyan-300 rounded-full animate-pulse"></div>
            </>
          )}
          
          {currentLevel.theme === 'volcano' && (
            <>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-900/80 to-transparent"></div>
              <div className="absolute top-20 left-40 w-16 h-16 bg-orange-500/30 rounded-full blur-xl"></div>
              <div className="absolute top-40 right-40 w-20 h-20 bg-red-500/30 rounded-full blur-xl"></div>
            </>
          )}
          
          {currentLevel.theme === 'ice' && (
            <>
              <div className="absolute top-10 left-20 w-24 h-12 bg-white/40 rounded-full"></div>
              <div className="absolute top-30 left-40 w-16 h-8 bg-white/40 rounded-full"></div>
              <div className="absolute top-20 right-40 w-20 h-10 bg-white/40 rounded-full"></div>
              <div className="absolute top-40 right-20 w-28 h-14 bg-white/40 rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-blue-800/80 to-transparent"></div>
            </>
          )}
          
          {currentLevel.theme === 'candy' && (
            <>
              <div className="absolute top-10 left-20 w-12 h-12 bg-pink-300 rounded-full"></div>
              <div className="absolute top-30 left-40 w-8 h-8 bg-purple-300 rounded-full"></div>
              <div className="absolute top-20 right-40 w-10 h-10 bg-yellow-300 rounded-full"></div>
              <div className="absolute top-40 right-20 w-14 h-14 bg-blue-300 rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-purple-800/80 to-transparent"></div>
            </>
          )}
          
          {currentLevel.theme === 'desert' && (
            <>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-yellow-800/80 to-transparent"></div>
              <div className="absolute top-20 left-40 w-16 h-16 bg-orange-500/30 rounded-full blur-xl"></div>
              <div className="absolute top-40 right-40 w-20 h-20 bg-yellow-500/30 rounded-full blur-xl"></div>
            </>
          )}
          
          {currentLevel.theme === 'jungle' && (
            <>
              <div className="absolute top-10 left-20 w-24 h-12 bg-green-300/40 rounded-full"></div>
              <div className="absolute top-30 left-40 w-16 h-8 bg-green-300/40 rounded-full"></div>
              <div className="absolute top-20 right-40 w-20 h-10 bg-green-300/40 rounded-full"></div>
              <div className="absolute top-40 right-20 w-28 h-14 bg-green-300/40 rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-green-800/80 to-transparent"></div>
            </>
          )}
          
          {currentLevel.theme === 'castle' && (
            <>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-800/80 to-transparent"></div>
              <div className="absolute top-20 left-40 w-16 h-16 bg-gray-500/30 rounded-full blur-xl"></div>
              <div className="absolute top-40 right-40 w-20 h-20 bg-gray-500/30 rounded-full blur-xl"></div>
            </>
          )}
          
          {currentLevel.theme === 'underwater' && (
            <>
              <div className="absolute top-10 left-20 w-24 h-12 bg-blue-200/40 rounded-full"></div>
              <div className="absolute top-30 left-40 w-16 h-8 bg-blue-200/40 rounded-full"></div>
              <div className="absolute top-20 right-40 w-20 h-10 bg-blue-200/40 rounded-full"></div>
              <div className="absolute top-40 right-20 w-28 h-14 bg-blue-200/40 rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-blue-800/80 to-transparent"></div>
            </>
          )}
          
          {currentLevel.theme === 'clouds' && (
            <>
              <div className="absolute top-10 left-20 w-24 h-12 bg-white/40 rounded-full"></div>
              <div className="absolute top-30 left-40 w-16 h-8 bg-white/40 rounded-full"></div>
              <div className="absolute top-20 right-40 w-20 h-10 bg-white/40 rounded-full"></div>
              <div className="absolute top-40 right-20 w-28 h-14 bg-white/40 rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/80 to-transparent"></div>
            </>
          )}
          
          {currentLevel.theme === 'lava' && (
            <>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-900/80 to-transparent"></div>
              <div className="absolute top-20 left-40 w-16 h-16 bg-orange-500/30 rounded-full blur-xl"></div>
              <div className="absolute top-40 right-40 w-20 h-20 bg-red-500/30 rounded-full blur-xl"></div>
            </>
          )}
          
          {currentLevel.theme === 'mountains' && (
            <>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-800/80 to-transparent"></div>
              <div className="absolute top-20 left-40 w-16 h-16 bg-gray-500/30 rounded-full blur-xl"></div>
              <div className="absolute top-40 right-40 w-20 h-20 bg-gray-500/30 rounded-full blur-xl"></div>
            </>
          )}
          
          {currentLevel.theme === 'factory' && (
            <>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute top-20 left-40 w-16 h-16 bg-gray-600/30 rounded-full blur-xl"></div>
              <div className="absolute top-40 right-40 w-20 h-20 bg-gray-600/30 rounded-full blur-xl"></div>
            </>
          )}
          
          {currentLevel.theme === 'spaceStation' && (
            <>
              <div className="absolute top-10 left-20 w-4 h-4 bg-purple-300 rounded-full animate-pulse"></div>
              <div className="absolute top-30 left-40 w-3 h-3 bg-indigo-300 rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-40 w-5 h-5 bg-blue-300 rounded-full animate-pulse"></div>
              <div className="absolute top-40 right-20 w-3 h-3 bg-pink-300 rounded-full animate-pulse"></div>
              <div className="absolute top-60 left-60 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-20 left-60 w-3 h-3 bg-cyan-300 rounded-full animate-pulse"></div>
            </>
          )}
          
          {currentLevel.theme === 'finalBoss' && (
            <>
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute top-20 left-40 w-16 h-16 bg-red-500/30 rounded-full blur-xl"></div>
              <div className="absolute top-40 right-40 w-20 h-20 bg-red-500/30 rounded-full blur-xl"></div>
            </>
          )}
          
          {/* Level title */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full">
            <p className="text-white font-bold text-sm">{currentLevel.name}</p>
          </div>
          
          {/* Power-up indicator */}
          {player.powerUp && (
            <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                player.powerUp === 'doubleJump' ? 'bg-blue-500' : 
                player.powerUp === 'speedBoost' ? 'bg-green-500' : 'bg-purple-500'
              }`}></div>
              <span className="text-white text-sm">
                {player.powerUp === 'doubleJump' ? 'Double Jump' : 
                 player.powerUp === 'speedBoost' ? 'Speed Boost' : 'Shield'}
              </span>
              <span className="text-white text-sm ml-2">({Math.ceil(player.powerUpTimer / 60)}s)</span>
            </div>
          )}
          
          {/* Platforms */}
          {currentLevel.platforms.map((platform, index) => (
            <div 
              key={index}
              className={`absolute bg-gradient-to-b ${platform.color} border-t-4 border-white/30 rounded-lg shadow-xl`}
              style={{
                left: platform.x,
                top: platform.y,
                width: platform.width,
                height: platform.height,
              }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20 rounded-t-lg"></div>
            </div>
          ))}
          
          {/* Coins */}
          {coins.map(coin => !coin.collected && (
            <div 
              key={coin.id}
              className="absolute w-8 h-8 animate-bounce"
              style={{
                left: coin.x - 16,
                top: coin.y - 16,
                animationDuration: '1s',
                animationDelay: `${coin.id * 0.1}s`,
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border-2 border-yellow-600 flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-yellow-200 rounded-full"></div>
              </div>
            </div>
          ))}
          
          {/* Power-ups */}
          {levelPowerUps.map(powerUp => !powerUp.collected && (
            <div 
              key={powerUp.id}
              className="absolute w-10 h-10 animate-pulse"
              style={{
                left: powerUp.x - 20,
                top: powerUp.y - 20,
              }}
            >
              <div className={`w-full h-full rounded-full border-2 flex items-center justify-center shadow-lg ${
                powerUp.type === 'doubleJump' ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-700' : 
                powerUp.type === 'speedBoost' ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-700' : 
                'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-700'
              }`}>
                <div className={`w-5 h-5 rounded-full ${
                  powerUp.type === 'doubleJump' ? 'bg-blue-200' : 
                  powerUp.type === 'speedBoost' ? 'bg-green-200' : 'bg-purple-200'
                }`}></div>
              </div>
            </div>
          ))}
          
          {/* Enemies */}
          {enemies.map(enemy => (
            <div 
              key={enemy.id}
              className="absolute bg-gradient-to-b from-red-500 to-red-700 rounded-lg shadow-lg flex items-center justify-center"
              style={{
                left: enemy.x,
                top: enemy.y,
                width: enemy.width,
                height: enemy.height,
              }}
            >
              <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
          ))}
          
          {/* Player */}
          <div 
            className={`absolute bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-xl ${player.isJumping ? 'animate-pulse' : ''}`}
            style={{
              left: player.x,
              top: player.y,
              width: player.width,
              height: player.height,
              transform: player.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
            }}
          >
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          </div>
          
          {/* Particles */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                opacity: particle.size / 10,
              }}
            />
          ))}
          
          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-3xl text-center max-w-md border-2 border-white/20 shadow-2xl">
                <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-red-500">
                  {coins.every(coin => coin.collected) && level === levels.length ? 'VICTORY!' : 'GAME OVER!'}
                </h2>
                <p className="text-2xl mb-2 text-white">Final Score: <span className="font-bold text-yellow-300">{score}</span></p>
                <p className="mb-6 text-white/80">
                  {coins.every(coin => coin.collected) && level === levels.length 
                    ? 'You completed all 15 levels! Amazing!' 
                    : 'Press SPACE or click Restart to try again'}
                </p>
                <button 
                  onClick={restartGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  PLAY AGAIN
                </button>
              </div>
            </div>
          )}
          
          {/* Start Screen */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-3xl text-center max-w-md border-2 border-white/20 shadow-2xl">
                <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-red-500">
                  ULTIMATE PLATFORMER
                </h2>
                <p className="mb-2 text-white">Use arrow keys or WASD to move and jump</p>
                <div className="flex justify-center gap-4 my-4">
                  <div className="bg-gray-800 px-3 py-1 rounded-md text-white">← → or A D</div>
                  <div className="bg-gray-800 px-3 py-1 rounded-md text-white">↑ or W</div>
                </div>
                <p className="mb-6 text-white/80">Collect all coins and avoid enemies to advance!</p>
                <button 
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  START GAME
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-white/80">
          <p className="mb-2">Controls: Arrow keys or WASD to move and jump</p>
          <p>Complete all 15 levels by collecting all coins while avoiding enemies!</p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-white/70 max-w-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-black/20 p-3 rounded-xl">
            <h3 className="font-bold text-yellow-300">15 Levels</h3>
            <p className="text-sm">Each with unique challenges</p>
          </div>
          <div className="bg-black/20 p-3 rounded-xl">
            <h3 className="font-bold text-green-300">3 Power-ups</h3>
            <p className="text-sm">Double jump, speed boost, shield</p>
          </div>
          <div className="bg-black/20 p-3 rounded-xl">
            <h3 className="font-bold text-blue-300">Falling Death</h3>
            <p className="text-sm">Don't fall off platforms!</p>
          </div>
          <div className="bg-black/20 p-3 rounded-xl">
            <h3 className="font-bold text-purple-300">Addictive Gameplay</h3>
            <p className="text-sm">Progressive difficulty</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformerGame;
