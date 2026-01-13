import { Participant, ParticipantState } from '../../core/domain/Participant';

export const activeParticipant: Participant = {
  sid: 'PA_ACTIVE001',
  identity: 'user1',
  state: ParticipantState.ACTIVE,
  tracks: [
    {
      sid: 'TR_VIDEO001',
      type: 'video',
      source: 'camera',
    },
    {
      sid: 'TR_AUDIO001',
      type: 'audio',
      source: 'microphone',
    },
  ],
  metadata: '{"name": "John Doe"}',
  joinedAt: Date.now() - 600000, // 10 minutes ago
  name: 'John Doe',
  version: 1,
  permission: {
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    hidden: false,
    recorder: false,
  },
};

export const disconnectedParticipant: Participant = {
  sid: 'PA_DISCONN002',
  identity: 'user2',
  state: ParticipantState.DISCONNECTED,
  tracks: [],
  metadata: '{"name": "Jane Smith"}',
  joinedAt: Date.now() - 1200000, // 20 minutes ago
  name: 'Jane Smith',
  version: 1,
  permission: {
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    hidden: false,
    recorder: false,
  },
};

export const publisherParticipant: Participant = {
  sid: 'PA_PUBLISH003',
  identity: 'publisher1',
  state: ParticipantState.ACTIVE,
  tracks: [
    {
      sid: 'TR_VIDEO002',
      type: 'video',
      source: 'camera',
    },
    {
      sid: 'TR_AUDIO002',
      type: 'audio',
      source: 'microphone',
    },
    {
      sid: 'TR_SCREEN001',
      type: 'video',
      source: 'screen_share',
    },
  ],
  metadata: '{"role": "presenter"}',
  joinedAt: Date.now() - 300000, // 5 minutes ago
  name: 'Presenter',
  version: 1,
  permission: {
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    hidden: false,
    recorder: false,
  },
};

export const subscriberParticipant: Participant = {
  sid: 'PA_SUBSCR004',
  identity: 'subscriber1',
  state: ParticipantState.ACTIVE,
  tracks: [],
  metadata: '{"role": "viewer"}',
  joinedAt: Date.now() - 180000, // 3 minutes ago
  name: 'Viewer',
  version: 1,
  permission: {
    canPublish: false,
    canSubscribe: true,
    canPublishData: false,
    hidden: false,
    recorder: false,
  },
};

export const joiningParticipant: Participant = {
  sid: 'PA_JOINING005',
  identity: 'user3',
  state: ParticipantState.JOINING,
  tracks: [],
  metadata: '',
  joinedAt: Date.now() - 5000, // 5 seconds ago
  name: '',
  version: 1,
  permission: {
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    hidden: false,
    recorder: false,
  },
};

export const participantFixtures = {
  activeParticipant,
  disconnectedParticipant,
  publisherParticipant,
  subscriberParticipant,
  joiningParticipant,
};
