
import PusherServer from 'pusher';
import { Request, Response } from 'express';

export type PusherAuthRequest = Request & {
  body: { channel_name: string; socket_id: string };
};

// In a real project, these would be environment variables
const pusherServer = new PusherServer({
  appId: import.meta.env.VITE_PUSHER_APP_ID || 'app-id',
  key: import.meta.env.VITE_PUSHER_KEY || 'key',
  secret: import.meta.env.VITE_PUSHER_SECRET || 'secret',
  cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'us2',
  useTLS: true,
});

export default function handler(req: Request, res: Response) {
  const { socket_id, channel_name } = (req as PusherAuthRequest).body;

  // In a real app, you would check the user's authentication status here
  const presenceData = {
    user_id: 'user-123', // This would come from your auth system
    user_info: {
      name: 'Example User',
    },
  };

  try {
    // Auth endpoint for private and presence channels
    const auth = pusherServer.authorizeChannel(socket_id, channel_name, presenceData);
    res.status(200).json(auth);
  } catch (error) {
    console.error('Pusher auth error:', error);
    res.status(500).json({ error: 'Failed to authorize Pusher channel' });
  }
}

// Additional endpoint for triggering events
export function triggerEvent(req: Request, res: Response) {
  const { channel, event, data } = req.body;

  try {
    pusherServer.trigger(channel, event, data);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to trigger Pusher event:', error);
    res.status(500).json({ error: 'Failed to trigger event' });
  }
}
