import { NextRequest } from 'next/server';

// Simple in-memory clients map (for demo only)
const clients = new Map<number, WritableStreamDefaultWriter>();

function sendToClient(writer: WritableStreamDefaultWriter, data: any) {
  writer.write(`data: ${JSON.stringify(data)}\n\n`);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chadcoCustomerId = Number(searchParams.get('chadcoCustomerId'));

  if (!chadcoCustomerId) {
    return new Response(JSON.stringify({ error: 'Missing chadcoCustomerId' }), { status: 400 });
  }

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const write = (data: string) => controller.enqueue(encoder.encode(data));

      // initial retry
      write('retry: 5000\n\n');
      write(`: connected to SSE for customer ${chadcoCustomerId}\n\n`);

      // heartbeat every 15 seconds
      const heartbeat = setInterval(() => {
        write(`data: ${JSON.stringify({ type: 'heartbeat', time: Date.now() })}\n\n`);
      }, 15000);

      // save this client's writer
      const writer = {
        write: (text: string) => write(text),
        close: () => controller.close(),
      } as unknown as WritableStreamDefaultWriter;
      clients.set(chadcoCustomerId, writer);

      // cleanup when closed
      const close = () => {
        clearInterval(heartbeat);
        clients.delete(chadcoCustomerId);
        try {
          controller.close();
        } catch {}
      };

      req.signal.addEventListener('abort', close);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

// Simple helper you can import to push data to a customer stream
export function pushCartUpdate(customerId: number, itemCount: number) {
  const client = clients.get(customerId);
  if (client) {
    client.write(`data: ${JSON.stringify({ itemCount })}\n\n`);
  }
}
