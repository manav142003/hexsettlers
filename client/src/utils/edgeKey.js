const edgeKey = (a, b) => {
  //round each vertex coordinates to 2 decimal places and store in an array
  const [ax, ay] = a.map((n) => n.toFixed(2));
  const [bx, by] = b.map((n) => n.toFixed(2));

  //create a string key for each of the coordinate pairs
  const key1 = `${ax},${ay}`;
  const key2 = `${bx},${by}`;

  //treat keys the same regardless of whether the greater vertex comes first (to avoid duplicate buttons)
  return key1 < key2 ? `${key1}|${key2}` : `${key2}|${key1}`;
};

export default edgeKey;
