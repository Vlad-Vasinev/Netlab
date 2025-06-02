const container = document.querySelector(".canvasSvgTest");

if (container) {
  const links = [
    "img/mainBanner/s1.svg",
    "img/mainBanner/s1.svg",
    "img/mainBanner/s1.svg",
  ];
  for (let index = 0; index < links.length; index++) {
    const img = new Image();
    const onImgLoadCb = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 3000;
      canvas.height = 375;
      const context = canvas.getContext("2d");
      console.log(img.width);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      container.appendChild(canvas);
    };

    img.addEventListener("load", onImgLoadCb, { once: true });
    img.src = links[index];
  }
}
