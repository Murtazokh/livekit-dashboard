import { Request, Response, NextFunction } from 'express';
import { LiveKitService } from '../services/livekitService';

export class ParticipantsController {
  constructor(private livekitService: LiveKitService) {}

  async listParticipants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roomName } = req.params;

      if (!roomName) {
        res.status(400).json({
          success: false,
          error: 'Room name is required',
        });
        return;
      }

      const participants = await this.livekitService.listParticipants(roomName);
      res.json({
        success: true,
        data: participants,
      });
    } catch (error) {
      next(error);
    }
  }
}