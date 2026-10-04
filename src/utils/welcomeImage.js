const Canvas = require("canvas");
const GIFEncoder = require("gif-encoder-2");
const path = require("path");
const fs = require("fs");

// Fuente 
const fontPath = path.join(__dirname, "../assets/fonts/Roboto-Bold.ttf");
if (!fs.existsSync(fontPath)) {
  console.warn("[welcome] No se encontró la fuente en:", fontPath);
}
Canvas.registerFont(fontPath, { family: "RobotoCustom", weight: "bold" });

// Configuración 
const W = 640,
  H = 312;
const FRAMES = 30,
  DELAY = 60;
const CX = W / 2,
  CY = 112,
  R = 78;

let bgCache;
const getBackground = () =>
  (bgCache ??= Canvas.loadImage(
    path.join(__dirname, "../assets/welcome_l.png"),
  ));

// Posiciones 
const sparkles = Array.from({ length: 26 }, (_, i) => ({
  x: (((i * 97) % 100) / 100) * W,
  y0: ((i * 53) % 100) / 100,
  k: 1 + (i % 2),
  m: 1 + (i % 3),
  phase: (i % 7) / 7,
  size: 2 + (i % 3),
}));

// Capa estática 
async function buildStaticLayer(member) {
  const layer = Canvas.createCanvas(W, H);
  const c = layer.getContext("2d");

  // Fondo 
  c.drawImage(await getBackground(), 0, 0, W, H);
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "rgba(0,0,0,0.10)");
  g.addColorStop(1, "rgba(0,0,0,0.70)");
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);

  // Sombra 
  c.save();
  c.translate(CX, 262);
  c.scale(1, 0.35);
  const glow = c.createRadialGradient(0, 0, 0, 0, 0, 270);
  glow.addColorStop(0, "rgba(0,0,0,0.70)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = glow;
  c.beginPath();
  c.arc(0, 0, 270, 0, Math.PI * 2);
  c.fill();
  c.restore();

  // Avatar 
  try {
    const avatar = await Canvas.loadImage(
      member.user.displayAvatarURL({ extension: "png", size: 256 }),
    );
    c.save();
    c.beginPath();
    c.arc(CX, CY, R, 0, Math.PI * 2);
    c.clip();
    c.drawImage(avatar, CX - R, CY - R, R * 2, R * 2);
    c.restore();
  } catch (e) {
    c.beginPath();
    c.arc(CX, CY, R, 0, Math.PI * 2);
    c.fillStyle = "#5865F2";
    c.fill();
  }

  // Textos 
  c.textAlign = "center";
  c.lineJoin = "round";
  c.shadowColor = "rgba(0,0,0,0.8)";
  c.shadowBlur = 8;

  const text = (str, y, font, color, stroke = 5) => {
    c.font = font;
    c.lineWidth = stroke;
    c.strokeStyle = "rgba(0,0,0,0.65)";
    c.strokeText(str, CX, y);
    c.fillStyle = color;
    c.fillText(str, CX, y);
  };

  text("¡Bienvenido(a)!", 244, "bold 34px RobotoCustom", "#fff");
  text(member.user.username, 275, "bold 26px RobotoCustom", "#55FF55");
  text(
    `Eres el miembro #${member.guild.memberCount} de Lumecraft`,
    295,
    "bold 17px RobotoCustom",
    "#ddd",
    4,
  );

  return layer;
}

// Efectos animados 
function drawFrameEffects(ctx, t) {
  // Anillo 
  const pulse = 0.5 + 0.5 * Math.sin(Math.PI * 2 * t);
  ctx.save();
  ctx.shadowColor = "#55FF55";
  ctx.shadowBlur = 8 + 14 * pulse;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(CX, CY, R + 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Destellos 
  for (const s of sparkles) {
    const y = ((((s.y0 - s.k * t) % 1) + 1) % 1) * H;
    const a = 0.5 + 0.5 * Math.sin(Math.PI * 2 * (s.m * t + s.phase));
    ctx.fillStyle = `rgba(255,255,160,${(a * 0.9).toFixed(2)})`;
    ctx.fillRect(s.x, y, s.size, s.size);
  }
}

// Generador del GIF 
async function generateWelcomeGif(member) {
  const base = await buildStaticLayer(member);
  const canvas = Canvas.createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const encoder = new GIFEncoder(W, H, "neuquant", true, FRAMES);
  encoder.setDelay(DELAY);
  encoder.setQuality(15);
  encoder.setRepeat(0);
  encoder.start();

  for (let f = 0; f < FRAMES; f++) {
    ctx.drawImage(base, 0, 0);
    drawFrameEffects(ctx, f / FRAMES);
    encoder.addFrame(ctx);
  }
  encoder.finish();
  return encoder.out.getData();
}

module.exports = { generateWelcomeGif };