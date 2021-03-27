export default function renderCaption({ title, subtitle }) {
  return `
<div class="slide__caption">
  <h1 class="slide__title">${title}</h1>
  <h2 class="slide__subtitle">${subtitle}</h2>
</div>
`;
}
