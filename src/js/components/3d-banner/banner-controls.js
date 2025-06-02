import GUI from "lil-gui";
class Controls {
    constructor(options) {
      const gui = new GUI();
      let folder;

      folder = gui.addFolder("Camera");

      folder.add(options, "CameraX", -50, 50, 0.5).onChange((val) => {
        window.visualization.camera.position.x = val;
      });
      folder.add(options, "CameraY", -50, 50, 0.5).onChange((val) => {
        window.visualization.camera.position.y = val;
      });
      folder.add(options, "CameraZ", -50, 50, 0.5).onChange((val) => {
        window.visualization.camera.position.z = val;
      });
      folder = gui.addFolder("Box");

      folder.add(options, "BoxSize", 1, 20, 0.5).onChange((val) => {
        window.visualization.box.geometry = new RoundedBoxGeometry(
          val,
          val,
          val,
          16,
          options.BoxRadius
        );
      });
      folder.add(options, "BoxRadius", 0, 20, 0.1).onChange((val) => {
        window.visualization.box.geometry = new RoundedBoxGeometry(
          options.BoxSize,
          options.BoxSize,
          options.BoxSize,
          16,
          val
        );
      });
      folder.add(options, "BoxX", -50, 50, 0.5).onChange((val) => {
        window.visualization.box.position.x = val;
      });
      folder.add(options, "BoxY", -50, 50, 0.5).onChange((val) => {
        window.visualization.box.position.y = val;
      });
      folder.add(options, "BoxZ", -50, 50, 0.5).onChange((val) => {
        window.visualization.box.position.z = val;
      });

      folder = gui.addFolder("canvas");

      folder.add(options, "canvasZ", -50, 50, 0.5).onChange((val) => {
        window.visualization.board.position.z = val;
      });
    }
  }
  
  if(window.bannerOptions){
    window.controls = new Controls(window.bannerOptions);
  }