/* eslint-disable */
export default class CanvasDiagramDrawer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext(`2d`);
    this.theme = document.querySelector(`body`).classList.contains(`theme_light`) ? `light` : `dark`;
    this.shadowOffset = 1000; // px
  }

  drawBorderRadius(centerX, centerY, radiusControlPoint, angleControlPoint, radiusEndPoint, angleEndPoint) {
    const borderRadiusControlPoint = this.getCirclePoint(centerX, centerY, radiusControlPoint, angleControlPoint);
    const borderRadiusEndPoint = this.getCirclePoint(centerX, centerY, radiusEndPoint, angleEndPoint);

    this.ctx.quadraticCurveTo(borderRadiusControlPoint.x, borderRadiusControlPoint.y, borderRadiusEndPoint.x, borderRadiusEndPoint.y);
  }

  drawSector(sectorNumber, radius, center, ringWidth, startAngle, endAngle, borderRadiusSize, borderRadiusInRads, isAuxiliary) {
    //this.setInitialRotation();
    const centerX = isAuxiliary ? center + this.shadowOffset : center; // For inset shadows drawing
    const centerY = center;
    const innerRadius = radius - ringWidth - 2 * borderRadiusSize;

    this.ctx.beginPath();
    // Outer radius
    this.ctx.arc(centerX, centerY, radius, startAngle + borderRadiusInRads, endAngle - borderRadiusInRads);
    // Outer first border radius
    this.drawBorderRadius(centerX, centerY, radius, endAngle, radius - borderRadiusSize, endAngle);
    // Ring line border
    this.moveAlongRadius(centerX, centerY, innerRadius + borderRadiusSize, endAngle);
    // Inner first border radius
    this.drawBorderRadius(centerX, centerY, innerRadius, endAngle, innerRadius, endAngle - borderRadiusInRads);
    // Inner radius
    this.ctx.arc(centerX, centerY, radius - ringWidth - 2 * borderRadiusSize, endAngle - borderRadiusInRads, startAngle + borderRadiusInRads, true);
    // Inner second border radius
    this.drawBorderRadius(centerX, centerY, innerRadius, startAngle, innerRadius + borderRadiusSize, startAngle);
    // Ring line border
    this.moveAlongRadius(centerX, centerY, radius - borderRadiusSize, startAngle);
    // Outer second border radius
    this.drawBorderRadius(centerX, centerY, radius, startAngle, radius, startAngle + borderRadiusInRads);

    if (!isAuxiliary) {
      this.ctx.fillStyle = this._createRadialGradient(sectorNumber, centerY, radius);
      this.ctx.fill();
      this._addShadows(...arguments);
    }
  }

  moveAlongRadius(centerX, centerY, radius, angle) {
    const endPoint = this.getCirclePoint(centerX, centerY, radius, angle);

    this.ctx.lineTo(endPoint.x, endPoint.y);
  }

  getCirclePoint(centerX, centerY, radiusPart, angle) {
    const point = { x: 0, y: 0 };

    if (angle >= 0 && angle < Math.PI / 2) {
      point.x = centerX + radiusPart * Math.sin(Math.PI / 2 - angle);
      point.y = centerY + radiusPart * Math.sin(angle);
    } else if (angle >= Math.PI / 2 && angle < Math.PI) {
      angle = angle - Math.PI / 2;
      point.x = centerX - radiusPart * Math.sin(angle);
      point.y = centerY + radiusPart * Math.sin(Math.PI / 2 - angle);
    } else if (angle >= Math.PI && angle < 3 * Math.PI / 2) {
      angle = angle - Math.PI;
      point.x = centerX - radiusPart * Math.sin(Math.PI / 2 - angle);
      point.y = centerY - radiusPart * Math.sin(angle);
    } else {
      angle = angle - 3 * Math.PI / 2;
      point.x = centerX + radiusPart * Math.sin(angle);
      point.y = centerY - radiusPart * Math.sin(Math.PI / 2 - angle);
    }

    return point;
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  /**
   * Config of sectors gradients
   */
  _createRadialGradient(sectorNumber, center, mainRadius) {
    let circleRadiusRatio;
    let firstColorStop;
    let secondColorStop;

    switch (sectorNumber) {
      case 1:
        if (this.theme === `dark`) {
          circleRadiusRatio = 0.7188;
          firstColorStop = `rgba(255, 163, 0, 0.8)`;
          secondColorStop = `rgba(91, 58, 0, 0.8)`;
        } else {
          circleRadiusRatio = 0.8125;
          firstColorStop = `rgba(255, 184, 0, 0.56)`;
          secondColorStop = `rgba(255, 239, 153, 0.32)`;
        }
        break;
      case 2:
        if (this.theme === `dark`) {
          circleRadiusRatio = 0.7292;
          firstColorStop = `rgba(99, 63, 0, 0.5)`;
          secondColorStop = `rgba(15, 9, 0, 0.5)`;
        } else {
          circleRadiusRatio = 0.8125;
          firstColorStop = `rgba(255, 184, 0, 0.24)`;
          secondColorStop = `rgba(255, 239, 153, 0.12)`;
        }
        break;
      case 3:
        if (this.theme === `dark`) {
          circleRadiusRatio = 0.7188;
          firstColorStop = `rgba(155, 155, 155, 0.5)`;
          secondColorStop = `rgba(56, 41, 0, 0.5)`;
        } else {
          circleRadiusRatio = 0.8281;
          firstColorStop = `rgba(166, 166, 166, 0.1725)`;
          secondColorStop = `rgba(203, 203, 203, 0.05)`;
        }
        break;
      case 4:
        if (this.theme === `dark`) {
          circleRadiusRatio = 0.7188;
          firstColorStop = `rgba(77, 77, 77, 0.5)`;
          secondColorStop = `rgba(56, 41, 0, 0.5)`;
        } else {
          circleRadiusRatio = 0.8281;
          firstColorStop = `rgba(191, 191, 191, 0.345)`;
          secondColorStop = `rgba(228, 228, 228, 0.1)`;
        }
        break;
    }

    const gradient = this.ctx.createRadialGradient(center, center, circleRadiusRatio * mainRadius, center, center, mainRadius);

    gradient.addColorStop(0, firstColorStop);
    gradient.addColorStop(1, secondColorStop);

    return gradient;
  }

  _addShadows() {
    const slideNumber = arguments[0];
    const shadowsConfig = this._getShadows(slideNumber);

    this.drawSector(...arguments, true);

    shadowsConfig.forEach(shadow => {
      this.ctx.shadowColor = shadow.color;
      this.ctx.shadowBlur = shadow.blur || 10;
      this.ctx.lineWidth = shadow.blur * 2 || 10;
      this.ctx.shadowOffsetX = shadow.shadowOffsetX ? -this.shadowOffset + shadow.shadowOffsetX : -this.shadowOffset;
      this.ctx.shadowOffsetY = shadow.shadowOffsetY || 0;

      if (shadow.inset) {
        this.ctx.globalCompositeOperation = `source-atop`;
      }

      if (shadow.spread) {
        const scaleFactor = 0.5;
        this.ctx.save();
        this.ctx.scale(scaleFactor, scaleFactor);
      }

      this.ctx.stroke();

      this.ctx.restore();
      this.ctx.globalCompositeOperation = `source-over`;
    });
  }

  _getShadows(slideNumber) {
    const shadows = [];
    const insetBorderShadow = {
      blur: 1,
      color: `rgba(255, 255, 255, 0.5)`,
      shadowOffsetX: -1,
      shadowOffsetY: 1,
      inset: true
    };

    switch (slideNumber) {
      case 1:
        if (this.theme === `dark`) {
          shadows.push(
            {
              spread: -8,
              color: `rgba(248, 158, 0, 0.2)`,
              inset: false
            },
            insetBorderShadow,
            {
              color: `rgba(255, 162, 0, 0.9)`,
              inset: true
            }
          );
        } else {
          shadows.push(
            insetBorderShadow,
            {
              color: `rgba(255, 176, 57, 0.9)`,
              inset: true
            }
          );
        }
        break;
      case 2:
        if (this.theme === `dark`) {
          shadows.push(
            {
              spread: -8,
              color: `rgba(147, 93, 0, 0.2)`,
              inset: false
            },
            insetBorderShadow,
            {
              color: `rgba(202, 129, 0, 0.9)`,
              inset: true
            }
          );
        } else {
          shadows.push(
            insetBorderShadow,
            {
              color: `rgba(255, 176, 57, 0.4)`,
              inset: true
            }
          );
        }
        break;
      case 3:
        if (this.theme === `dark`) {
          shadows.push(
            {
              spread: -8,
              color: `rgba(0, 0, 0, 0.2)`,
              inset: false
            },
            insetBorderShadow,
            {
              color: `rgba(139, 139, 139, 0.9)`,
              inset: true
            }
          );
        } else {
          shadows.push(
            insetBorderShadow,
            {
              color: `rgba(105, 105, 105, 0.2)`,
              inset: true
            }
          );
        }
        break;
      case 4:
        if (this.theme === `dark`) {
          shadows.push(
            {
              spread: -8,
              color: `rgba(96, 96, 96, 0.2)`,
              inset: false
            },
            insetBorderShadow,
            {
              color: `rgba(38, 38, 38, 0.9)`,
              inset: true
            }
          );
        } else {
          shadows.push(
            insetBorderShadow,
            {
              color: `rgba(131, 131, 131, 0.6)`,
              inset: true
            }
          );
        }
        break;
    }

    return shadows;
  }
}
