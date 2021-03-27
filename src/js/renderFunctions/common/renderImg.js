export default function renderImg(fileName, alt) {
  return `
    <img srcset="/assets/images/1x/${fileName},
      /assets/images/2x/${fileName} 2x,
      /assets/images/3x/${fileName} 3x,
      /assets/images/4x/${fileName} 4x"
      src="/assets/images/3x/${fileName}" alt="${alt}">
  `;
}
