import React, { Component } from 'react';
import { TimelineMax, Linear, Power1 } from 'gsap';

import * as PIXI from 'pixi.js';
import 'gsap/PixiPlugin';
import 'pixi-display';
import {
  generateStatic,
} from './helpers';

import imageMain from './../images/main/main.jpg';


import './Canvas.css';

class Canvas extends Component {
  componentDidMount() {
    const onAssetsLoaded = (loader, resources) => {
      const main = new PIXI.Container();
      app.stage.addChild(main);


      const mainImage = new PIXI.Container();
      main.addChild(mainImage);
      // mainImage.pivot.x = 3840;
      // mainImage.pivot.y = 2160;
      // mainImage.position.set(960, 540);
      const imageMain = new PIXI.Sprite(resources.imageMain.texture);
      mainImage.addChild(imageMain);

      const ticker = new PIXI.ticker.Ticker();
      ticker.add((deltaTime) => {
        const screenWidth = app.renderer.screen.width;
        let mouseX = app.renderer.plugins.interaction.mouse.global.x;
        let mouseY = app.renderer.plugins.interaction.mouse.global.y;
        mouseX = mouseX > screenWidth ? screenWidth : mouseX > 0 ? mouseX : 0;
        mouseY = mouseY > screenWidth ? screenWidth : mouseY > 0 ? mouseY : 0;


        const newX = ((0 - mouseX * 3 - mainImage.x) / 120 * deltaTime);
        const newY = ((0 - mouseY * 3 - mainImage.y) / 120 * deltaTime);
        mainImage.x = mainImage.x + newX;
        mainImage.y = mainImage.y + newY;
      });
      ticker.start();
    };


    const app = new PIXI.Application(1920, 1080, {
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      view: this.canvas,
    });

    PIXI.loader
      .add('imageMain', imageMain)
      .load(onAssetsLoaded);
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
