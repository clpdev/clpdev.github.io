import gtfsRealtimeBindings from 'https://cdn.jsdelivr.net/npm/gtfs-realtime-bindings@1.1.1/+esm';

export async function onRequest(context) {
    const url = 'http://kumagaya.bus-go.com/GTFS-RT/encode_vehicle.php';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const arrayBuffer = await response.arrayBuffer();
        const data = gtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(arrayBuffer));
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response('Error: ' + error.message, { status: 500 });
    }
}

