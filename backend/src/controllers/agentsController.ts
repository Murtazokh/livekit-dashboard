import { Request, Response, NextFunction } from 'express';
import { LiveKitService } from '../services/livekitService';

export class AgentsController {
  constructor(private livekitService: LiveKitService) {}

  async listAgents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roomName } = req.params;

      if (!roomName) {
        res.status(400).json({
          success: false,
          error: 'Room name is required',
        });
        return;
      }

      const agents = await this.livekitService.getAgents(roomName);
      res.json({
        success: true,
        data: agents,
      });
    } catch (error) {
      next(error);
    }
  }
}