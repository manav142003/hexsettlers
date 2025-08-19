//HexTile component: one of the 19 hexagonal resource tiles on the Catan game board.

export const getHexVertices = (cx, cy, radius) => {
  //returns the locations for all 6 vertices given the center x and center y values
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return [x, y];
  });
};

export const HexTile = ({ cx, cy, radius, imageURL, id }) => {
  //calculate the 6 vertices of the hex tile, centered in an SVG (so we use radius for the center)
  const points = getHexVertices(radius, radius, radius)
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  //return an svg polygon using those points
  return (
    <svg width={radius * 2} height={radius * 2} style={{ position: "absolute", left: `${cx - radius}px`, top: `${cy - radius}px`, overflow: "visible" }}>
      <defs>
        <pattern id={`hex-pattern-${id}`} patternUnits="userSpaceOnUse" width={radius * 2} height={radius * 2}>
          <image href={imageURL} x="0" y="0" width={radius * 2} height={radius * 2} preserveAspectRatio="xMidYMid slice" />
        </pattern>
      </defs>
      <polygon points={points} fill={`url(#hex-pattern-${id})`} stroke="white" />
    </svg>
  );
};
