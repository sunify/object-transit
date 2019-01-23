import transit from './src/index';

const initialStyle = { bg1: '#0fc', bg2: '#f00', scale: 1.2, left: 10, count: 0 };
const hoverStyle = { bg1: '#ff0', bg2: '#0fc', scale: 1, left: 200, count: 10 };

const applyStyle = (style) => {
  obj.style.transform = `translate(${style.left}%, 40px) scale(${style.scale})`;
  obj.style.background = `linear-gradient(${style.bg1}, ${style.bg2})`;
  obj.innerText = Math.round(style.count);
};

const obj = document.getElementById('obj');
const blockStyle = transit(initialStyle, applyStyle);
applyStyle(initialStyle);

const transitOptions = {
  duration: 1000,
  fps: 60,
  easing: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
};

let toggled = false;
document.addEventListener('click', () => {
  blockStyle.to(toggled ? initialStyle : hoverStyle, transitOptions);
  toggled = !toggled;
});