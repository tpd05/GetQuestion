export async function onRequestGet() {
  return new Response(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }), {
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}


