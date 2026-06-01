const canvas = document.getElementById("output-canvas");
const ctx = canvas.getContext("2d");
let bgImg = null;

function fileToImage(file) {
  return new Promise((resolve, _reject) => {
    const image = new Image();
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      image.src = reader.result;
      image.onload = () => {
        resolve(image);
      };
    });
    reader.readAsDataURL(file);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function draw() {
  let imageWidth = canvas.getAttribute("width");
  let imageHeight = canvas.getAttribute("height");

  // Image
  const file = document.getElementById("image-input")?.files[0];
  if (file) {
    const image = await fileToImage(file);
    imageWidth = image.width;
    imageHeight = image.height;
    console.log(image.naturalWidth, image.naturalHeight);
    bgImg = image;
  }

  // Get inputs
  const title = document.getElementById("title-input").value || "Sample Text";
  const subtitle = document.getElementById("subtitle-input").value || title;
  const fontSizeOverride = document.getElementById("font-size-input").value
    ? parseFloat(document.getElementById("font-size-input").value)
    : null;
  const subtitleOffset =
    (parseFloat(document.getElementById("subtitle-offset-input").value) ?? 50) /
    100;
  const opacity =
    (parseFloat(document.getElementById("overlay-opacity-input").value) ?? 50) /
    100;
  const verticalOffset = parseFloat(
    document.getElementById("vertical-offset-input").value,
  );

  // Shenans
  document
    .getElementById("subtitle-input")
    .setAttribute("placeholder", subtitle === title ? title : "Sample Text");

  // Set up canvas size
  canvas.setAttribute("width", imageWidth);
  canvas.setAttribute("height", imageHeight);

  // Drawing time
  ctx.reset();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Image
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, imageWidth, imageHeight);
  }

  // Overlay
  ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text
  const fontSize = fontSizeOverride ?? imageWidth * (180 / 1920);
  ctx.font = `bold ${fontSize}px Novecento`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(
    title.toUpperCase(),
    imageWidth / 2,
    imageHeight / 2 + verticalOffset,
  );

  ctx.font = `${fontSize / 2}px EndfieldByButan`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(
    subtitle.toUpperCase(),
    imageWidth / 2,
    imageHeight / 2 + fontSize * subtitleOffset + verticalOffset,
  );
}

function init() {
  document
    .querySelectorAll("input")
    .forEach((e) => e.addEventListener("input", draw));

  bgImg = new Image();
  bgImg.crossOrigin = "anonymous";
  bgImg.src = "favicon-96x96.png";
  bgImg.onload = draw;
}

init();
