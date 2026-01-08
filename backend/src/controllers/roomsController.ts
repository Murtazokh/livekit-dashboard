import { Request, Response, NextFunction } from 'express';
import { LiveKitService } from '../services/livekitService';

export class RoomsController {
  constructor(private livekitService: LiveKitService) {}

  async listRooms(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rooms = await this.livekitService.listRooms();
      res.json({
        success: true,
        data: rooms,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRoomDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roomName } = req.params;

      if (!roomName) {
        res.status(400).json({
          success: false,
          error: 'Room name is required',
        });
        return;
      }

      const room = await this.livekitService.getRoomDetails(roomName);

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
  }
}