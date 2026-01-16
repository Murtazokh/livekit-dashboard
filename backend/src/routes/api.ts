import express from 'express';
import { LiveKitService } from '../services/livekitService';
import { rateLimit } from '../middleware/rateLimit';
import { validateConfig } from '../middleware/validateConfig';
import { extractLiveKitConfig } from '../middleware/extractLiveKitConfig';

const router = express.Router();

// GET /api/health - health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/config/validate - validate LiveKit configuration
router.post('/config/validate', validateConfig, rateLimit, async (req, res) => {
  try {
    const { host, apiKey, apiSecret } = req.body;

    if (!host || !apiKey || !apiSecret) {
      res.status(400).json({
        success: false,
        error: 'Host, API key, and API secret are required',
      });
      return;
    }

    // Test connection by trying to list rooms
    const testService = new LiveKitService({ host, apiKey, apiSecret });
    await testService.listRooms();

    res.json({
      success: true,
      message: 'Configuration is valid',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid configuration or unable to connect to LiveKit server',
    });
  }
});

// GET /api/rooms - list all rooms
router.get('/rooms', extractLiveKitConfig, rateLimit, async (req, res, next) => {
  try {
    const config = req.livekitConfig || {
      host: process.env.LIVEKIT_HOST || 'http://localhost:7880',
      apiKey: process.env.LIVEKIT_API_KEY || 'devkey',
      apiSecret: process.env.LIVEKIT_API_SECRET || 'secret',
    };

    const service = new LiveKitService(config);
    const rooms = await service.listRooms();

    res.json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/rooms/:roomName - get room details
router.get('/rooms/:roomName', extractLiveKitConfig, rateLimit, async (req, res, next) => {
  try {
    const { roomName } = req.params;
    const config = req.livekitConfig || {
      host: process.env.LIVEKIT_HOST || 'http://localhost:7880',
      apiKey: process.env.LIVEKIT_API_KEY || 'devkey',
      apiSecret: process.env.LIVEKIT_API_SECRET || 'secret',
    };

    if (!roomName) {
      res.status(400).json({
        success: false,
        error: 'Room name is required',
      });
      return;
    }

    const service = new LiveKitService(config);
    const room = await service.getRoomDetails(roomName);

    if (!room) {
      res.status(404).json({
        success: false,
        error: 'Room not found',
      });
      return;
    }

    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/rooms/:roomName/participants - list participants in a room
router.get('/rooms/:roomName/participants', extractLiveKitConfig, rateLimit, async (req, res, next) => {
  try {
    const { roomName } = req.params;
    const config = req.livekitConfig || {
      host: process.env.LIVEKIT_HOST || 'http://localhost:7880',
      apiKey: process.env.LIVEKIT_API_KEY || 'devkey',
      apiSecret: process.env.LIVEKIT_API_SECRET || 'secret',
    };

    if (!roomName) {
      res.status(400).json({
        success: false,
        error: 'Room name is required',
      });
      return;
    }

    const service = new LiveKitService(config);
    const participants = await service.listParticipants(roomName);

    res.json({
      success: true,
      data: participants,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/rooms/:roomName/agents - list agents in a room
router.get('/rooms/:roomName/agents', extractLiveKitConfig, rateLimit, async (req, res, next) => {
  try {
    const { roomName } = req.params;
    const config = req.livekitConfig || {
      host: process.env.LIVEKIT_HOST || 'http://localhost:7880',
      apiKey: process.env.LIVEKIT_API_KEY || 'devkey',
      apiSecret: process.env.LIVEKIT_API_SECRET || 'secret',
    };

    if (!roomName) {
      res.status(400).json({
        success: false,
        error: 'Room name is required',
      });
      return;
    }

    const service = new LiveKitService(config);
    const agents = await service.getAgents(roomName);

    res.json({
      success: true,
      data: agents,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/rooms/:roomName/token - generate access token for room connection
router.post('/rooms/:roomName/token', extractLiveKitConfig, rateLimit, async (req, res, next) => {
  try {
    const { roomName } = req.params;
    const { participantIdentity, participantName } = req.body;
    const config = req.livekitConfig || {
      host: process.env.LIVEKIT_HOST || 'http://localhost:7880',
      apiKey: process.env.LIVEKIT_API_KEY || 'devkey',
      apiSecret: process.env.LIVEKIT_API_SECRET || 'secret',
    };

    if (!roomName) {
      res.status(400).json({
        success: false,
        error: 'Room name is required',
      });
      return;
    }

    if (!participantIdentity) {
      res.status(400).json({
        success: false,
        error: 'Participant identity is required',
      });
      return;
    }

    const service = new LiveKitService(config);
    const token = await service.generateToken(roomName, participantIdentity, participantName);

    res.json({
      success: true,
      data: {
        token,
        serverUrl: config.host,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/agents - list all agent dispatches across all rooms
router.get('/agents', extractLiveKitConfig, rateLimit, async (req, res, next) => {
  try {
    const config = req.livekitConfig || {
      host: process.env.LIVEKIT_HOST || 'http://localhost:7880',
      apiKey: process.env.LIVEKIT_API_KEY || 'devkey',
      apiSecret: process.env.LIVEKIT_API_SECRET || 'secret',
    };

    const service = new LiveKitService(config);
    const agents = await service.getAllAgentDispatches();

    console.log(`Found ${agents.length} agents across all rooms`);

    res.json({
      success: true,
      data: agents,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/agents/dispatch - create a new agent dispatch
router.post('/agents/dispatch', extractLiveKitConfig, rateLimit, async (req, res, next) => {
  try {
    const { roomName, agentName, metadata } = req.body;
    const config = req.livekitConfig || {
      host: process.env.LIVEKIT_HOST || 'http://localhost:7880',
      apiKey: process.env.LIVEKIT_API_KEY || 'devkey',
      apiSecret: process.env.LIVEKIT_API_SECRET || 'secret',
    };

    if (!roomName) {
      res.status(400).json({
        success: false,
        error: 'Room name is required',
      });
      return;
    }

    if (!agentName) {
      res.status(400).json({
        success: false,
        error: 'Agent name is required',
      });
      return;
    }

    const service = new LiveKitService(config);
    const dispatch = await service.createAgentDispatch(roomName, agentName, metadata);

    res.json({
      success: true,
      data: dispatch,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/agents/dispatch/:dispatchId - delete an agent dispatch
router.delete('/agents/dispatch/:dispatchId', extractLiveKitConfig, rateLimit, async (req, res, next) => {
  try {
    const { dispatchId } = req.params;
    const { roomName } = req.body;
    const config = req.livekitConfig || {
      host: process.env.LIVEKIT_HOST || 'http://localhost:7880',
      apiKey: process.env.LIVEKIT_API_KEY || 'devkey',
      apiSecret: process.env.LIVEKIT_API_SECRET || 'secret',
    };

    if (!dispatchId) {
      res.status(400).json({
        success: false,
        error: 'Dispatch ID is required',
      });
      return;
    }

    if (!roomName) {
      res.status(400).json({
        success: false,
        error: 'Room name is required',
      });
      return;
    }

    const service = new LiveKitService(config);
    await service.deleteAgentDispatch(dispatchId, roomName);

    res.json({
      success: true,
      message: 'Agent dispatch deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;