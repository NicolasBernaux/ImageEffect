
# Image Effect

A lightweight image animation effect with threejs.

### Demo

Visit the [live demo here](http://imageeffect.nicolasbernaux.com/)

### Usage
``` javascript
var myAnimation = new ImageEffect({
    parent: '.container',
    image: 'https://picsum.photos/1280/720',
  });
```
#### Mandatory parameters

| Name  | type | Default |
| ------------- | :--- | ------------- |
| parent | null | Query Selector |
| image | null | Image to animate|

#### Optional parameters

| Name  | type | Default |
| ------------- | :--- | ------------- |
| image1 | =image | Image 1 |
| image2 | =image | image 2|
| mask | =image | mask for the animation|

#### Animations
- `myAnimation.animateCircle(speed, intensity);` Animate in circle
- `myAnimation.animateToTop(speed);` Animate to the top
- `myAnimation.animateToBottom(speed);` Animate to the bottom
- `myAnimation.animateToLeft(speed)` Animate to the left
- `myAnimation.animateToRight(speed)` Animate to the right
- `myAnimation.stopAnimation()` Clear the Animation
- `myAnimation.resetAnimate(duration)` Reset with an animation
- `myAnimation.reset()` Reset without an animation
- `myAnimation.updateImage(image1, image2, mask)` Change the image

#### Related
- [hover-effect](https://www.npmjs.com/package/hover-effect) - Based on this code
