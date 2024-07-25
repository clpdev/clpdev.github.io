import { transit_realtime } from 'gtfs-realtime-bindings';

export async function onRequest(context) {
  const url = 'http://kumagaya.bus-go.com/GTFS-RT/encode_vehicle.php';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const buffer = await response.arrayBuffer();
    const data = transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
    const jsonData = JSON.stringify(data);

    return new Response(jsonData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}