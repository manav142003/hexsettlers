import RoadButton from "./RoadButton";
import SettlementButton from "./SettlementButton";
import TileButton from "./TileButton";
import edgeKey from "../utils/edgeKey";
import Island from "./Island";
import { HexTile, getHexVertices } from "./HexTile";
import { useMemo, useState, useEffect } from "react";
import { useSocket } from "../context/WebSocketContext";
import { useWindowSize } from "../hooks/useWindowSize";

const GameBoard = ({ gameState, isYourTurn }) => {
  const { subscribe } = useSocket();
  const { width } = useWindowSize();
  const [validRoads, setValidRoads] = useState([]); //sets valid road placement options
  const [validSettlements, setValidSettlements] = useState([]); //sets valid settlement placement options
  const [validCities, setValidCities] = useState([]); //sets valid city placement options
  const [validTiles, setValidTiles] = useState([]); //sets valid robber tile placements

  const radius = useMemo(() => {
    const minWidth = 400;
    const maxWidth = 1700;
    const minRadius = 30;
    const maxRadius = 90;

    const clampedWidth = Math.max(minWidth, Math.min(width, maxWidth));
    const scale = (clampedWidth - minWidth) / (maxWidth - minWidth);
    return minRadius + scale * (maxRadius - minRadius);
  }, [width]);

  useEffect(() => {
    const unsubRoadPrompt = subscribe("roadPrompt", (data) => {
      setValidRoads(data.validRoads); //prompt road placement by displaying valid placement options
    });

    const unsubSettlementPrompt = subscribe("settlementPrompt", (data) => {
      setValidSettlements(data.validSettlements); //prompt settlement placement by displaying valid placement options
    });

    const unsubCityPrompt = subscribe("cityPrompt", (data) => {
      setValidCities(data.validCities); //prompt city placement by displaying valid placement options
    });

    const unsubPlaceRobberPrompt = subscribe("placeRobberPrompt", (data) => {
      setValidTiles(data.validRobberPlacements); //prompt robber placement by displaying valid placement options
    });

    return () => {
      unsubRoadPrompt();
      unsubSettlementPrompt();
      unsubCityPrompt();
      unsubPlaceRobberPrompt();
    };
  }, [subscribe]);

  const vertexToOwner = useMemo(() => {
    const map = {};
    for (const [uuid, player] of Object.entries(gameState.players)) {
      for (const settlement of player.settlements) map[settlement] = uuid;
      for (const city of player.cities) map[city] = uuid;
    }
    return map;
  }, [gameState.players]);

  const roadToOwner = useMemo(() => {
    const map = {};
    for (const [uuid, player] of Object.entries(gameState.players)) {
      for (const [a, b] of player.roads) {
        const key = [Math.min(a, b), Math.max(a, b)].join("-");
        map[key] = uuid;
      }
    }
    return map;
  }, [gameState.players]);

  const getStructureType = (owner, location) => {
    //determine whether the type of the structure is a settlement or a city (or neither)
    let structureType = null;
    if (owner !== undefined) {
      const player = gameState.players[owner];
      if (player.settlements.includes(location)) structureType = "settlement";
      else if (player.cities.includes(location)) structureType = "city";
    }
    return structureType;
  };

  const ports = gameState.board.ports;
  const action = gameState.action;
  //calculate the horizontal and vertical spacing between the centers of the hex tiles
  const rows = [3, 4, 5, 4, 3];
  const verticalSpacing = radius * 1.5;
  const horizontalSpacing = radius * Math.sqrt(3);

  //calculate the height/width of the entire HexGrid to center it evenly in the div
  //4 is (largestRow - 1), radius * 2 is to account for the half-hex on each side/top/bottom
  const marginBuffer = radius * 0.5;
  const gridHeight = 4 * verticalSpacing + radius * 2 + marginBuffer * 2;
  const gridWidth = 4 * horizontalSpacing + radius * 2 + marginBuffer * 2;

  const hexTiles = [];
  const vertexMap = new Map(); //holds the coordinates of the vertex
  const vertexIdMap = new Map(); //holds the ID of the vertex
  const edgeMap = new Map(); //holds the coordinates of the edges
  rows.forEach((hexCount, rowIndex) => {
    const y = marginBuffer + radius + rowIndex * verticalSpacing; //get the vertical position for the HexTiles in this row (using radius to offset)
    const rowWidth = (hexCount - 1) * horizontalSpacing; //calculate the width of the current row based on the amount of hex tiles
    const offsetX = marginBuffer + (gridWidth - marginBuffer * 2 - rowWidth) / 2; //calculate the offset to center the rows horizontally

    for (let col = 0; col < hexCount; col++) {
      //place each hexagon at its x,y center using the calculated offset
      const x = offsetX + col * horizontalSpacing;
      hexTiles.push({ x, y });

      //get the vertices for the current tile and add it to the set if it hasn't been added yet
      const vertices = getHexVertices(x, y, radius);
      vertices.forEach(([vx, vy]) => {
        const key = `${vx.toFixed(2)},${vy.toFixed(2)}`;
        if (!vertexMap.has(key)) {
          vertexMap.set(key, { x: vx, y: vy });
          vertexIdMap.set(key, vertexIdMap.size);
        }
      });

      for (let i = 0; i < 6; i++) {
        //grab one edge of the hex at a time and store the endpoints in a and b, then get the key for that edge.
        const a = vertices[i];
        const b = vertices[(i + 1) % 6];
        const key = edgeKey(a, b);

        //if the edge map does not already contain the key, add it to the map
        if (!edgeMap.has(key)) edgeMap.set(key, { a, b });
      }
    }
  });

  const idToVertexMap = useMemo(() => {
    const map = new Map();
    vertexIdMap.forEach((id, key) => {
      const [x, y] = key.split(",").map(Number);
      map.set(id, [x, y]);
    });
    return map;
  }, [vertexIdMap]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* the grid, vertex buttons, and edge buttons are positioned absolutely to the outermost relatively positioned div here. */}
      <div style={{ position: "relative", width: gridWidth, height: gridHeight }}>
        <Island gridWidth={gridWidth} gridHeight={gridHeight} radius={radius} hexTiles={hexTiles} ports={ports} idToVertexMap={idToVertexMap} />

        <div style={{ zIndex: 1 }}>
          {/* positioning the hex tiles */}
          {hexTiles.map(({ x, y }, i) => {
            const tile = gameState.board.tiles[i];
            const imageURL = `/images/${tile.type}.png`;
            return <HexTile key={i} cx={x} cy={y} radius={radius - radius / 10} imageURL={imageURL} id={tile.id} />;
          })}

          {/* positioning the tile buttons (for robber placement) */}
          <div style={{ position: "absolute", width: gridWidth, height: gridHeight, top: 0, left: 0, pointerEvents: "none" }}>
            {hexTiles.map(({ x, y }, i) => {
              const tile = gameState.board.tiles[i];
              const isEnabled = isYourTurn && action === "robber" && validTiles.includes(i);
              return <TileButton radius={radius} key={`tile-${i}`} hasRobber={tile.hasRobber} coords={{ x, y }} number={tile.number} tileId={i} disabled={!isEnabled} />;
            })}
          </div>

          {/* positioning the settlement/vertex buttons */}
          <div style={{ position: "absolute", width: gridWidth, height: gridHeight, top: 0, left: 0, pointerEvents: "none" }}>
            {[...vertexMap.values()].map(({ x, y }, i) => {
              const isEnabled = ((action === "settlement" && validSettlements.includes(i)) || (action === "city" && validCities.includes(i))) && isYourTurn;
              const owner = vertexToOwner[i];
              const ownerId = gameState.turnOrder.indexOf(owner);
              return <SettlementButton radius={radius} key={i} settlementId={i} coords={{ x, y }} disabled={!isEnabled} owner={ownerId} mode={action} structureType={getStructureType(owner, i)} />;
            })}
          </div>

          {/* positioning the road/edge buttons */}
          <div style={{ position: "absolute", width: gridWidth, height: gridHeight, top: 0, left: 0, pointerEvents: "none" }}>
            {[...edgeMap.values()].map(({ a, b }, i) => {
              const key = edgeKey(a, b);
              const from = vertexIdMap.get(`${a[0].toFixed(2)},${a[1].toFixed(2)}`);
              const to = vertexIdMap.get(`${b[0].toFixed(2)},${b[1].toFixed(2)}`);
              const isEnabled = action === "road" && isYourTurn && validRoads.some(([a, b]) => (a === from && b === to) || (a === to && b === from));
              const owner = roadToOwner[[Math.min(from, to), Math.max(from, to)].join("-")];
              const ownerId = gameState.turnOrder.indexOf(owner);
              return <RoadButton radius={radius} key={key} from={from} to={to} coords={{ a, b }} disabled={!isEnabled} owner={ownerId} setValidRoads={setValidRoads} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
