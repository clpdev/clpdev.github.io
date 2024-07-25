import { GTFSRealtimeBindings } from 'gtfs-realtime-bindings';
import fetch from 'node-fetch';

export default {
  async fetch(req) {
    // GTFS-RTデータを取得するURL
    const url = 'http://kumagaya.bus-go.com/GTFS-RT/encode_vehicle.php';
    
    try {
      // データを取得
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // レスポンスをバイナリ形式で取得
      const buffer = await response.arrayBuffer();
      
      // バイナリデータをJSONに変換
      const data = GTFSRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
      const jsonData = JSON.stringify(data);
      
      // JSONレスポンスを返す
      return new Response(jsonData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response('Error: ' + error.message, { status: 500 });
    }
  }
};
