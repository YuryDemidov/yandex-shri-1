export default function setVhCssProperty() {
  document.documentElement.style.setProperty(`--vh`, `${globalThis.innerHeight * 0.01}px`);
}
