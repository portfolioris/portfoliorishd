import React, { Component } from 'react';
import { TimelineMax, Linear, Power1 } from 'gsap';
import * as PIXI from 'pixi.js';
import 'gsap/PixiPlugin';
import 'pixi-display';

import './Canvas.css';
import imageFile from './../images/intro_1.jpg';
import videoFile from './../images/intro_seq_1.mp4';

class Canvas extends Component {
  componentDidMount() {
    function textMessage(text) {
      const message = new PIXI.Text(
        text,
        {
          fontFamily: 'TypeWriter',
          fontSize: 64,
          fill: 'white',
        },
      );

      message.anchor.x = 0.5;
      message.anchor.y = 0.5;
      message.x = 1320;
      message.y = 540;
      message.alpha = 0;
      app.stage.addChild(message);
      return message;
    }

    function moveAndLineTo(shape, points) {
      shape.clear();
      shape.beginFill(0xFFFFFF);
      shape.moveTo(points[0], points[1]);
      for (let i = 2; i < points.length; i = i + 2) {
        shape.lineTo(points[i], points[i + 1]);
      }
    }

    function onAssetsLoaded(loader, resources) {
      app.stage.displayList = new PIXI.DisplayList();
      const blueLayer = new PIXI.DisplayGroup(-1, true);

      /* === SETUP FIRST IMAGE === */
      const imageRoom1 = new PIXI.Sprite(resources.imageRoom1.texture);
      imageRoom1.alpha = 0;
      imageRoom1.displayGroup = blueLayer;
      app.stage.addChild(imageRoom1);

      /* === SETUP TEXT MESSAGE === */
      const message1 = textMessage('I want to show you my room');
      const message2 = textMessage('I will tell you about my room');


      /* === SETUP WHITE FLASH === */
      const flash = new PIXI.Graphics();
      flash.beginFill(0xFFFFFF);
      flash.drawRect(0, 0, 1920, 1080);
      flash.endFill();
      flash.alpha = 0;
      app.stage.addChild(flash);

      /* === SETUP DOOR SHAPE === */
      const doorShape = new PIXI.Graphics();
      app.stage.addChild(doorShape);
      imageRoom1.mask = doorShape;

      const doorShapePoints = [188, 1080, 0, 616, 170, 889, 246, 1080, 188, 1080];
      moveAndLineTo(doorShape, doorShapePoints);

      const tl = new TimelineMax();
      tl.to(message1, 0, { pixi: { alpha: 1 } });
      tl.from(message1, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone });
      tl.to(message1, 0, { pixi: { y: '+=60' } }, '+=0.04');
      tl.to(message1, 0, {
        pixi: { skewX: -30, scaleY: 12 },
      }, '+=0.04');

      tl.to(flash, 0.2, {
        alpha: 1,
        onComplete: () => app.stage.removeChild(message1),
      });

      tl.to(imageRoom1, 0, { pixi: { alpha: 1, x: -1920, y: 0 } });
      tl.to(flash, 0.08, { alpha: 0 });
      tl.to(imageRoom1, 2, { pixi: { x: -1160, y: -200 }, ease: Power1.easeOut });


      tl.to(doorShapePoints, 2, {
        ...[886, 1080, 515, 163, 960, 237, 1322, 1080, 886, 1080],
        onUpdate: moveAndLineTo,
        onUpdateParams: [doorShape, doorShapePoints],
      }, "-=2");

      tl.to(imageRoom1, 3, { pixi: { x: 0, y: -1080 }, ease: Power1.easeInOut });
      tl.to(doorShapePoints, 3, {
        ...[125, 1080, -167, 270, 1632, -369, 2205, 1080],
        onUpdate: moveAndLineTo,
        onUpdateParams: [doorShape, doorShapePoints],
        ease: Power1.easeInOut
      }, "-=3");

      tl.to(imageRoom1, 0, { pixi: { alpha: 0 } });
      tl.to(message2, 0, { pixi: { alpha: 1, skewX: -60, x: 600 } });
      tl.to(message2, 0, { pixi: { skewX: 0, x: 1320, scaleY: 1.5 } }, '+=0.04');
      tl.to(message2, 0, { pixi: { scaleY: 1 } }, '+=0.04');
      tl.from(message2, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone }, '+=0.04');
      tl.to(message2, 0, { pixi: { scaleY: 2 } });
      tl.to(message2, 0, { pixi: { scaleY: 1 } }, '+=0.04');
      tl.to(message2, 0, { pixi: { skewX: 50, x: 600 } }, '+=0.04');
      tl.to(message2, 0, { pixi: { skewX: 0, x: 1320, y: 640 } }, '+=0.04');


      const videoTexture = PIXI.VideoBaseTexture.fromUrl(videoFile);
      videoTexture.autoPlay = false;
      const texture = new PIXI.Texture(videoTexture);
      const source = videoTexture.source;
      const videoSprite = new PIXI.Sprite(texture);
      videoSprite.alpha = 0;
      app.stage.addChild(videoSprite);

      tl.to(flash, 0.2, {
        alpha: 1,
        onComplete: function () {
          app.stage.removeChild(message2);
        }
      });
      tl.to(videoSprite, 0, {
        pixi: {
          alpha: 1, onComplete: function () {
            source.play();
          }
        }
      });
      tl.to(flash, 0.08, { alpha: 0 });

    }

    const app = new PIXI.Application(1920, 1080, {
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      view: this.canvas,
    });

    const loader = PIXI.loader;
    loader.add('imageRoom1', imageFile);
    loader.add('video1', videoFile);
    loader.load(onAssetsLoaded);
  }

  render() {
    return (
      <div>
        <span className="u-visually-hidden">This should be Ubuntu</span>
        <div className="c-canvas">
          <canvas ref={(canvas) => {
            this.canvas = canvas;
          }} className="c-canvas__canvas" width="1920" height="1080" />
        </div>
      </div>
    );
  }
}

Canvas.propTypes = {};
Canvas.defaultProps = {};

export default Canvas;
