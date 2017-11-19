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

  message.anchor.x = 0.5;
  message.anchor.y = 0.5;
  message.x = 1320;
  message.y = 540;
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

export {
  textMessage,
  moveAndLineTo,
  placeFlash,
  placeVideo,
};
