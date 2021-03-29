import CanvasDiagramDrawer from '../../classes/CanvasDiagramDrawer';

export default function drawDiagram({ categories, totalText }) {
  const OFFSET_ANGLE = 1; // degree
  const PIE_BORDER_RADIUS = 6; // px
  const CENTER_CIRCLE_RATIO = 0.7;
  const diagramCanvas = document.querySelector(`#doughnutDiagram`);
  const diagramSize = diagramCanvas.clientWidth - 40;
  const diagramRadius = diagramSize / 2;
  const totalValue = parseInt(totalText);
  const perimeterInPixels = 2 * Math.PI * diagramRadius;
  const borderRadiusInDegrees = PIE_BORDER_RADIUS / perimeterInPixels * 360;

  const drawer = new CanvasDiagramDrawer(diagramCanvas);
  let angleSum = 0;

  for (let i = 0; i < categories.length; i++) {
    const valueAngle = parseInt(categories[i].valueText) / totalValue * (360 - OFFSET_ANGLE * categories.length);
    drawer.drawSector(
      i + 1,
      diagramRadius,
      diagramCanvas.clientWidth / 2,
      diagramRadius * (1 - CENTER_CIRCLE_RATIO) - 2 * PIE_BORDER_RADIUS,
      drawer.degreesToRadians(angleSum),
      drawer.degreesToRadians(valueAngle + angleSum),
      PIE_BORDER_RADIUS,
      drawer.degreesToRadians(borderRadiusInDegrees)
    );

    angleSum += valueAngle + OFFSET_ANGLE;
  }
}
