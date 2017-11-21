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

      const video2 = placeVideo(videoIntro1); // todo: 2
      app.stage.addChild(video2.sprite);

      const tl_message1 = () => {
        const tl = new TimelineMax();
        tl
          .to(message1, 0.01, { alpha: 1 })
          .from(message1, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone })
          .to(flash, 0.2, { alpha: 1 }, '-=0.2')
          .to(message1, 0, { alpha: 0 });
        return tl;
      };

      const tl_imageRoom1 = () => {
        const tl = new TimelineMax();
        tl.to(imageIntro1, 0.01, { alpha: 1, x: -1920, y: 0 })
          .to(flash, 0.1, { alpha: 0 })
          .to(imageIntro1, 2, { x: -1160, y: -200, ease: Power1.easeOut }, '-=0.1')
          .to(doorShapePoints, 2, {
            ...[886, 1080, 515, 163, 960, 237, 1322, 1080, 886, 1080],
            onUpdate: moveAndLineTo,
            onUpdateParams: [doorShape, doorShapePoints],
          }, "-=2")
          .to(imageIntro1, 3, { x: 0, y: -1080, ease: Power1.easeInOut })
          .to(doorShapePoints, 3, {
            ...[125, 1080, -167, 270, 1632, -369, 2205, 1080],
            onUpdate: moveAndLineTo,
            onUpdateParams: [doorShape, doorShapePoints],
            ease: Power1.easeInOut
          }, "-=3")
          .to(imageIntro1, 0, { alpha: 0 });
        return tl;
      };

      const tl_message2 = () => {
        const tl = new TimelineMax();
        tl.to(message2, 0.01, { alpha: 1 })
          .from(message2, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone });
        return tl;
      };

      const tl_video1 = () => {
        video1.source.addEventListener('pause', () => {
          app.stage.removeChild(video1.sprite);
          tl.resume();
        });
        const tl = new TimelineMax();
        tl.to(flash, 0.2, { alpha: 1 })
          .to(message2, 0, { alpha: 0 })
          .to(video1.sprite, 0, { alpha: 1 })
          .to(flash, 0.08, { alpha: 0 })
          .addPause('+=0', video1.source.play, null, video1.source)
          .to(flash, 2, { alpha: 0 });
        return tl;
      };

      const tl_message3 = () => {
        const tl = new TimelineMax();
        tl.to(message3, 0.01, { alpha: 1 })
          .to(message3, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone })
          .to(imageHiddenMe1, 0.4, { alpha: 1, ease: Linear.easeNone }, '-=0.4')
          .to(flash, 0.2, { alpha: 1, ease: Linear.easeNone }, '-=0.2')
          .to(imageHiddenMe1, 0, { alpha: 0, ease: Linear.easeNone })
          .to(message3, 0, { alpha: 0, ease: Linear.easeNone });
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
        tl.to(flash, 0.08, { alpha: 0, ease: Linear.easeNone });
        tl.to(imageIntro2, 0, { alpha: 1 }, '-=0.07');
        tl.to(imageIntro2, 5.5, { bezier: { values: path, type: 'cubic' }, ease: Linear.easeNone });
        tl.to(imageIntro2, 0, { alpha: 0 });
        return tl;
      };

      const tl_title = () => {
        const titleGroup = new PIXI.Container();
        const title = textMessage('Portfolioris.nl', 128);
        const subTitle = textMessage('The portfolio of Joris Hulsbosch');
        title.alpha = 1;
        title.position.set(0, 0);
        title.anchor.y = 1;
        subTitle.alpha = 1;
        subTitle.position.set(0, 0);
        subTitle.anchor.y = 0;
        titleGroup.position.set(960, 540);
        titleGroup.alpha = 0;
        titleGroup.addChild(title);
        titleGroup.addChild(subTitle);
        app.stage.addChild(titleGroup);
        const tl = new TimelineMax();
        tl
          .to(titleGroup, 0.01, { alpha: 1 })
          .to(flash, 0.2, { alpha: 1 }, '+=2')
          .to(video2.sprite, 0, {
            alpha: 1,
            onStart: () => {
              video2.source.play();
            }
          })
          .to(flash, 0.8, { alpha: 0 })
          .to(titleGroup, 4.8, { pixi: { scale: 0.8 }, ease: Linear.easeNone }, '-=2.8');
        return tl;
      };

      new TimelineMax()
        .add(tl_message1())
        .add(tl_imageRoom1())
        .add(tl_message2())
        .add(tl_video1())
        .add(tl_message3())
        .add(tl_image2())
        .add(tl_title());
    };

    const app = new PIXI.Application(1920, 1080, {
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      view: this.canvas,
    });

    PIXI.loader
      .add('imageIntro1', imageIntro1)
      .add('imageIntro2', imageIntro2)
      .add('imageHiddenMe1', imageHiddenMe1)
      .add('videoIntro1', videoIntro1)
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
