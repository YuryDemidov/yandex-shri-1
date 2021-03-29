export default function renderCaption({ title, subtitle }) {
  return `
    <div class="slide__caption">
      <h1 class="slide__title headline">${title}</h1>
      <h2 class="slide__subtitle main-text main-text_dim">${subtitle}</h2>
    </div>
  `;
}
