import transit from './src/index';

const obj = document.getElementById('obj');
const jsonInput = document.getElementById('json');
const resultInput = document.getElementById('result');

const applyStyle = (style) => {
  obj.style.transform = `translate(${style.left}px, 40px) scale(${style.scale})`;
  obj.style.color = style.color || '#000';
  obj.style.background = `linear-gradient(${style.bg1}, ${style.bg2})`;
  obj.innerText = Math.round(style.count);
  resultInput.value = JSON.stringify(style, undefined, 2);
};

const initial = JSON.parse(jsonInput.value);
const blockStyle = transit(initial, applyStyle);
applyStyle(initial);
console.log(blockStyle);

const transitOptions = {
  duration: 300,
  fps: 60,
  easing: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
};

let prevValue = jsonInput.value;
jsonInput.addEventListener('keyup', () => {
  if (prevValue !== jsonInput.value) {
    blockStyle.to(JSON.parse(jsonInput.value), transitOptions);
    prevValue = jsonInput.value;
  }
});