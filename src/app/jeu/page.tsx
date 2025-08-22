
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";


// --- Game Configuration ---
const GAME_CONFIG = {
    CHAR_WIDTH: 80,
    CHAR_HEIGHT: 100,
    GAME_DURATION: 60, // seconds
    MAX_SPEED: 30, // m/s
    TENSION_DECAY_RATE: 15, // points per second
    TENSION_CLICK_INCREASE: 10, // points per click/press
    OBSTACLE_MIN_SIZE: 40,
    OBSTACLE_MAX_SIZE: 80,
    ROAD_WIDTH_RATIO: 0.7, // 70% of the background image width
    COLLISION_HITBOX_SCALE: 0.8, // 80% of the sprite size
    SCROLL_SPEED_MULTIPLIER: 30,
    OBSTACLE_SPAWN_MIN_Y: 170,
    OBSTACLE_SPAWN_RANDOM_Y: 350,
    MAX_DELTA_TIME: 0.1, // max time between frames to avoid jumps
};


// --- Composants d'interface ---

const Hud = ({ distance, speed, time }: { distance: number, speed: number, time: number }) => (
  <div className="w-full flex justify-between items-start gap-1 text-white font-headline">
    <div className="flex w-2/3 justify-around items-start gap-1">
        <div className="w-1/2 flex flex-col items-center bg-black/50 p-1 rounded-lg min-w-0">
        <div className="text-xl sm:text-3xl truncate">{Math.floor(distance)}</div>
        <div className="text-xs opacity-80">Mètres</div>
        </div>
        <div className="w-1/2 flex flex-col items-center bg-black/50 p-1 rounded-lg min-w-0">
        <div className="text-xl sm:text-3xl truncate">{Math.round(speed * 3.6)}</div>
        <div className="text-xs opacity-80">km/h</div>
        </div>
    </div>
     <div className="w-1/3 flex flex-col items-center bg-black/50 p-1 rounded-lg min-w-0">
      <div className="text-xl sm:text-3xl truncate">{Math.max(0, time).toFixed(1)}</div>
      <div className="text-xs opacity-80">Temps</div>
    </div>
  </div>
);

const Overlay = ({ children, isVisible }: { children: React.ReactNode, isVisible: boolean }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {children}
            </motion.div>
        )}
    </AnimatePresence>
);

const StartScreen = ({ onStart }: { onStart: () => void }) => (
    <div className="text-center text-white p-4 font-body">
        <Image src="/gameimg/logo.png" alt="Logo" width={120} height={120} className="mx-auto" />
        <h1 className="font-headline text-6xl mt-4 text-accent">Défi du Pilote</h1>
        <p className="text-2xl mt-2">Évitez les rochers et parcourez la plus grande distance en {GAME_CONFIG.GAME_DURATION} secondes !</p>
        
<p className="text-lg mt-4 max-w-md mx-auto">
          <span className="hidden sm:inline">
            Déplacez-vous avec la <span className="font-bold text-accent">souris</span>. 
            Augmentez la vitesse en <span className="font-bold text-accent">cliquant</span> !
          </span>
          <span className="sm:hidden">
            <span className="font-bold text-accent">Touchez</span> l'écran pour vous déplacer et <span className="font-bold text-accent">tappotez</span> pour accélérer !
          </span>
        </p>
        <Button onClick={onStart} size="lg" className="mt-8 bg-accent text-accent-foreground text-2xl font-headline hover:bg-white">LANCEZ-VOUS !</Button>
    </div>
);

const CountdownScreen = ({ count }: { count: number | string }) => (
    <motion.div
        key={count}
        className="font-headline text-9xl text-accent"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
        {count}
    </motion.div>
);

const EndScreen = ({ distance, onRestart }: { distance: number, onRestart: () => void }) => {
    const getResult = () => {
        const d = Math.floor(distance);
        if (d >= 1500) return { title: "Permis Légende du Vent", message: "Votre maîtrise est inégalée. Le vent lui-même s'incline.", icon: "🏆" };
        if (d >= 1000) return { title: "Permis As du Virage", message: "Vitesse et précision, vous êtes un vrai pro de la glisse !", icon: "🥇" };
        if (d >= 500) return { title: "Permis Pilote des Sables", message: "Belle performance ! La plage de Denneville n'a plus de secrets pour vous.", icon: "🥈" };
        return { title: "Permis Débutant Prudent", message: "Un bon début ! Chaque grand pilote a commencé par un premier grain de sable.", icon: "🥉" };
    };
    const result = getResult();

    return (
        <div className="text-center text-white p-6 bg-primary rounded-2xl shadow-2xl max-w-sm mx-auto font-body">
            <div className="text-6xl">{result.icon}</div>
            <h2 className="font-headline text-5xl mt-2">Temps Écoulé !</h2>
            <p className="text-3xl mt-4">Distance: <span className="font-bold text-accent">{Math.floor(distance)}m</span></p>
            <div className="mt-6 p-4 border-2 border-dashed border-accent rounded-lg">
                <p className="text-xl">Vous avez obtenu le</p>
                <p className="text-2xl font-headline text-accent mt-1">{result.title}</p>
                <p className="text-lg mt-2 text-white/80">"{result.message}"</p>
            </div>
            
<div className="mt-8 flex justify-center gap-4">
                <Button 
                    onClick={onRestart} 
                    size="lg" 
                    className="transition-transform duration-300 hover:rotate-3 hover:scale-150"
                >
                    ↻ Nouvelle Course
                </Button>
                <Button 
                    asChild 
                    size="lg" 
                    className="transition-transform duration-300 hover:-rotate-3 hover:scale-150"
                >
                    <Link href="/">Quitter</Link>
                </Button>
            </div>
        </div>
    );
};


// --- Page principale du jeu ---

type Obstacle = {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'rock';
};

export default function GamePage() {
    const [gameState, setGameState] = useState<'start' | 'countdown' | 'playing' | 'end'>('start');
    const [countdown, setCountdown] = useState<number | string>(3);
    const [gameData, setGameData] = useState({ distance: 0, speed: 0, tension: 0, time: GAME_CONFIG.GAME_DURATION });
    const [hudStyle, setHudStyle] = useState({ width: '100%', left: '0px' });
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<{
        char: HTMLImageElement | null;
        background: HTMLImageElement | null;
        rock: HTMLImageElement | null;
    }>({ char: null, background: null, rock: null });
    
    const gameLoopRef = useRef<number>();
    const physicsRef = useRef({
      progress: 0,
      charX: 0,
      charY: 0,
      speed: 0,
      tension: 0, // 0 to 100
      targetX: 0,
      obstacles: [] as Obstacle[],
      nextObstacleY: 400,
      timeRemaining: GAME_CONFIG.GAME_DURATION,
    });

    const resetGame = useCallback(() => {
        setGameState('start');
        setGameData({ distance: 0, speed: 0, tension: 0, time: GAME_CONFIG.GAME_DURATION });
        const canvas = canvasRef.current;
        if(canvas) {
            const dpr = window.devicePixelRatio || 1;
            const canvasWidth = canvas.width / dpr;
            physicsRef.current = {
                ...physicsRef.current,
                progress: 0,
                speed: 0,
                tension: 0,
                targetX: canvasWidth / 2,
                charX: canvasWidth / 2,
                charY: canvas.height / dpr * 0.8,
                obstacles: [],
                nextObstacleY: 400,
                timeRemaining: GAME_CONFIG.GAME_DURATION,
            };
        }
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }, []);

    const startGame = () => {
        setGameState('countdown');
        let count = 3;
        setCountdown(3);
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                setCountdown(count);
            } else if (count === 0) {
                setCountdown('GO!');
            } else {
                clearInterval(countdownInterval);
                setGameState('playing');
            }
        }, 1000);
    };

    const endGame = useCallback(() => {
        if(gameState === 'end') return;
        setGameState('end');
        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }, [gameState]);

    const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const p = physicsRef.current;
        const canvasWidthForDraw = canvas.width / dpr;
        const canvasHeightForDraw = canvas.height / dpr;
        
        const { char: charImg, background: backgroundImg, rock: rockImg } = imagesRef.current;

        // --- Draw Background ---
        if (backgroundImg?.complete && backgroundImg.naturalWidth > 0) {
            const imgW = backgroundImg.width;
            const imgH = backgroundImg.height;
            const bgX = (canvasWidthForDraw - imgW) / 2;
           
            const yOffset = Math.floor(p.progress % imgH);

            ctx.drawImage(backgroundImg, bgX, yOffset - imgH +1, imgW, imgH);
            ctx.drawImage(backgroundImg, bgX, yOffset, imgW, imgH);
        }

        // --- Draw Obstacles ---
        if (rockImg?.complete && rockImg.naturalWidth > 0) {
            p.obstacles.forEach(obs => {
                const obsScreenY = canvasHeightForDraw - (obs.y - p.progress);
                ctx.drawImage(rockImg, obs.x, obsScreenY, obs.width, obs.height);
            });
        }
        
// --- Draw Char & Sail ---
if (charImg?.complete && charImg.naturalWidth > 0) {
    ctx.save();
    ctx.translate(p.charX, p.charY);
    
    // --- Dessiner le corps du char ---
    ctx.drawImage(charImg, -GAME_CONFIG.CHAR_WIDTH / 2, -GAME_CONFIG.CHAR_HEIGHT / 2, GAME_CONFIG.CHAR_WIDTH, GAME_CONFIG.CHAR_HEIGHT);

    // --- Configuration de la voile ---
    const sailTension = Math.max(0.1, p.tension / 100); // Minimum 0.1 pour toujours afficher la voile

    // Configuration de la voile - toujours dessinée
    const mastX = 0;
    const mastTopY = -GAME_CONFIG.CHAR_HEIGHT * 0.25;
    const mastBottomY = -GAME_CONFIG.CHAR_HEIGHT * -0.25;
    const mastHeight = mastBottomY - mastTopY;
    
    // Gonflement et largeur de la voile améliorés
    const sailBulge = 20 * sailTension;
    const sailWidth = 15 * sailTension;
    
    // Légère inclinaison de la voile (en degrés)
    const sailAngle = 8 * (Math.PI / 180);
    
    // --- Dessiner la voile (forme améliorée) ---
    ctx.fillStyle = '#FFD700'; // Jaune or
    ctx.strokeStyle = '#DAA520'; // Bordure dorée plus foncée
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    
    // Point en haut du mât
    const topX = mastX;
    const topY = mastTopY;
    
    // Points de la voile avec inclinaison
    const midX = mastX - sailBulge - sailWidth * Math.cos(sailAngle);
    const midY = (mastTopY + mastBottomY) / 2 + sailWidth * Math.sin(sailAngle);
    
    const bottomX = mastX - sailWidth * 0.3 * Math.cos(sailAngle);
    const bottomY = mastBottomY + sailWidth * 0.3 * Math.sin(sailAngle);
    
    // Tracer la voile avec une forme plus réaliste
    ctx.moveTo(topX, topY);
    
    // Courbe supérieure (gonflement vers l'extérieur)
    ctx.quadraticCurveTo(
        midX,                    // Point de contrôle X
        topY + mastHeight * 0.2, // Point de contrôle Y (plus proche du haut)
        midX,                    // Point final X
        midY                     // Point final Y (milieu)
    );
    
    // Courbe inférieure (retour vers le mât)
    ctx.quadraticCurveTo(
        midX * 0.7,              // Point de contrôle X (moins prononcé)
        bottomY - mastHeight * 0.1, // Point de contrôle Y
        bottomX,                 // Point final X
        bottomY                  // Point final Y
    );
    
    // Ligne de retour vers le haut du mât
    ctx.lineTo(topX, topY);
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // --- Ajouter des détails à la voile ---
    // Lignes de couture pour plus de réalisme
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1;
    
    // Ligne de couture horizontale au milieu
    ctx.beginPath();
    ctx.moveTo(mastX, midY);
    ctx.quadraticCurveTo(midX * 0.8, midY, midX * 0.9, midY);
    ctx.stroke();

    ctx.restore();
}
    }, []);
    
    useEffect(() => {
        if (gameState !== 'playing') return;

        let lastTime = 0;
        const gameLoop = (timestamp: number) => {
            if (!lastTime) lastTime = timestamp;
            const deltaTime = Math.min((timestamp - lastTime) / 1000, GAME_CONFIG.MAX_DELTA_TIME);
            lastTime = timestamp;

            const p = physicsRef.current;
            const canvas = canvasRef.current;
            const backgroundImg = imagesRef.current.background;
            if (!canvas || !backgroundImg || !backgroundImg.complete || backgroundImg.naturalWidth === 0) {
                gameLoopRef.current = requestAnimationFrame(gameLoop);
                return;
            };

            const dpr = window.devicePixelRatio || 1;
            const canvasWidth = canvas.width / dpr;
            const canvasHeightForDraw = canvas.height / dpr;
            
            const roadWidth = backgroundImg.width * GAME_CONFIG.ROAD_WIDTH_RATIO; 
            const bgX = (canvasWidth - backgroundImg.width) / 2;
            const roadLeftEdge = bgX + (backgroundImg.width - roadWidth)/2;
            const roadRightEdge = roadLeftEdge + roadWidth;
            
            // --- Timer ---
            p.timeRemaining = Math.max(0, p.timeRemaining - deltaTime);
            if (p.timeRemaining <= 0) {
                endGame();
                return;
            }

            // --- Tension & Speed ---
            p.tension = Math.max(0, p.tension - (GAME_CONFIG.TENSION_DECAY_RATE * deltaTime)); 
            p.speed = (p.tension / 100) * GAME_CONFIG.MAX_SPEED;
            p.progress += p.speed * GAME_CONFIG.SCROLL_SPEED_MULTIPLIER * deltaTime;


            // --- Obstacle Management ---
            if (p.progress > p.nextObstacleY) {
                const rockSize = GAME_CONFIG.OBSTACLE_MIN_SIZE + Math.random() * (GAME_CONFIG.OBSTACLE_MAX_SIZE - GAME_CONFIG.OBSTACLE_MIN_SIZE);
                p.obstacles.push({
                    id: Date.now(),
                    width: rockSize,
                    height: rockSize,
                    x: roadLeftEdge + Math.random() * (roadWidth - rockSize),
                    y: p.progress + canvasHeightForDraw, 
                    type: 'rock'
                });
                p.nextObstacleY += GAME_CONFIG.OBSTACLE_SPAWN_MIN_Y + Math.random() * GAME_CONFIG.OBSTACLE_SPAWN_RANDOM_Y;
            }

            // Remove off-screen elements
            p.obstacles = p.obstacles.filter(obs => obs.y + obs.height > p.progress);

            // --- Position Update ---
            const followSpeed = 0.1;
            p.charX += (p.targetX - p.charX) * followSpeed;
            p.charX = Math.max(roadLeftEdge, Math.min(roadRightEdge - GAME_CONFIG.CHAR_WIDTH, p.charX));
            p.targetX = Math.max(roadLeftEdge, Math.min(roadRightEdge, p.targetX));


            // --- Collision Detection ---
            for (const obs of p.obstacles) {
                const obsScreenY = canvasHeightForDraw - (obs.y - p.progress);
                
                const scale = GAME_CONFIG.COLLISION_HITBOX_SCALE;
                const charHitbox = {
                    x: p.charX - (GAME_CONFIG.CHAR_WIDTH * scale / 2),
                    y: p.charY - (GAME_CONFIG.CHAR_HEIGHT * scale / 2),
                    width: GAME_CONFIG.CHAR_WIDTH * scale,
                    height: GAME_CONFIG.CHAR_HEIGHT * scale,
                };
                const obsHitbox = {
                    x: obs.x,
                    y: obsScreenY,
                    width: obs.width * scale,
                    height: obs.height * scale,
                };

                if (
                    charHitbox.x < obsHitbox.x + obsHitbox.width &&
                    charHitbox.x + charHitbox.width > obsHitbox.x &&
                    charHitbox.y < obsHitbox.y + obsHitbox.height &&
                    charHitbox.y + charHitbox.height > obsHitbox.y
                ) {
                    endGame();
                    return; 
                }
            }
            
            setGameData({
                distance: p.progress / 10,
                speed: p.speed,
                tension: p.tension,
                time: p.timeRemaining,
            });

            const ctx = canvas?.getContext('2d');
            if (ctx) {
                draw(ctx, canvas);
            }
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        
        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        };
    }, [gameState, draw, endGame]);

    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        let isMounted = true;

        const resizeCanvas = () => {
            const container = canvas.parentElement as HTMLElement;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            
            const ctx = canvas.getContext('2d');
            if(ctx) {
                ctx.scale(dpr, dpr);
            }
            
            physicsRef.current.targetX = rect.width / 2;
            physicsRef.current.charX = rect.width / 2;
            physicsRef.current.charY = rect.height * 0.8;

            const backgroundImg = imagesRef.current.background;
            if (backgroundImg?.complete && backgroundImg.naturalWidth > 0) {
                const imgW = backgroundImg.width;
                const bgX = (rect.width - imgW) / 2;
                setHudStyle({ width: `${imgW}px`, left: `${bgX}px` });
            }


            if(ctx && gameState !== 'playing') {
                draw(ctx, canvas);
            }
        };

        const onImageLoad = () => {
           if(isMounted) resizeCanvas();
        }

        const handleImageError = (type: string) => () => {
            if (isMounted) console.error(`Erreur de chargement pour l'image : ${type}`);
        };

        imagesRef.current.char = new window.Image();
        imagesRef.current.char.src = '/gameimg/char.png';
        imagesRef.current.char.onload = onImageLoad;
        imagesRef.current.char.onerror = handleImageError('char');

        imagesRef.current.background = new window.Image();
        imagesRef.current.background.src = '/gameimg/plage.png';
        imagesRef.current.background.onload = onImageLoad;
        imagesRef.current.background.onerror = handleImageError('background');

        imagesRef.current.rock = new window.Image();
        imagesRef.current.rock.src = '/gameimg/rocher.png';
        imagesRef.current.rock.onload = onImageLoad;
        imagesRef.current.rock.onerror = handleImageError('rock');


        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            isMounted = false;
            window.removeEventListener('resize', resizeCanvas);
            // Nettoyer les références pour éviter les fuites mémoire
            imagesRef.current = { char: null, background: null, rock: null };
        };
    }, [draw, gameState]);

    const handleMouseMove = (x: number) => {
        if (gameState !== 'playing' || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        physicsRef.current.targetX = x - rect.left;
    };

    const increaseTension = useCallback(() => {
        if(gameState !== 'playing') return;
        physicsRef.current.tension = Math.min(100, physicsRef.current.tension + GAME_CONFIG.TENSION_CLICK_INCREASE);
    }, [gameState]);


    return (
        <div className="flex flex-col h-screen bg-background text-foreground font-body select-none">
            
            <main 
                className="flex-grow relative overflow-hidden bg-blue-400" 
                onMouseMove={(e) => handleMouseMove(e.clientX)}
                onTouchMove={(e) => handleMouseMove(e.touches[0].clientX)}
                onClick={increaseTension}
                onContextMenu={(e) => e.preventDefault()}
            >
                <canvas ref={canvasRef} id="game" className="absolute inset-0 w-full h-full" />
                
                <AnimatePresence>
                {gameState === 'playing' && (
                    <motion.div 
                        className="absolute top-2 sm:top-4 z-20 pointer-events-none"
                        style={hudStyle}
                        initial={{opacity:0}} 
                        animate={{opacity:1}} 
                        exit={{opacity:0}}
                    >
                        <Hud distance={gameData.distance} speed={gameData.speed} time={gameData.time} />
                    </motion.div>
                )}
                </AnimatePresence>
                
                <Overlay isVisible={gameState === 'start'}>
                    <StartScreen onStart={startGame} />
                </Overlay>

                <Overlay isVisible={gameState === 'countdown'}>
                    <CountdownScreen count={countdown} />
                </Overlay>
                
                <Overlay isVisible={gameState === 'end'}>
                    <EndScreen distance={gameData.distance} onRestart={resetGame} />
                </Overlay>
            </main>
        </div>
    );
}
