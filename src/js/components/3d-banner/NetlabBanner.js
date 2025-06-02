import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import TWEEN from "@tweenjs/tween.js";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  CanvasTexture,
  MeshBasicMaterial,
  BoxGeometry,
  Mesh,
  MeshPhysicalMaterial,
} from "three";
import { untilEventStop } from "../../functions/untilEventStop";

class NetlabBannerDefaultOtions {}

export class NetlabBanner {
  constructor(container, imgSrcArr, options) {
    this.sceneOptions = options;

    if (!container || !imgSrcArr) {
      return {};
    } else {
      this.container = container;
      // this.imgElements = imgElements;
    }

    this.imgElements = this.createImages(imgSrcArr);
    const imageIsLoaded = (image) => {
      return new Promise((resolve) => {
        image.onload = () => resolve();
        image.onerror = () => resolve();
      });
    };
    Promise.all(this.imgElements.map(imageIsLoaded)).then(() => {
      this.setupScene();
      this.createIceCube();
      this.createBoard();
      this.fakeRender = this.render;
      
      this.updateSize();
      untilEventStop(window, "resize", this.updateSize.bind(this));
      
      
      this.inView = false
      this.addObserver();

      this.loop();
      this.tweenStart();
      this.render();
      
      container.classList.add("_inited");
      this.renderPaused = false
      
    });
  }

  createImages(imgSrcArr) {
    const imgElements = [];
    for (const src of imgSrcArr) {
      const img = new Image();
      img.src = src;
      imgElements.push(img);
    }
    return imgElements;
  }
  pauseRender() {
    if(this.renderPaused){
      // console.log("already paused");
      return
    }
    this.renderPaused = true
    // console.log("pause");
    this.tweenPause();
    this.fakeRender = () => {};
  }
  unpauseRender() {
    if(!this.renderPaused || !this.inView){
      // console.log("already unpaused or not in view");
      return
    }
    this.renderPaused = false
    // console.log("UNpause");
    this.tweenPlay();
    this.fakeRender = this.render;
  }
  addObserver() {
    const observer = new IntersectionObserver(
      ([e]) => {
        this.inView = e.isIntersecting
        
        if (!this.inView && this.tweenPlayingState) {
          this.pauseRender();
        } else if (this.inView && !this.tweenPlayingState) {
          this.unpauseRender();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0],
      }
    );

    observer.observe(this.container);
  }
  setupScene() {
    this.renderer = new WebGLRenderer({
      stencil: false,
      // Сглаживание, возможно нужно включить
      // antialias: true,
      depth: false,
      alpha: true,
    });
    this.container.appendChild(this.renderer.domElement);

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      15,
      this.container.clientWidth / this.container.clientHeight,
      5,
      25
    );
    this.camera.position.z = this.sceneOptions.CameraZ;
  }

  getAspectRatio(img) {
    return img.width / img.height;
  }
  createBoard() {
    this.aspectRatio = this.getAspectRatio(this.imgElements[0]);
    this.textMaterials = [];

    for (let index = 0; index < this.imgElements.length; index++) {
      const canvas = document.createElement("canvas");
      canvas.width = 3000;
      canvas.height = canvas.width / this.aspectRatio;
      const context = canvas.getContext("2d");
      context.fillStyle = "#080808";
      context.fillRect(0, 0, canvas.width, canvas.height);

      if ((index == 2) | (index == 6)) {
        context.save();
        context.translate(canvas.width, canvas.height);
        context.scale(-1, -1);

        context.drawImage(
          this.imgElements[index],
          0,
          0,
          canvas.width,
          canvas.height
        );
        context.restore();
      } else {
        context.drawImage(
          this.imgElements[index],
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      const cvTexture = new CanvasTexture(canvas);
      this.textMaterials[index] = new MeshBasicMaterial({ map: cvTexture });
    }
    this.tMaterial = new MeshBasicMaterial({ transparent: true });
    const baseWidth = 40;
    const txtGeometry = new BoxGeometry(
      baseWidth,
      (baseWidth / this.aspectRatio).toFixed(),
      (baseWidth / this.aspectRatio).toFixed()
    );
    this.boardMaterials = [
      this.tMaterial,
      this.tMaterial,
      this.textMaterials[1],
      this.textMaterials[3],
      this.textMaterials[0],
      this.textMaterials[2],
    ];
    this.board = new Mesh(txtGeometry, this.boardMaterials);
    this.board.position.set(0, 0, this.sceneOptions.canvasZ);
    this.scene.add(this.board);
    this.flag = 0;

    let boardTween4 = new TWEEN.Tween({ r: 4.712389 })
      .to({ r: 6.283185 }, this.sceneOptions.bgSpin)
      .delay(this.sceneOptions.bgDelay);
    let boardTween3 = new TWEEN.Tween({ r: 3.141593 })
      .to({ r: 4.712389 }, this.sceneOptions.bgSpin)
      .delay(this.sceneOptions.bgDelay);
    let boardTween2 = new TWEEN.Tween({ r: 1.570796 })
      .to({ r: 3.141593 }, this.sceneOptions.bgSpin)
      .delay(this.sceneOptions.bgDelay);
    let boardTween1 = new TWEEN.Tween({ r: 0 })
      .to({ r: 1.570796 }, this.sceneOptions.bgSpin)
      .delay(this.sceneOptions.bgDelay);

    const afterCircle = function () {
      this.switchBoardMaterials1();
    }.bind(this);
    const onCircle = function () {
      this.switchBoardMaterials3();
    }.bind(this);

    boardTween1.chain(boardTween2);
    boardTween2.chain(boardTween3);
    boardTween3.chain(boardTween4);
    boardTween4.chain(boardTween1).onComplete(afterCircle).onStart(onCircle);

    const onUpdate = function (pos, elapsed) {
      this.board.rotation.x = pos.r;
    }.bind(this);

    boardTween1.onUpdate(onUpdate).easing(TWEEN.Easing.Quadratic.InOut);
    boardTween2.onUpdate(onUpdate).easing(TWEEN.Easing.Quadratic.InOut);
    boardTween3.onUpdate(onUpdate).easing(TWEEN.Easing.Quadratic.InOut);
    boardTween4.onUpdate(onUpdate).easing(TWEEN.Easing.Quadratic.InOut);

    this.boardTween1 = boardTween1;
    this.boardTween2 = boardTween2;
    this.boardTween3 = boardTween3;
    this.boardTween4 = boardTween4;
  }
  switchBoardMaterials3() {
    let arr = [4, 3, 5, 2];
    if (this.flag == 0) {
      for (let i = 0; i < 4; i++) {
        if (i != 1) {
          this.boardMaterials[arr[i]] = this.textMaterials[i + 4];
        }
      }
      this.flag = 1;
    } else {
      for (let i = 0; i < 4; i++) {
        if (i != 1) {
          this.boardMaterials[arr[i]] = this.textMaterials[i];
        }
      }
      this.flag = 0;
    }
  }
  switchBoardMaterials1() {
    let arr = [4, 3, 5, 2];

    if (this.flag == 0) {
      this.boardMaterials[arr[1]] = this.textMaterials[5];
    } else {
      this.boardMaterials[arr[1]] = this.textMaterials[1];
    }
  }
  createIceCube() {
    const material = new MeshPhysicalMaterial({
      transmission: this.sceneOptions.transmission,
      thickness: this.sceneOptions.thickness,
      roughness: this.sceneOptions.roughness,
      opacity: this.sceneOptions.opacity,
    });

    const boxGeom = new RoundedBoxGeometry(
      this.sceneOptions.BoxSize,
      this.sceneOptions.BoxSize,
      this.sceneOptions.BoxSize,
      16,
      this.sceneOptions.BoxRadius
    );
    this.iceCube = new Mesh(boxGeom, material);
    this.iceCube.position.z = this.sceneOptions.BoxZ;
    this.scene.add(this.iceCube);

    this.cubeTween = new TWEEN.Tween({ r: 0 })
      .to({ r: 6.283185 }, this.sceneOptions.cubeSpin)
      .repeat(Infinity);
    this.cubeTween.onUpdate((pos, elapsed) => {
      this.iceCube.rotation.y = pos.r;
    });
  }
  tweenPlayingState = false;

  scale() {
    if (!isMobile()) {
      this.scene.scale.set(1, 1, 1);
    } else this.scene.scale.set(0.38, 0.38, 0.38);
  }

  tweenStart() {
    this.cubeTween?.start();
    this.boardTween1.start();
    this.tweenPlayingState = true;
  }
  tweenPause() {
    this.pausedTweens = TWEEN.getAll();
    this.pausedTweens.forEach((el) => {
      el.pause();
    });
    this.tweenPlayingState = false;
  }
  tweenPlay() {
    if (this.pausedTweens) {
      this.pausedTweens.forEach((el) => {
        el.resume();
      });
      this.tweenPlayingState = true;
      this.pausedTweens = [];
    } else {
      this.cubeTween?.resume();
      this.boardTween1.resume();
      this.boardTween2.resume();
      this.boardTween3.resume();
      this.boardTween4.resume();
      this.tweenPlayingState = true;
    }
  }

  render() {
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
  }

  loop() {
    requestAnimationFrame(this.loop.bind(this));
    this.fakeRender();
  }

  updateSize() {
    this.scale();
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
