import React, { Component } from 'react';
import { TimelineMax, Linear } from 'gsap';
import * as PIXI from 'pixi.js';
import PixiPlugin from 'gsap/PixiPlugin';
import PixiDisplay from 'pixi-display';

import './Canvas.css';
import imageFile from './../images/DSCN4125.jpg';

class Canvas extends Component {
  componentDidMount() {
    function onAssetsLoaded(loader, resources) {
      app.stage.displayList = new PIXI.DisplayList();
      const blueLayer = new PIXI.DisplayGroup(-1, true);

      const imageRoom1 = new PIXI.Sprite(resources.imageRoom1.texture);
      imageRoom1.alpha = 0;

      imageRoom1.displayGroup = blueLayer;

      app.stage.addChild(imageRoom1);

      const message = new PIXI.Text(
        'I want to show you my room',
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
      app.stage.addChild(message);

      const flash = new PIXI.Graphics();
      flash.beginFill(0xFFFFFF);
      flash.drawRect(0, 0, 1920, 1080);
      flash.endFill();
      flash.alpha = 0;
      app.stage.addChild(flash);

      const tl = new TimelineMax();
      tl.from(message, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone });
      tl.to(message, 0, { pixi: { y: '+=60' } }, '+=0.04');
      tl.to(message, 0, {
        pixi: { skewX: -30, scaleY: 12 },
      }, '+=0.04');

      tl.to(flash, 0.2, {
        alpha: 1,
        onComplete: () => app.stage.removeChild(message),
      });
      tl.to(imageRoom1, 0, { pixi: { alpha: 1 } });
      tl.to(flash, 0.08, { alpha: 0 });
    }

    const app = new PIXI.Application(1920, 1080, {
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      view: this.canvas,
    });

    const loader = PIXI.loader;
    loader.add('imageRoom1', imageFile);
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
