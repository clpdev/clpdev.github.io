import { transit_realtime } from 'gtfs-realtime-bindings';
import fetch from 'node-fetch';

export function onRequest(context) {
  const url = 'http://kumagaya.bus-go.com/GTFS-RT/encode_vehicle.php';
  
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.arrayBuffer();
    })
    .then(buffer => {
      const data = transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    })
    .catch(error => {
      return new Response('Error: ' + error.message, { status: 500 });
    });
}

