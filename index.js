import transit from './src/index';

const source = { top: 0, left: 0 };
transit(source, { top: 100, left: 30 }, {
  duration: 1000,
  easing: t => 1 + (--t) * t * t * t * t,
});

const obj = document.getElementById('obj');
const interval = setInterval(() => {
  obj.style.transform = `translate(${source.left}px, ${source.top}px)`;
  obj.style.width = `${source.left}px`;
  if (source.top === 100) {
    clearInterval(interval);
  }
}, 16);