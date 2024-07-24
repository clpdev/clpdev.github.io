let map;

async function fetchJSON(url) {
  const response = await fetch(url);
  return response.json();
}

async function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 36.1389, lng: 139.388697 },
    zoom: 13
  });

  const shapesData = await fetchJSON('/assets/js/shapes_data.json');
  const routesData = await fetchJSON('/assets/js/routes_data.json');

  drawShapes(shapesData.shapes, routesData.routes);
}

function drawShapes(shapes, routes) {
  const shapesMap = new Map();
  const routesMap = new Map();

  // routesデータをroute_idごとにマップ化
  routes.forEach(route => {
    routesMap.set(route.route_id, route.route_color);
  });

  // shapesデータをshape_idごとにグループ化
  shapes.forEach(shape => {
    const shapeId = shape.shape_id;
    if (!shapesMap.has(shapeId)) {
      shapesMap.set(shapeId, []);
    }
    shapesMap.get(shapeId).push({
      lat: parseFloat(shape.shape_pt_lat),
      lng: parseFloat(shape.shape_pt_lon),
      sequence: parseInt(shape.shape_pt_sequence, 10)
    });
  });

  // shape_idごとに線を描画
  shapesMap.forEach((shapePoints, shapeId) => {
    // shape_pt_sequenceの順にソート
    shapePoints.sort((a, b) => a.sequence - b.sequence);

    // 線を描画
    const path = shapePoints.map(point => ({ lat: point.lat, lng: point.lng }));

    // route_colorを取得
    const routeColor = routesMap.get(shapeId) || '#FF0000'; // デフォルト色を設定

    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: `#${routeColor}`,
      strokeOpacity: 1.0,
      strokeWeight: 6
    });

    polyline.setMap(map);
  });
}

window.initMap = initMap;
