import ImageEffect from './ImageEffect';

window.setTimeout(() => {
  const myAnimation = new ImageEffect({
    parent: '.container',
    intensity: 0.1,
    image: "https://picsum.photos/1280/1080",
  });

  // myAnimation.animateCircle(0.1, 0.01);
  // myAnimation.animateToTop(0.2);
  // myAnimation.animateToBottom(0.2);
  // myAnimation.animateToLeft(0.2)
  // myAnimation.animateToRight(0.2)
  // myAnimation.stopAnimation(0.2)
  // myAnimation.resetAnimate(2)
  // myAnimation.reset()
  // myAnimation.update()
},1000);
