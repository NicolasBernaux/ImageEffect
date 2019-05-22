/* eslint-disable */
import * as THREE from 'three';
import { TweenLite } from 'gsap'

export default function (opts) {
  const vertex = `
  varying vec2 vUv;
  uniform vec3 viewVector;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
  `;

  const fragment = `
  varying vec2 vUv;
  uniform float dispFactor;
  uniform sampler2D disp;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform float angle1;
  uniform float angle2;
  uniform float intensity1;
  uniform float intensity2;
  mat2 getRotM(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }
  void main() {
    vec4 disp = texture2D(disp, vUv);
    vec2 dispVec = vec2(disp.r, disp.g);
    vec2 distortedPosition1 = vUv + getRotM(angle1) * dispVec * intensity1 * dispFactor;
    vec2 distortedPosition2 = vUv + getRotM(angle2) * dispVec * intensity2 * dispFactor;
    vec4 _texture1 = texture2D(texture1, distortedPosition1);
    vec4 _texture2 = texture2D(texture2, distortedPosition2);
    gl_FragColor = mix(_texture1, _texture2, dispFactor);
  }
  `;

  const parent = document.querySelector(opts.parent);
  const dispImage = opts.mask || opts.image;
  const image1 = opts.image1 || opts.image;
  const image2 = opts.image2 || opts.image;

  const dispFactor = 0.07;
  const intensity1 = 0.0;
  const intensity2 = intensity1;
  const commonAngle = 0;
  const angle1 = commonAngle;
  const angle2 = -commonAngle * 3;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    parent.offsetWidth / -2,
    parent.offsetWidth / 2,
    parent.offsetHeight / 2,
    parent.offsetHeight / -2,
    1,
    1000
  );

  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff, 0.0);
  renderer.setSize(parent.offsetWidth, parent.offsetHeight);
  parent.appendChild(renderer.domElement);

  const render = function () {
    renderer.render(scene, camera);
  };

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = '';
  const texture1 = loader.load(image1, render);
  const texture2 = loader.load(image2, render);
  const disp = loader.load(dispImage, render);
  disp.wrapS = disp.wrapT = THREE.RepeatWrapping;

  texture1.magFilter = texture2.magFilter = THREE.LinearFilter;
  texture1.minFilter = texture2.minFilter = THREE.LinearFilter;

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      intensity1: {
        type: 'f',
        value: intensity1,
      },
      intensity2: {
        type: 'f',
        value: intensity2,
      },
      dispFactor: {
        type: 'f',
        value: dispFactor,
      },
      angle1: {
        type: 'f',
        value: angle1,
      },
      angle2: {
        type: 'f',
        value: angle2,
      },
      texture1: {
        type: 't',
        value: texture1,
      },
      texture2: {
        type: 't',
        value: texture2,
      },
      disp: {
        type: 't',
        value: disp,
      },
    },

    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    opacity: 1.0,
  });

  const geometry = new THREE.PlaneBufferGeometry(parent.offsetWidth, parent.offsetHeight, 1);
  const object = new THREE.Mesh(geometry, mat);
  scene.add(object);

  window.addEventListener('resize', (e) => {
    renderer.setSize(parent.offsetWidth, parent.offsetHeight);
  });

  let animationFrame;

  /**
   *
   * @param speed - Speed of the angle cahnging
   * @param intensity - Radius
   */
  function animateCircle(speed = 0.1, intensity = 0.1) {
    mat.uniforms.angle1.value = mat.uniforms.angle1.value + speed;
    mat.uniforms.intensity1.value = intensity;
    render();
    animationFrame = requestAnimationFrame(() => {(animateCircle(speed, intensity))});
  }

  /**
   *
   * @param speed - Movement speed
   */
  function animateToTop(speed) {
    mat.uniforms.angle1.value = 2.35;
    mat.uniforms.intensity1.value = mat.uniforms.intensity1.value + speed;
    render();
    animationFrame = requestAnimationFrame(() => {
      animateToTop(speed)
    });
  }

  /**
   *
   * @param speed - Movement speed
   */
  function animateToBottom(speed) {
    mat.uniforms.angle1.value = 2.38;
    mat.uniforms.intensity1.value = mat.uniforms.intensity1.value - speed;
    render();
    animationFrame = requestAnimationFrame(() => {
      animateToBottom(speed)
    });
  }

  /**
   *
   * @param speed - Movement speed
   */
  function animateToLeft(speed) {
    mat.uniforms.angle1.value = 0.8;
    mat.uniforms.intensity1.value = mat.uniforms.intensity1.value + speed;
    render();
    animationFrame = requestAnimationFrame(() => {
      animateToLeft(speed)
    });
  }

  /**
   *
   * @param speed - Movement speed
   */
  function animateToRight(speed) {
    mat.uniforms.angle1.value = 3.85;
    mat.uniforms.intensity1.value = mat.uniforms.intensity1.value + speed;
    render();
    animationFrame = requestAnimationFrame(() => {
      animateToRight(speed)
    });
  }

  /**
   * Clear the Animation
   */
  function stopAnimation() {
    cancelAnimationFrame(animationFrame);
  }

  /**
   * Reset with an animation
   * @param duration
   */
  function resetAnimate(duration) {
    TweenLite.to(mat.uniforms.intensity1, duration,{value:0 ,onUpdate:render});
  }


  /**
   * Reset without animation
   */
  function reset() {
    mat.uniforms.intensity1.value = 0.0;
    render();
  }

  /**
   * Change the image
   * @param image
   * @param image2 - default value = image 1
   * @param mask - default value = image 1
   */
  function updateImage(image, image2 = image, mask = image) {
    ;
    const newLoader = new THREE.TextureLoader();
    newLoader.crossOrigin = '';
    const newTexture1 = newLoader.load(image, render);
    const newTexture2 = newLoader.load(image2, render);
    const newDisp = newLoader.load(mask, render);
    newDisp.wrapS = newDisp.wrapT = THREE.RepeatWrapping;

    newTexture1.magFilter = newTexture2.magFilter = THREE.LinearFilter;
    newTexture1.minFilter = newTexture2.minFilter = THREE.LinearFilter;

    mat.uniforms.texture1.value = newTexture1;
    mat.uniforms.texture2.value = newTexture2;
    mat.uniforms.disp.value = newDisp;
  }

  this.animateCircle = animateCircle;
  this.animateToTop = animateToTop;
  this.animateToBottom = animateToBottom;
  this.animateToLeft = animateToLeft;
  this.animateToRight = animateToRight;
  this.stopAnimation = stopAnimation;
  this.resetAnimate = resetAnimate;
  this.reset = reset;
  this.updateImage = updateImage;
}
