import { transit_realtime } from 'gtfs-realtime-bindings';

export async function onRequest(context) {
  const url = 'http://kumagaya.bus-go.com/GTFS-RT/encode_vehicle.php'; // Vehicle position endpoint

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const buffer = await response.arrayBuffer();
    const feedMessage = transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

    // Vehicle Positionsだけを抽出
    const vehiclePositions = feedMessage.entity
      .filter(entity => entity.vehicle)
      .map(entity => entity.vehicle);

    // JSON形式でVehicle Positionsだけを返す
    const jsonData = JSON.stringify(vehiclePositions);

    return new Response(jsonData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}
