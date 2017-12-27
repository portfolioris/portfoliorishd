import * as PIXI from 'pixi.js';

const textMessage = (text, size = 64) => {
  const message = new PIXI.Text(
    text,
    {
      fontFamily: 'TypeWriter',
      fontSize: size,
      fill: 'white',
    },
  );

  message.anchor.set(0.5, 0,5);
  message.position.set(1320, 540);
  message.alpha = 0;
  return message;
};

const moveAndLineTo = (shape, points) => {
  shape.clear();
  shape.beginFill(0xFFFFFF);
  shape.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i = i + 2) {
    shape.lineTo(points[i], points[i + 1]);
  }
};

const placeFlash = () => {
  const flash = new PIXI.Graphics();
  flash.beginFill(0xFFFFFF);
  flash.drawRect(0, 0, 1920, 1080);
  flash.endFill();
  flash.alpha = 0;
  return flash;
};

const placeVideo = (videoFile) => {
  const videoTexture = PIXI.VideoBaseTexture.fromUrl(videoFile);
  videoTexture.autoPlay = false;
  const texture = new PIXI.Texture(videoTexture);
  const source = videoTexture.source;
  const sprite = new PIXI.Sprite(texture);
  sprite.alpha = 0;
  return {
    sprite,
    source,
  };
};

const generateStatic = () => {
  const c = document.createElement('canvas'),
    w = 311,
    h = 299;
  c.width = w;
  c.height = h;
  const $ = c.getContext('2d');
  const id = $.createImageData(w, h);

  let r;
  for (let p = 4 * (w * h - 1); p >= 0; p -= 4) {
    r = Math.random();
    id.data[p] = id.data[p + 1] = id.data[p + 2] = 255 * Math.pow(r, 0.6);
    id.data[p + 3] = 255;
  }
  $.putImageData(id, 0, 0);

  const canvasTexture = PIXI.Texture.fromCanvas(c);
  const sprite = new PIXI.Sprite(canvasTexture);
  sprite.width = 311;
  sprite.height = 299;
  return sprite;
};

export {
  textMessage,
  moveAndLineTo,
  placeFlash,
  placeVideo,
  generateStatic,
};
