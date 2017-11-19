import React, { Component } from 'react';
import { TimelineMax, Linear, Power1 } from 'gsap';

import * as PIXI from 'pixi.js';
import 'gsap/PixiPlugin';
import 'pixi-display';
import { moveAndLineTo, textMessage, placeFlash, placeVideo } from './helpers';

import './Canvas.css';
import imageIntro1 from './../images/intro_1.jpg';
import imageIntro2 from './../images/intro_2.jpg';
import imageHiddenMe1 from './../images/hidden-me-1.jpg';
import videoIntro1 from './../images/intro_seq_1.mp4';

class Canvas extends Component {
  componentDidMount() {
    const onAssetsLoaded = (loader, resources) => {
      // Setup layers. TopLayer is for the flash, which goes over other assets.
      app.stage.displayList = new PIXI.DisplayList();
      const topLayer = new PIXI.DisplayGroup(1, true);

      /* === SETUP IMAGES === */
      const imageIntro1 = new PIXI.Sprite(resources.imageIntro1.texture);
      imageIntro1.alpha = 0;
      app.stage.addChild(imageIntro1);

      const imageIntro2 = new PIXI.Sprite(resources.imageIntro2.texture);
      imageIntro2.alpha = 0;
      app.stage.addChild(imageIntro2);

      const imageHiddenMe1 = new PIXI.Sprite(resources.imageHiddenMe1.texture);
      imageHiddenMe1.alpha = 0;
      imageHiddenMe1.anchor.y = 1;
      imageHiddenMe1.y = 1080;
      app.stage.addChild(imageHiddenMe1);

      /* === SETUP TEXT MESSAGES === */
      const message1 = textMessage('I want to show you my room');
      app.stage.addChild(message1);
      const message2 = textMessage('I will tell you about my room');
      app.stage.addChild(message2);
      const message3 = textMessage('I\'ll pretend I\'m not here');
      app.stage.addChild(message3);

      /* === SETUP WHITE FLASH === */
      const flash = placeFlash();
      flash.displayGroup = topLayer;
      app.stage.addChild(flash);

      /* === SETUP DOOR SHAPE === */
      const doorShape = new PIXI.Graphics();
      app.stage.addChild(doorShape);
      imageIntro1.mask = doorShape;

      const doorShapePoints = [188, 1080, 0, 616, 170, 889, 246, 1080, 188, 1080];
      moveAndLineTo(doorShape, doorShapePoints);

      /* === SETUP VIDEOS === */
      const video1 = placeVideo(videoIntro1);
      app.stage.addChild(video1.sprite);


      const tl_message1 = () => {
        const tl = new TimelineMax({ id: '1' });
        tl.to(message1, 0.01, { pixi: { alpha: 1 } });
        tl.from(message1, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone });
        tl.to(message1, 0, { pixi: { y: '+=60' } }, '+=0.04');
        tl.to(message1, 0, {
          pixi: { skewX: -30, scaleY: 12 },
        }, '+=0.04');
        tl.to(flash, 0.2, { alpha: 1 });
        tl.to(message1, 0, { alpha: 0 });
        return tl;
      };

      const tl_imageRoom1 = () => {
        const tl = new TimelineMax({ id: '2' });
        tl.to(imageIntro1, 0.01, { pixi: { alpha: 1, x: -1920, y: 0 } });
        tl.to(flash, 0.08, { alpha: 0 });
        tl.to(imageIntro1, 2, { pixi: { x: -1160, y: -200 }, ease: Power1.easeOut });

        tl.to(doorShapePoints, 2, {
          ...[886, 1080, 515, 163, 960, 237, 1322, 1080, 886, 1080],
          onUpdate: moveAndLineTo,
          onUpdateParams: [doorShape, doorShapePoints],
        }, "-=2");

        tl.to(imageIntro1, 3, { pixi: { x: 0, y: -1080 }, ease: Power1.easeInOut });
        tl.to(doorShapePoints, 3, {
          ...[125, 1080, -167, 270, 1632, -369, 2205, 1080],
          onUpdate: moveAndLineTo,
          onUpdateParams: [doorShape, doorShapePoints],
          ease: Power1.easeInOut
        }, "-=3");

        tl.to(imageIntro1, 0, { pixi: { alpha: 0 } });
        return tl;
      };

      const tl_message2 = () => {
        const tl = new TimelineMax({ id: '3' });
        tl.to(message2, 0.01, { pixi: { alpha: 1, skewX: -60, x: 600 } });
        tl.to(message2, 0, { pixi: { skewX: 0, x: 1320, scaleY: 1.5 } }, '+=0.04');
        tl.to(message2, 0, { pixi: { scaleY: 1 } }, '+=0.04');
        tl.from(message2, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone }, '+=0.04');
        tl.to(message2, 0, { pixi: { scaleY: 2 } });
        tl.to(message2, 0, { pixi: { scaleY: 1 } }, '+=0.04');
        tl.to(message2, 0, { pixi: { skewX: 50, x: 600 } }, '+=0.04');
        tl.to(message2, 0, { pixi: { skewX: 0, x: 1320, y: 640 } }, '+=0.04');
        return tl;
      };

      const tl_video1 = () => {
        const tl = new TimelineMax();
        video1.source.addEventListener('pause', () => {
          app.stage.removeChild(video1.sprite);
          tl.resume();
        });

        tl.to(flash, 0.2, {
          alpha: 1,
          onComplete: () => {
            app.stage.removeChild(message2);
          }
        });
        tl.to(flash, 0.08, { alpha: 0 });
        tl.to(video1.sprite, 0, { pixi: { alpha: 1 } });
        tl.addPause('+=0', video1.source.play, null, video1.source);
        tl.to(flash, 2, { pixi: { alpha: 0 } });
        return tl;
      };

      const tl_message3 = () => {
        const tl = new TimelineMax();
        tl.to(message3, 0.01, { pixi: { alpha: 1 } });
        tl.to(message3, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone });
        tl.to(imageHiddenMe1, 0.4, { pixi: { alpha: 1 }, ease: Linear.easeNone }, '-=0.4');
        tl.to(flash, 0.2, { pixi: { alpha: 1 }, ease: Linear.easeNone }, '-=0.2');
        tl.to(imageHiddenMe1, 0, { pixi: { alpha: 0 }, ease: Linear.easeNone });
        tl.to(message3, 0, { pixi: { alpha: 0 }, ease: Linear.easeNone });
        return tl;
      };

      const path = [
        { x: 162, y: 1080 },
        { x: 56, y: 883 },
        { x: 4, y: 688 },
        { x: 5, y: 496 },
        { x: 5, y: 207 },
        { x: 185, y: -5 },
        { x: 550, y: 5 },
        { x: 915, y: 16 },
        { x: 1007, y: 86 },
        { x: 1378, y: 46 },
        { x: 1750, y: 5 },
        { x: 1857, y: 157 },
        { x: 1908, y: 521 },
        { x: 1924, y: 635 },
        { x: 1796, y: 822 },
        { x: 1523, y: 1080 },
      ];

      const tl_image2 = () => {
        const tl = new TimelineMax();
        imageIntro2.anchor.x = 0.5;
        imageIntro2.anchor.y = 0.5;
        tl.to(flash, 0.08, { pixi: { alpha: 0 }, ease: Linear.easeNone });
        tl.to(imageIntro2, 0, { pixi: { alpha: 1 } }, '-=0.07');
        tl.to(imageIntro2, 5.5, { bezier: { values: path, type: 'cubic' }, ease: Linear.easeNone });
        return tl;
      };

      const tl_title = () => {
        const titleGroup = new PIXI.Container();
        const title = textMessage('Portfolioris.nl', 128);
        const subTitle = textMessage('The portfolio of Joris Hulsbosch');
        title.alpha = 1;
        title.x = 0;
        title.y = 0;
        title.anchor.y = 1;
        subTitle.alpha = 1;
        subTitle.x = 0;
        subTitle.y = 0;
        subTitle.anchor.y = 0;
        titleGroup.alpha = 0;
        titleGroup.x = 960;
        titleGroup.y = 540;
        titleGroup.alpha = 0;
        titleGroup.addChild(title);
        titleGroup.addChild(subTitle);
        app.stage.addChild(titleGroup);
        const tl = new TimelineMax();
        tl.to(titleGroup, 0.01, { pixi: { alpha: 1 } });
        tl.to(titleGroup, 4.8, { pixi: { scale: 0.8 }, ease: Linear.easeNone });
        return tl;
      };

      const master = new TimelineMax();
      // master.add(tl_message1());
      // master.add(tl_imageRoom1());
      // master.add(tl_message2());
      // master.add(tl_video1());
      // master.add(tl_message3());
      // master.add(tl_image2());
      master.add(tl_title());
    };

    const app = new PIXI.Application(1920, 1080, {
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      view: this.canvas,
    });

    const loader = PIXI.loader;
    loader.add('imageIntro1', imageIntro1);
    loader.add('imageIntro2', imageIntro2);
    loader.add('imageHiddenMe1', imageHiddenMe1);
    loader.add('videoIntro1', videoIntro1);
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
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
            <path id="motionPath"
                  d="M161.585 1080.777C56.495 883.327 4.177 688.402 4.633 496.007c.685-288.594 180.45-500.922 545.6-490.548 365.152 10.373 456.666 80.293 828.062 40.146C1749.69 5.46 1856.768 157.113 1908 521.006c16.05 114.007-112.377 300.598-385.283 559.77" />
          </svg>

        </div>
      </div>
    );
  }
}

Canvas.propTypes = {};
Canvas.defaultProps = {};

export default Canvas;
