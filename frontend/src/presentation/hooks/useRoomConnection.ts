import { useEffect, useState, useCallback, useRef } from 'react';
import { Room, RoomEvent, RemoteParticipant } from 'livekit-client';
import type { TranscriptionSegment, Participant, TrackPublication } from 'livekit-client';

export interface TranscriptionDisplay {
  id: string;
  participantId: string;
  participantName: string;
  text: string;
  isFinal: boolean;
  timestamp: Date;
  trackId?: string;
}

interface UseRoomConnectionProps {
  roomName: string;
  serverUrl: string;
  token: string;
  onTranscription?: (segment: TranscriptionDisplay) => void;
}

interface UseRoomConnectionResult {
  room: Room | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  participants: RemoteParticipant[];
  transcriptions: TranscriptionDisplay[];
  disconnect: () => void;
}

/**
 * Hook to connect to a LiveKit room and listen to real-time transcriptions
 * Uses RoomEvent.TranscriptionReceived event to receive transcription segments
 */
export const useRoomConnection = ({
  roomName,
  serverUrl,
  token,
  onTranscription,
}: UseRoomConnectionProps): UseRoomConnectionResult => {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [transcriptions, setTranscriptions] = useState<TranscriptionDisplay[]>([]);

  const transcriptionsRef = useRef<Map<string, TranscriptionDisplay>>(new Map());

  const disconnect = useCallback(() => {
    if (room) {
      room.disconnect();
      setRoom(null);
      setIsConnected(false);
      setParticipants([]);
      setTranscriptions([]);
      transcriptionsRef.current.clear();
    }
  }, [room]);

  useEffect(() => {
    if (!roomName || !serverUrl || !token) {
      return;
    }

    let mounted = true;
    const newRoom = new Room();

    const connectToRoom = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        // Connect to the room
        await newRoom.connect(serverUrl, token);

        if (!mounted) {
          newRoom.disconnect();
          return;
        }

        setRoom(newRoom);
        setIsConnected(true);
        setIsConnecting(false);

        // Update participants list
        setParticipants(Array.from(newRoom.remoteParticipants.values()));

        // Listen to participant changes
        newRoom.on(RoomEvent.ParticipantConnected, () => {
          setParticipants(Array.from(newRoom.remoteParticipants.values()));
        });

        newRoom.on(RoomEvent.ParticipantDisconnected, () => {
          setParticipants(Array.from(newRoom.remoteParticipants.values()));
        });

        // Register transcription event handler
        // Based on LiveKit docs: room.on(RoomEvent.TranscriptionReceived, callback)
        const handleTranscription = (
          segments: TranscriptionSegment[],
          participant?: Participant,
          publication?: TrackPublication
        ) => {
          if (!mounted) return;

          console.log('Transcription received:', segments, participant?.identity);

          segments.forEach((segment) => {
            const displaySegment: TranscriptionDisplay = {
              id: segment.id,
              participantId: participant?.identity || 'unknown',
              participantName: participant?.name || participant?.identity || 'Unknown',
              text: segment.text,
              isFinal: segment.final,
              timestamp: new Date(),
              trackId: publication?.trackSid,
            };

            // Update or add segment (interim segments get updated with final)
            transcriptionsRef.current.set(segment.id, displaySegment);

            // Call optional callback
            if (onTranscription) {
              onTranscription(displaySegment);
            }
          });

          // Update state with all transcriptions
          setTranscriptions(Array.from(transcriptionsRef.current.values()));
        };

        newRoom.on(RoomEvent.TranscriptionReceived, handleTranscription);

        newRoom.on(RoomEvent.Disconnected, () => {
          if (mounted) {
            setIsConnected(false);
            setParticipants([]);
          }
        });

      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to connect to room'));
          setIsConnecting(false);
        }
      }
    };

    connectToRoom();

    return () => {
      mounted = false;
      if (newRoom) {
        newRoom.disconnect();
      }
    };
  }, [roomName, serverUrl, token, onTranscription]);

  return {
    room,
    isConnected,
    isConnecting,
    error,
    participants,
    transcriptions,
    disconnect,
  };
};
