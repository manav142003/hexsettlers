//Island component: Generates a clip path image of an island that outlines the hex tiles. Used in game board component.

import { useMemo } from "react";
import { getHexVertices } from "./HexTile";
import edgeKey from "../utils/edgeKey";

const nudgedCoords = (coords, cx, cy, amplitude) =>
  //push border points outwards by a given amplitude value to give the island a bit of padding
  coords.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const len = Math.sqrt(dx * dx + dy * dy);
    const factor = 1 + amplitude / len;
    return [+(cx + dx * factor).toFixed(1), +(cy + dy * factor).toFixed(1)];
  });

const buildSmoothPath = (points) => {
  //build the clip path
  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [prevX, prevY] = points[i - 1];
    const [currX, currY] = points[i];
    const ctrlX = (prevX + currX) / 2;
    const ctrlY = (prevY + currY) / 2;
    path += ` Q ${prevX} ${prevY}, ${ctrlX} ${ctrlY}`;
  }

  //close the curve with a final segment
  const [lastX, lastY] = points[points.length - 1];
  const [firstX, firstY] = points[0];
  const closingCtrlX = (lastX + firstX) / 2;
  const closingCtrlY = (lastY + firstY) / 2;
  path += ` Q ${lastX} ${lastY}, ${closingCtrlX} ${closingCtrlY} Z`;

  return `path('${path}')`;
};

const generateIslandClipPath = (hexTiles, radius, amplitude) => {
  const edgeCount = new Map();

  //for each hex tile, get its 6 vertices and keep track of each edge. Edges that only appear once are the "outer" edges
  hexTiles.forEach(({ x, y }) => {
    const vertices = getHexVertices(x, y, radius);
    for (let i = 0; i < 6; i++) {
      const a = vertices[i];
      const b = vertices[(i + 1) % 6];
      const key = edgeKey(a, b);
      edgeCount.set(key, (edgeCount.get(key) || 0) + 1);
    }
  });

  const outerEdges = [...edgeCount.entries()].filter(([_, count]) => count === 1);
  const points = new Set();

  outerEdges.forEach(([key]) => {
    const [a, b] = key.split("|").map((coord) => coord.split(",").map(Number));
    points.add(`${a[0]},${a[1]}`);
    points.add(`${b[0]},${b[1]}`);
  });
  const coords = Array.from(points).map((p) => p.split(",").map(Number));

  //compute center of the hex grid and sort border points in clockwise order
  const cx = hexTiles.reduce((sum, h) => sum + h.x, 0) / hexTiles.length;
  const cy = hexTiles.reduce((sum, h) => sum + h.y, 0) / hexTiles.length;
  coords.sort((a, b) => {
    const angleA = Math.atan2(a[1] - cy, a[0] - cx);
    const angleB = Math.atan2(b[1] - cy, b[0] - cx);
    return angleA - angleB;
  });

  const nudged = nudgedCoords(coords, cx, cy, amplitude);
  const rotated = nudged.slice(18).concat(nudged.slice(0, 18)); //this is to hide the end point behind a port (aesthetics)
  return buildSmoothPath(rotated);
};

const Island = ({ gridWidth, gridHeight, hexTiles, radius, ports, idToVertexMap }) => {
  const baseAmplitude = 0.2;
  const islandClipPath = useMemo(() => generateIslandClipPath(hexTiles, radius, radius * baseAmplitude), [hexTiles, radius]);
  const ripples = useMemo(() => {
    const colours = ["#4BC7CF", "#3CB7CB", "#2DA7C7", "#1E97C4", "#0F7AC0"];
    const amplitudes = [0.3, 0.4, 0.5, 0.6, 0.7];

    return amplitudes.map((amplitude, i) => {
      const clipPath = generateIslandClipPath(hexTiles, radius, radius * amplitude);

      return (
        <div
          className="animate-pulse"
          key={i}
          style={{
            position: "absolute",
            width: gridWidth,
            height: gridHeight,
            clipPath,
            WebkitClipPath: clipPath,
            backgroundColor: colours[i] ?? "#0F7AC0",
            zIndex: -1 * (i + 1),
            pointerEvents: "none",
          }}
        />
      );
    });
  }, [hexTiles, radius, gridWidth, gridHeight]);

  return (
    <div style={{ position: "relative", zIndex: -1 }}>
      <div style={{ position: "absolute", width: gridWidth, height: gridHeight, clipPath: islandClipPath, WebkitClipPath: islandClipPath, backgroundColor: "moccasin", zIndex: 3 }} />
      {ripples}
      {ports.map((port, i) => {
        const coord = idToVertexMap.get(port.vertex);
        if (!coord) return null;

        const [x, y] = coord;
        const angle = port.angle;

        const dockWidth = radius * 0.25;
        const dockHeight = radius * 0.5;

        return (
          <img
            key={`dock-${i}`}
            src="/images/signs/dock.png"
            style={{
              position: "absolute",
              left: x - dockWidth / 2,
              top: y - dockHeight / 2,
              width: dockWidth,
              height: dockHeight,
              transform: `rotate(${angle}deg)`,
              transformOrigin: "center center",
              pointerEvents: "none",
              zIndex: 3,
            }}
            alt={`${port.type} dock`}
          />
        );
      })}
    </div>
  );
};

export default Island;
