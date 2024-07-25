import { transit_realtime } from 'gtfs-realtime-bindings';

export async function onRequest(context) {
  const url = 'http://kumagaya.bus-go.com/GTFS-RT/encode_vehicle.php';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const arrayBuffer = await response.arrayBuffer();
    const data = transit_realtime.FeedMessage.decode(new Uint8Array(arrayBuffer));
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Error: ' + error.message, { status: 500 });
  }
}

