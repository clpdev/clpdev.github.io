let map;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded eventが発生しました');

  // Google Maps APIスクリプトを動的に追加
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${window.googleMapsApiKey}&callback=initMap&_=${new Date().getTime()}`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});

async function fetchJSON(url) {
  const response = await fetch(url);
  return response.json();
}

async function initMap() {
  console.log('initMap関数が呼ばれました');
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 36.1389, lng: 139.388697 },
    zoom: 13
  });

  try {
    const shapesData = await fetchJSON('/assets/js/shapes_data.json');
    const routesData = await fetchJSON('/assets/js/routes_data.json');

    drawShapes(shapesData.shapes, routesData.routes);
  } catch (error) {
    console.error('Error fetching shapes or routes data:', error);
  }
  
  // 最初にデータをフェッチ
  fetchData();
  // 30秒ごとにデータをフェッチ
  setInterval(fetchData, 10000);
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

async function fetchData() {
  try {
    const response = await fetch('/fetch-gtfs-data');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    displayMarkers(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayMarkers(data) {
  // 現在のマーカーをクリア
  clearMarkers();

  const entities = data.entity;
  entities.forEach(entity => {
    const position = entity.vehicle.position;
    const latLng = new google.maps.LatLng(position.latitude, position.longitude);

    const marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: entity.vehicle.vehicle.id
    });

    markers.push(marker);
  });
}

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

window.initMap = initMap;
