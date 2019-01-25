import transit from './src/index.ts';

const obj = document.getElementById('obj');
const jsonInput = document.getElementById('json');
const resultInput = document.getElementById('result');
const gradient = document.getElementById('grad');

const applyStyle = style => {
  obj.style.transform = `translate(${style.left}px, 40px) scale(${
    style.scale
  })`;
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
  easing: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
};

let prevValue = jsonInput.value;
jsonInput.addEventListener('keyup', () => {
  if (prevValue !== jsonInput.value) {
    blockStyle.to(JSON.parse(jsonInput.value), transitOptions);
    prevValue = jsonInput.value;
  }
});

let curColor = -1;
const colors = ['#cf0', '#0fc', '#ff0', '#f0c', '#fc0'];
const gradColors = transit(
  { c1: colors[colors.length - 1], c2: colors[0] },
  ({ c1, c2 }) => {
    gradient.style.backgroundImage = `linear-gradient(${c1}, ${c2})`;
  }
);

const updateColors = () => {
  curColor = (curColor + 1) % colors.length;
  const nextColor = (curColor + 1) % colors.length;
  gradColors.to(
    {
      c1: colors[curColor],
      c2: colors[nextColor]
    },
    {
      end: updateColors,
      duration: 2000
    }
  );
};

updateColors();
