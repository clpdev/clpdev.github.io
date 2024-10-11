import { transit_realtime } from 'gtfs-realtime-bindings';

export async function onRequest(context) {
  const url = 'http://kumagaya.bus-go.com/GTFS-RT/encode_vehicle.php'; // Vehicle position endpoint

  console.log('Request URL:', url);

  try {
    const response = await fetch(url);
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const buffer = await response.arrayBuffer();
    console.log('Data received, length:', buffer.byteLength);
    const feedMessage = transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    console.log('Decoded data:', feedMessage);

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
    console.error('Error occurred:', error.message);
    return new Response('Error: ' + error.message, { status: 500 });
  }
}
