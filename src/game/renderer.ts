import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_HEIGHT,
  PIPE_WIDTH,
  PIPE_COLLAR_WIDTH,
  PIPE_COLLAR_HEIGHT,
  THEME_CONFIG,
  BIRD_SKINS,
} from './constants';
import { BirdSkin, Cloud, Particle, PipePair, ThemeMode } from './types';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public clear() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  /**
   * Draw atmospheric gradient sky, distant city skyline, and trees
   */
  public drawBackground(theme: ThemeMode, clouds: Cloud[], skylineOffset: number) {
    const ctx = this.ctx;
    const config = THEME_CONFIG[theme];

    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT - GROUND_HEIGHT);
    skyGrad.addColorStop(0, config.skyTop);
    skyGrad.addColorStop(1, config.skyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_HEIGHT);

    // Night stars or sun
    if (theme === 'NIGHT') {
      ctx.fillStyle = '#ffffff';
      // Deterministic decorative stars
      const stars = [
        { x: 30, y: 40, r: 1.2 },
        { x: 80, y: 70, r: 1.5 },
        { x: 150, y: 35, r: 1 },
        { x: 220, y: 90, r: 1.6 },
        { x: 290, y: 50, r: 1.2 },
        { x: 330, y: 110, r: 1.4 },
        { x: 110, y: 130, r: 1 },
        { x: 190, y: 150, r: 1.3 },
      ];
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crescent moon
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(300, 70, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = config.skyTop;
      ctx.beginPath();
      ctx.arc(293, 67, 14, 0, Math.PI * 2);
      ctx.fill();
    } else if (theme === 'SUNSET') {
      // Golden glowing sun
      const sunGrad = ctx.createRadialGradient(280, 180, 5, 280, 180, 45);
      sunGrad.addColorStop(0, 'rgba(255, 240, 200, 0.9)');
      sunGrad.addColorStop(0.5, 'rgba(255, 180, 80, 0.4)');
      sunGrad.addColorStop(1, 'rgba(255, 100, 50, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(280, 180, 45, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Parallax Clouds
    for (const cloud of clouds) {
      this.drawCloud(cloud.x, cloud.y, cloud.scale, config.cloudColor);
    }

    // 3. Parallax Skyline (Distant & Near buildings)
    this.drawSkyline(config.cityFar, config.cityNear, config.treeColor, skylineOffset);
  }

  private drawCloud(x: number, y: number, scale: number, color: string) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.arc(20, 20, 18, 0, Math.PI * 2);
    ctx.arc(42, 12, 22, 0, Math.PI * 2);
    ctx.arc(68, 16, 20, 0, Math.PI * 2);
    ctx.arc(86, 22, 16, 0, Math.PI * 2);
    ctx.rect(18, 22, 70, 16);
    ctx.fill();

    ctx.restore();
  }

  private drawSkyline(colorFar: string, colorNear: string, treeColor: string, offset: number) {
    const ctx = this.ctx;
    const baseLine = CANVAS_HEIGHT - GROUND_HEIGHT;

    // Distant skyline buildings (slow scroll)
    ctx.fillStyle = colorFar;
    const distantBuildings = [
      { w: 35, h: 90 }, { w: 45, h: 120 }, { w: 30, h: 70 },
      { w: 50, h: 140 }, { w: 40, h: 100 }, { w: 55, h: 80 },
      { w: 35, h: 130 }, { w: 45, h: 95 }, { w: 60, h: 110 },
    ];
    let curX = -((offset * 0.25) % 395);
    while (curX < CANVAS_WIDTH + 60) {
      for (const b of distantBuildings) {
        ctx.fillRect(curX, baseLine - b.h, b.w, b.h);
        // Small windows
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let wy = baseLine - b.h + 12; wy < baseLine - 10; wy += 18) {
          ctx.fillRect(curX + 6, wy, b.w - 12, 6);
        }
        ctx.fillStyle = colorFar;
        curX += b.w + 4;
      }
    }

    // Near skyline & silhouettes (medium scroll)
    ctx.fillStyle = colorNear;
    const nearBuildings = [
      { w: 30, h: 65 }, { w: 40, h: 85 }, { w: 25, h: 50 },
      { w: 45, h: 90 }, { w: 35, h: 60 }, { w: 50, h: 75 },
    ];
    curX = -((offset * 0.5) % 225);
    while (curX < CANVAS_WIDTH + 60) {
      for (const b of nearBuildings) {
        ctx.fillRect(curX, baseLine - b.h, b.w, b.h);
        curX += b.w + 6;
      }
    }

    // Tree silhouettes along the base
    ctx.fillStyle = treeColor;
    curX = -((offset * 0.8) % 60);
    while (curX < CANVAS_WIDTH + 60) {
      ctx.beginPath();
      ctx.arc(curX + 15, baseLine - 12, 14, 0, Math.PI * 2);
      ctx.arc(curX + 35, baseLine - 15, 18, 0, Math.PI * 2);
      ctx.arc(curX + 55, baseLine - 12, 14, 0, Math.PI * 2);
      ctx.fill();
      curX += 60;
    }
  }

  /**
   * Draw the authentic green Flappy Bird pipes with collar rims and 3D cylindrical lighting
   */
  public drawPipes(pipes: PipePair[], theme: ThemeMode) {
    const ctx = this.ctx;
    const { pipeBody } = THEME_CONFIG[theme];

    for (const pipe of pipes) {
      const topCollarY = pipe.topHeight - PIPE_COLLAR_HEIGHT;
      const bottomCollarY = CANVAS_HEIGHT - GROUND_HEIGHT - pipe.bottomHeight;

      // --- 1. TOP PIPE SHAFT ---
      this.drawPipeShaft(pipe.x, 0, PIPE_WIDTH, pipe.topHeight - PIPE_COLLAR_HEIGHT, pipeBody);

      // --- 2. TOP PIPE COLLAR (RIM) ---
      const collarOffset = (PIPE_COLLAR_WIDTH - PIPE_WIDTH) / 2;
      this.drawPipeCollar(pipe.x - collarOffset, topCollarY, PIPE_COLLAR_WIDTH, PIPE_COLLAR_HEIGHT, pipeBody);

      // --- 3. BOTTOM PIPE COLLAR (RIM) ---
      this.drawPipeCollar(pipe.x - collarOffset, bottomCollarY, PIPE_COLLAR_WIDTH, PIPE_COLLAR_HEIGHT, pipeBody);

      // --- 4. BOTTOM PIPE SHAFT ---
      const shaftY = bottomCollarY + PIPE_COLLAR_HEIGHT;
      const shaftHeight = (CANVAS_HEIGHT - GROUND_HEIGHT) - shaftY;
      this.drawPipeShaft(pipe.x, shaftY, PIPE_WIDTH, shaftHeight, pipeBody);
    }
  }

  private drawPipeShaft(
    x: number,
    y: number,
    w: number,
    h: number,
    colors: { light: string; mid: string; dark: string; border: string; highlight: string }
  ) {
    if (h <= 0) return;
    const ctx = this.ctx;

    // Body base
    ctx.fillStyle = colors.mid;
    ctx.fillRect(x, y, w, h);

    // Left dark inner edge
    ctx.fillStyle = colors.dark;
    ctx.fillRect(x + 2, y, 6, h);

    // Main highlight stripe
    ctx.fillStyle = colors.highlight;
    ctx.fillRect(x + 10, y, 8, h);

    // Right dark shading
    ctx.fillStyle = colors.dark;
    ctx.fillRect(x + w - 12, y, 10, h);

    // Outer pixel border
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x, y, w, h);
  }

  private drawPipeCollar(
    x: number,
    y: number,
    w: number,
    h: number,
    colors: { light: string; mid: string; dark: string; border: string; highlight: string }
  ) {
    const ctx = this.ctx;

    // Collar body
    ctx.fillStyle = colors.light;
    ctx.fillRect(x, y, w, h);

    // Left shadow
    ctx.fillStyle = colors.dark;
    ctx.fillRect(x + 3, y, 6, h);

    // Highlight band
    ctx.fillStyle = colors.highlight;
    ctx.fillRect(x + 12, y, 10, h);

    // Right shadow
    ctx.fillStyle = colors.dark;
    ctx.fillRect(x + w - 14, y, 11, h);

    // Border
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x, y, w, h);
  }

  /**
   * Draw scrolling ground with authentic grass rim, angled stripes, and dirt soil
   */
  public drawGround(groundOffset: number, theme: ThemeMode) {
    const ctx = this.ctx;
    const { ground } = THEME_CONFIG[theme];
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;

    // 1. Soil base
    ctx.fillStyle = ground.soil;
    ctx.fillRect(0, groundY, CANVAS_WIDTH, GROUND_HEIGHT);

    // 2. Soil texture pebbles
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let x = 10; x < CANVAS_WIDTH; x += 35) {
      ctx.fillRect(x, groundY + 30, 4, 3);
      ctx.fillRect(x + 18, groundY + 55, 5, 3);
      ctx.fillRect(x + 8, groundY + 75, 3, 2);
    }

    // 3. Top green grass rim
    ctx.fillStyle = ground.top;
    ctx.fillRect(0, groundY, CANVAS_WIDTH, 14);

    // 4. Striped angled grass pattern
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, groundY, CANVAS_WIDTH, 14);
    ctx.clip();

    ctx.fillStyle = ground.stripe1;
    const stripeWidth = 14;
    const effectiveOffset = groundOffset % (stripeWidth * 2);

    for (let x = -stripeWidth * 2 - effectiveOffset; x < CANVAS_WIDTH + stripeWidth * 2; x += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 14);
      ctx.lineTo(x + 8, groundY);
      ctx.lineTo(x + 16, groundY);
      ctx.lineTo(x + 8, groundY + 14);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 5. Divider border between grass and soil
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, groundY + 14, CANVAS_WIDTH, 2);
  }

  /**
   * Draw the iconic Flappy Bird with animated wing, eye, beak, and rotational tilt
   */
  public drawBird(
    x: number,
    y: number,
    angle: number,
    wingFrame: number,
    skin: BirdSkin
  ) {
    const ctx = this.ctx;
    const skinConfig = BIRD_SKINS[skin];

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // 1. Bird Body (Egg oval shape)
    ctx.fillStyle = skinConfig.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = skinConfig.eyeOutline;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. White/Light Belly
    ctx.fillStyle = skinConfig.belly;
    ctx.beginPath();
    ctx.ellipse(-3, 3, 10, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Flapping Wing
    // Wing frames: 0 (down), 1 (mid), 2 (up)
    ctx.save();
    ctx.fillStyle = skinConfig.wing;
    ctx.strokeStyle = skinConfig.wingEdge;
    ctx.lineWidth = 1.5;

    let wingOffsetY = 0;
    let wingAngle = 0;
    if (wingFrame === 0) {
      wingOffsetY = 3;
      wingAngle = 0.35;
    } else if (wingFrame === 2) {
      wingOffsetY = -4;
      wingAngle = -0.4;
    }

    ctx.translate(-7, wingOffsetY);
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 4. Rosy Cheek
    ctx.fillStyle = skinConfig.cheek;
    ctx.beginPath();
    ctx.arc(4, 3, 3, 0, Math.PI * 2);
    ctx.fill();

    // 5. Large Cartoon Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(6, -4, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = skinConfig.eyeOutline;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pupil looking forward
    ctx.fillStyle = skinConfig.eyeOutline;
    ctx.beginPath();
    ctx.ellipse(8, -4, 2.5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(7.5, -6, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // 6. Beak / Lips (Upper & Lower)
    ctx.fillStyle = skinConfig.beak;
    // Upper beak
    ctx.beginPath();
    ctx.moveTo(8, -1);
    ctx.lineTo(19, 0);
    ctx.lineTo(9, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lower lip
    ctx.beginPath();
    ctx.moveTo(7, 3);
    ctx.lineTo(16, 3);
    ctx.lineTo(8, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draw hit particles / burst on collision
   */
  public drawParticles(particles: Particle[]) {
    const ctx = this.ctx;
    for (const p of particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * Flash screen white momentarily on death
   */
  public drawFlash(alpha: number) {
    if (alpha <= 0) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha)})`;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.restore();
  }
}
