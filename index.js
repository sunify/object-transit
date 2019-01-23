import transit from './src/index';

transit({ top: 0, bg1: '#0fc', bg2: '#ff0' }, { top: 100, bg1: '#ff0', bg2: '#0fc' }, (style) => {
  obj.style.transform = `translate(0px, ${style.top}px)`;
  obj.style.background = `linear-gradient(${style.bg1}, ${style.bg2})`;
}, {
  duration: 300,
  easing: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
});