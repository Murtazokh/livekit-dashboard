import { Room } from '../../core/domain/Room';

export const activeRoom: Room = {
  sid: 'RM_TEST123',
  name: 'test-room',
  emptyTimeout: 300,
  maxParticipants: 50,
  creationTime: Date.now() - 3600000, // 1 hour ago
  turnPassword: '',
  enabledCodecs: [],
  metadata: '',
  numParticipants: 5,
  numPublishers: 2,
  activeRecording: false,
};

export const closedRoom: Room = {
  sid: 'RM_CLOSED456',
  name: 'closed-room',
  emptyTimeout: 300,
  maxParticipants: 50,
  creationTime: Date.now() - 7200000, // 2 hours ago
  turnPassword: '',
  enabledCodecs: [],
  metadata: '',
  numParticipants: 0,
  numPublishers: 0,
  activeRecording: false,
};

export const roomWithParticipants: Room = {
  sid: 'RM_WITHPART789',
  name: 'room-with-participants',
  emptyTimeout: 300,
  maxParticipants: 50,
  creationTime: Date.now() - 1800000, // 30 minutes ago
  turnPassword: '',
  enabledCodecs: [],
  metadata: '{"description": "Test room with participants"}',
  numParticipants: 10,
  numPublishers: 4,
  activeRecording: true,
};

export const emptyRoom: Room = {
  sid: 'RM_EMPTY999',
  name: 'empty-room',
  emptyTimeout: 300,
  maxParticipants: 50,
  creationTime: Date.now() - 300000, // 5 minutes ago
  turnPassword: '',
  enabledCodecs: [],
  metadata: '',
  numParticipants: 0,
  numPublishers: 0,
  activeRecording: false,
};

export const roomWithSpecialChars: Room = {
  sid: 'RM_SPECIAL001',
  name: 'test room with spaces & special-chars',
  emptyTimeout: 300,
  maxParticipants: 50,
  creationTime: Date.now() - 900000, // 15 minutes ago
  turnPassword: '',
  enabledCodecs: [],
  metadata: '',
  numParticipants: 3,
  numPublishers: 1,
  activeRecording: false,
};

export const roomFixtures = {
  activeRoom,
  closedRoom,
  roomWithParticipants,
  emptyRoom,
  roomWithSpecialChars,
};
