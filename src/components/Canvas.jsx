import React, { Component } from 'react';
import { TimelineMax, Linear, Power1 } from 'gsap';

import * as PIXI from 'pixi.js';
import 'gsap/PixiPlugin';
import 'pixi-display';
import {
  moveAndLineTo,
  textMessage,
  placeFlash,
  placeVideo,
  generateStatic,
} from './helpers';

/* global MorphSVGPlugin */
import './Canvas.css';
import imageIntro1 from './../images/intro_1.jpg';
import imageIntro2 from './../images/intro_2.jpg';
import imageHiddenMe1 from './../images/hidden-me-1.jpg';
import videoIntro1 from './../images/intro_seq_1.mp4';

import intro_1_screenmask from './../images/intro_1_screenmask.svg';

class Canvas extends Component {
  componentDidMount() {
    const onAssetsLoaded = (loader, resources) => {
      // Setup layers. TopLayer is for the flash, which goes over other assets.
      app.stage.displayList = new PIXI.DisplayList();
      const topLayer = new PIXI.DisplayGroup(1, true);

      const introSequence = new PIXI.Container();
      app.stage.addChild(introSequence);

      /* === SETUP WHITE FLASH === */
      const flash = placeFlash();
      flash.displayGroup = topLayer;
      introSequence.addChild(flash);

      const tl_message1 = () => {
        const message1 = textMessage('I want to show you my room');
        introSequence.addChild(message1);

        return new TimelineMax()
          .to(message1, 0.01, { alpha: 1 })
          .from(message1, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone })
          .to(flash, 0.2, { alpha: 1 }, '-=0.2')
          .to(message1, 0, { alpha: 0 });
      };

      const tl_imageRoom1 = () => {
        // wrap the image and static in a container
        const enterToViewTv = new PIXI.Container();
        introSequence.addChild(enterToViewTv);
        enterToViewTv.alpha = 0;
        app.stage.addChild(enterToViewTv);
        const imageIntro1 = new PIXI.Sprite(resources.imageIntro1.texture);
        enterToViewTv.addChild(imageIntro1);
        const tvScreenMask = new PIXI.Sprite(resources.intro_1_screenmask.texture);
        enterToViewTv.addChild(tvScreenMask);

        const staticNoise = generateStatic(311, 299);
        staticNoise.position.set(576, 1541);
        enterToViewTv.addChild(staticNoise);
        staticNoise.mask = tvScreenMask;

        /* === SETUP DOOR SHAPE === */
        const doorShape = new PIXI.Graphics();
        introSequence.addChild(doorShape);
        enterToViewTv.mask = doorShape;
        const doorShapePoints = [188, 1080, 0, 616, 170, 889, 246, 1080, 188, 1080];
        moveAndLineTo(doorShape, doorShapePoints);

        return new TimelineMax()
          .to(enterToViewTv, 0.01, { pixi: { scale: 0.5, alpha: 1, x: -1520, y: 800 } })
          .to(flash, 0.5, { alpha: 0 })
          .to(enterToViewTv, 3, { pixi: { scale: 0.75, x: -360, y: 0, ease: Power1.easeOut } }, '-=0.5')
          .to(doorShapePoints, 3, {
            ...[886, 1080, 515, 163, 960, 237, 1322, 1080, 886, 1080],
            onUpdate: moveAndLineTo,
            onUpdateParams: [doorShape, doorShapePoints],
          }, "-=3")
          .to(enterToViewTv, 3, { pixi: { scale: 1, x: 0, y: -1080 }, ease: Power1.easeInOut })
          .to(doorShapePoints, 3, {
            ...[125, 1080, -167, 270, 1632, -369, 2205, 1080],
            onUpdate: moveAndLineTo,
            onUpdateParams: [doorShape, doorShapePoints],
            ease: Power1.easeInOut
          }, "-=3")
        // .to(enterToViewTv, 0, { alpha: 0 });
      };

      const tl_message2 = () => {
        const message2 = textMessage('I will tell you about my room');
        introSequence.addChild(message2);

        return new TimelineMax()
          .to(message2, 0.01, { alpha: 1 })
          .from(message2, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone })
          .to(flash, 0.2, { alpha: 1 })
          .to(message2, 0, { alpha: 0 })
      };

      const tl_video1 = () => {
        const video1 = placeVideo(videoIntro1);
        introSequence.addChild(video1.sprite);

        const tl = new TimelineMax();
        video1.source.addEventListener('pause', () => {
          introSequence.removeChild(video1.sprite);
          tl.resume();
        });
        return tl
          .to(video1.sprite, 0.01, { alpha: 1 })
          .to(flash, 0.08, { alpha: 0 })
          .addPause('+=0', video1.source.play, null, video1.source)
          .to(flash, 2, { alpha: 0 });
      };

      const tl_message3 = () => {
        const imageHiddenMe1 = new PIXI.Sprite(resources.imageHiddenMe1.texture);
        imageHiddenMe1.alpha = 0;
        imageHiddenMe1.anchor.y = 1;
        imageHiddenMe1.y = 1080;
        introSequence.addChild(imageHiddenMe1);
        const message3 = textMessage('I\'ll pretend I\'m not here');
        introSequence.addChild(message3);

        return new TimelineMax()
          .to(message3, 0.01, { alpha: 1 })
          .from(message3, 2, { pixi: { scale: 0.9 }, ease: Linear.easeNone })
          .to(imageHiddenMe1, 0.4, { alpha: 1 }, '-=0.4')
          .to(flash, 0.2, { alpha: 1 }, '-=0.2')
          .to(imageHiddenMe1, 0, { alpha: 0 })
          .to(message3, 0, { alpha: 0 });
      };

      const tl_image2 = () => {
        const imageIntro2 = new PIXI.Sprite(resources.imageIntro2.texture);
        imageIntro2.alpha = 0;
        introSequence.addChild(imageIntro2);

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
        imageIntro2.anchor.x = 0.5;
        imageIntro2.anchor.y = 0.5;
        return new TimelineMax()
          .to(flash, 0.08, { alpha: 0, ease: Linear.easeNone })
          .to(imageIntro2, 0, { alpha: 1 }, '-=0.07')
          .to(imageIntro2, 5.5, { bezier: { values: path, type: 'cubic' }, ease: Linear.easeNone })
          .to(imageIntro2, 0, { alpha: 0 });
      };

      const tl_title = () => {
        const video2 = placeVideo(videoIntro1); // todo: 2
        introSequence.addChild(video2.sprite);
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
        introSequence.addChild(titleGroup);
        return new TimelineMax()
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
      };

      new TimelineMax()
      // .add(tl_message1())
        .add(tl_imageRoom1())
      // .add(tl_message2())
      // .add(tl_video1())
      // .add(tl_message3())
      //   .add(tl_image2())
      //   .add(tl_title());
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
      .add('intro_1_screenmask', intro_1_screenmask)
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
