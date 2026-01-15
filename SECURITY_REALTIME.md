# Real-Time Updates Security Guide

## Overview

This document outlines security considerations, best practices, and implementation details for the real-time updates system using LiveKit Webhooks and Server-Sent Events (SSE).

## Threat Model

### Potential Threats

1. **Webhook Forgery**
   - Attacker sends fake webhook events
   - Bypasses LiveKit server
   - Injects malicious data into system

2. **Denial of Service (DoS)**
   - Excessive SSE connections exhaust server resources
   - Webhook flood overwhelms backend
   - Memory exhaustion from unclosed connections

3. **Man-in-the-Middle (MITM)**
   - Webhook interception
   - SSE message eavesdropping
   - Credential theft

4. **Unauthorized Access**
   - Unauthenticated users accessing SSE stream
   - Viewing sensitive room/participant data
   - Privacy violations

5. **Data Injection**
   - XSS through malicious room names
   - SQL injection through participant identities
   - JSON injection in metadata fields

## Security Layers

### Layer 1: Transport Security

#### HTTPS/TLS Enforcement

**Backend Configuration:**
```typescript
// backend/src/server.ts
import https from 'https';
import fs from 'fs';

// Production: enforce HTTPS
if (process.env.NODE_ENV === 'production') {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/key.pem'),
    cert: fs.readFileSync('/etc/ssl/certs/cert.pem')
  };

  https.createServer(options, app).listen(443);
}
```

**Nginx Configuration:**
```nginx
# Force HTTPS redirect
server {
    listen 80;
    server_name dashboard.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dashboard.example.com;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;

    # Modern TLS configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
}
```

**Why Critical:**
- Webhooks contain sensitive event data
- SSE streams carry real-time information
- Prevents eavesdropping and tampering

### Layer 2: Webhook Signature Verification

#### Implementation

**Backend Webhook Handler:**
```typescript
// backend/src/routes/webhooks.ts
import { WebhookReceiver } from 'livekit-server-sdk';

const webhookReceiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

router.post('/webhooks/livekit', async (req, res) => {
  try {
    // Extract signature from Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        error: 'Missing authorization header'
      });
    }

    // Verify signature using LiveKit SDK
    const event = await webhookReceiver.receive(
      req.body,
      authHeader
    );

    // Signature valid - process event
    processWebhookEvent(event);

    res.status(200).send('OK');
  } catch (error) {
    // Invalid signature or malformed payload
    console.error('Webhook verification failed:', error);
    res.status(400).json({
      error: 'Invalid webhook signature'
    });
  }
});
```

#### How It Works

LiveKit signs webhooks using HMAC-SHA256:

```
Signature = HMAC-SHA256(
  key: API_SECRET,
  message: webhook_payload_body
)
```

The signature is sent in the `Authorization` header:
```
Authorization: <base64-encoded-signature>
```

The `WebhookReceiver` class:
1. Computes expected signature from payload
2. Compares with received signature
3. Throws error if mismatch

**Security Properties:**
- ✅ Prevents webhook forgery
- ✅ Ensures payload integrity
- ✅ Authenticates LiveKit server
- ✅ Replay attack resistant (with timestamps)

#### Additional Protection: Request Origin Validation

```typescript
const ALLOWED_IPS = [
  '35.184.12.34',      // LiveKit Cloud IP 1
  '35.222.45.67',      // LiveKit Cloud IP 2
  // Add your LiveKit server IPs
];

router.post('/webhooks/livekit', (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;

  if (!ALLOWED_IPS.includes(clientIP)) {
    console.warn(`Webhook from unauthorized IP: ${clientIP}`);
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
});
```

### Layer 3: SSE Connection Security

#### Rate Limiting

**Per-IP Connection Limits:**
```typescript
// backend/src/middleware/sseRateLimit.ts
const connectionsByIP = new Map<string, number>();
const MAX_CONNECTIONS_PER_IP = 5;

export const sseRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const currentConnections = connectionsByIP.get(clientIP) || 0;

  if (currentConnections >= MAX_CONNECTIONS_PER_IP) {
    return res.status(429).json({
      error: 'Too many connections',
      message: `Maximum ${MAX_CONNECTIONS_PER_IP} connections per IP`
    });
  }

  // Track connection
  connectionsByIP.set(clientIP, currentConnections + 1);

  // Cleanup on disconnect
  req.on('close', () => {
    const count = connectionsByIP.get(clientIP) || 0;
    if (count <= 1) {
      connectionsByIP.delete(clientIP);
    } else {
      connectionsByIP.set(clientIP, count - 1);
    }
  });

  next();
};
```

**Global Connection Limits:**
```typescript
// backend/src/services/sseManager.ts
export class SSEManager {
  private clients = new Map<string, Response>();
  private readonly MAX_TOTAL_CONNECTIONS = 1000;

  addClient(connectionId: string, res: Response): boolean {
    if (this.clients.size >= this.MAX_TOTAL_CONNECTIONS) {
      return false; // Reject connection
    }

    this.clients.set(connectionId, res);
    return true;
  }
}
```

#### Authentication (Optional for v1, Recommended for Production)

**JWT Token-Based Authentication:**
```typescript
// backend/src/middleware/authenticateSSE.ts
import jwt from 'jsonwebtoken';

export const authenticateSSE = (req: Request, res: Response, next: NextFunction) => {
  const token = req.query.token as string;

  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply to SSE endpoint
router.get('/api/events', authenticateSSE, sseRateLimit, (req, res) => {
  // SSE connection handling
});
```

**Frontend Token Acquisition:**
```typescript
// frontend/src/presentation/hooks/useRealtimeEvents.ts
const { data: authToken } = useQuery({
  queryKey: ['sse-token'],
  queryFn: async () => {
    const response = await fetch('/api/auth/sse-token');
    const { token } = await response.json();
    return token;
  }
});

useEffect(() => {
  if (!authToken) return;

  const eventSource = new EventSource(`/api/events?token=${authToken}`);
  // ... rest of implementation
}, [authToken]);
```

### Layer 4: Input Validation & Sanitization

#### Webhook Payload Validation

```typescript
// backend/src/validators/webhookValidator.ts
import { z } from 'zod';

const RoomSchema = z.object({
  sid: z.string().regex(/^RM_[a-zA-Z0-9]+$/),
  name: z.string().min(1).max(255),
  emptyTimeout: z.number().int().min(0),
  maxParticipants: z.number().int().min(0),
  creationTime: z.number().int().positive(),
  metadata: z.string().optional()
});

const ParticipantSchema = z.object({
  sid: z.string().regex(/^PA_[a-zA-Z0-9]+$/),
  identity: z.string().min(1).max(255),
  name: z.string().max(255).optional(),
  metadata: z.string().optional()
});

export function validateWebhookEvent(event: any): boolean {
  try {
    if (event.room) {
      RoomSchema.parse(event.room);
    }
    if (event.participant) {
      ParticipantSchema.parse(event.participant);
    }
    return true;
  } catch (error) {
    console.error('Webhook validation failed:', error);
    return false;
  }
}
```

**Apply Validation:**
```typescript
router.post('/webhooks/livekit', async (req, res) => {
  const event = await webhookReceiver.receive(req.body, authHeader);

  if (!validateWebhookEvent(event)) {
    return res.status(400).json({ error: 'Invalid event structure' });
  }

  // Proceed with processing
});
```

#### XSS Prevention

**Backend Output Sanitization:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeSSEMessage(message: SSEMessage): SSEMessage {
  return {
    ...message,
    data: {
      room: message.data.room ? {
        ...message.data.room,
        name: DOMPurify.sanitize(message.data.room.name),
        metadata: DOMPurify.sanitize(message.data.room.metadata || '')
      } : undefined,
      participant: message.data.participant ? {
        ...message.data.participant,
        identity: DOMPurify.sanitize(message.data.participant.identity),
        name: DOMPurify.sanitize(message.data.participant.name || '')
      } : undefined
    }
  };
}
```

**Frontend Content Security Policy:**
```html
<!-- frontend/index.html -->
<meta http-equiv="Content-Security-Policy"
      content="
        default-src 'self';
        script-src 'self' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        connect-src 'self' https://api.livekit.io;
        img-src 'self' data: https:;
      ">
```

### Layer 5: Data Privacy

#### Sensitive Data Handling

**Never Include in SSE Messages:**
- API keys or secrets
- Full participant email addresses (use hashes)
- Internal system identifiers
- Personally identifiable information (PII)

**Data Minimization:**
```typescript
function transformWebhookToSSE(event: WebhookEvent): SSEMessage {
  return {
    id: uuid(),
    type: 'livekit',
    event: event.event,
    timestamp: Date.now(),
    data: {
      room: {
        sid: event.room.sid,
        name: event.room.name,
        // DON'T include: internal IDs, full metadata
      },
      participant: event.participant ? {
        sid: event.participant.sid,
        identity: hashIdentity(event.participant.identity), // Hash email
        name: event.participant.name,
        // DON'T include: IP address, user agent, email
      } : undefined
    }
  };
}

function hashIdentity(identity: string): string {
  // One-way hash for display purposes
  return crypto.createHash('sha256').update(identity).digest('hex').substring(0, 8);
}
```

#### Access Control

**Room-Specific Streams (Future Enhancement):**
```typescript
// Allow users to subscribe only to rooms they have access to
router.get('/api/events/:roomName', authenticateSSE, async (req, res) => {
  const { roomName } = req.params;
  const userId = req.user.id;

  // Check if user has access to room
  const hasAccess = await checkRoomAccess(userId, roomName);
  if (!hasAccess) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Create room-specific SSE stream
  sseManager.addClientToRoom(connectionId, roomName, res);
});
```

### Layer 6: Denial of Service Protection

#### Request Rate Limiting

**Webhook Endpoint:**
```typescript
import rateLimit from 'express-rate-limit';

const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // Max 1000 webhooks per minute
  message: 'Too many webhook requests',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/webhooks/livekit', webhookLimiter, async (req, res) => {
  // Handle webhook
});
```

#### Memory Leak Prevention

**Connection Cleanup:**
```typescript
export class SSEManager {
  private clients = new Map<string, Response>();
  private connectionTimestamps = new Map<string, number>();
  private readonly MAX_CONNECTION_AGE = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    // Periodic cleanup of stale connections
    setInterval(() => this.cleanupStaleConnections(), 60000); // Every minute
  }

  private cleanupStaleConnections() {
    const now = Date.now();
    for (const [id, timestamp] of this.connectionTimestamps.entries()) {
      if (now - timestamp > this.MAX_CONNECTION_AGE) {
        console.log(`Closing stale connection: ${id}`);
        this.removeClient(id);
      }
    }
  }

  removeClient(connectionId: string) {
    const client = this.clients.get(connectionId);
    if (client) {
      try {
        client.end(); // Properly close connection
      } catch (error) {
        // Already closed
      }
      this.clients.delete(connectionId);
      this.connectionTimestamps.delete(connectionId);
    }
  }
}
```

#### Message Flood Protection

**Event Batching:**
```typescript
export class SSEManager {
  private eventQueue: SSEMessage[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly BATCH_INTERVAL = 100; // 100ms
  private readonly MAX_BATCH_SIZE = 50;

  broadcast(message: SSEMessage) {
    this.eventQueue.push(message);

    if (this.eventQueue.length >= this.MAX_BATCH_SIZE) {
      this.flushEventQueue();
    } else if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => this.flushEventQueue(), this.BATCH_INTERVAL);
    }
  }

  private flushEventQueue() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    if (this.eventQueue.length === 0) return;

    const events = this.eventQueue.splice(0);

    // Deduplicate events by room/participant
    const deduped = this.deduplicateEvents(events);

    // Send to clients
    deduped.forEach(event => this.sendToAllClients(event));
  }
}
```

### Layer 7: Monitoring & Alerting

#### Security Event Logging

```typescript
// backend/src/utils/securityLogger.ts
import winston from 'winston';

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'logs/security.log',
      level: 'warn'
    })
  ]
});

export function logSecurityEvent(event: {
  type: 'webhook_invalid_signature' | 'sse_rate_limit' | 'unauthorized_access';
  ip: string;
  details: any;
}) {
  securityLogger.warn({
    timestamp: new Date().toISOString(),
    ...event
  });
}

// Usage in webhook handler
catch (error) {
  logSecurityEvent({
    type: 'webhook_invalid_signature',
    ip: req.ip,
    details: { error: error.message }
  });
  res.status(400).json({ error: 'Invalid webhook signature' });
}
```

#### Anomaly Detection

```typescript
export class SecurityMonitor {
  private webhookRates = new Map<string, number[]>();
  private readonly RATE_WINDOW = 60000; // 1 minute
  private readonly RATE_THRESHOLD = 100;

  checkWebhookRate(sourceIP: string): boolean {
    const now = Date.now();
    const rates = this.webhookRates.get(sourceIP) || [];

    // Remove old timestamps
    const recent = rates.filter(ts => now - ts < this.RATE_WINDOW);

    if (recent.length > this.RATE_THRESHOLD) {
      logSecurityEvent({
        type: 'webhook_rate_anomaly',
        ip: sourceIP,
        details: { count: recent.length }
      });
      return false; // Block
    }

    recent.push(now);
    this.webhookRates.set(sourceIP, recent);
    return true;
  }
}
```

## Security Checklist

### Development

- [ ] Use HTTPS in development (self-signed cert acceptable)
- [ ] Never commit API keys or secrets to git
- [ ] Use environment variables for all credentials
- [ ] Validate all webhook payloads
- [ ] Sanitize all user-provided data
- [ ] Implement proper error handling (don't leak internals)

### Staging

- [ ] Valid TLS certificate installed
- [ ] Webhook signature verification enabled
- [ ] Rate limiting configured
- [ ] Security logging enabled
- [ ] Test webhook forgery protection
- [ ] Test SSE connection limits
- [ ] Penetration testing performed

### Production

- [ ] TLS 1.2+ enforced
- [ ] Webhook IP whitelist configured (if applicable)
- [ ] Authentication enabled for SSE
- [ ] Rate limits tuned for production load
- [ ] Security monitoring and alerting configured
- [ ] Incident response plan documented
- [ ] Regular security audits scheduled
- [ ] Dependency vulnerability scanning automated

## Incident Response

### Suspected Webhook Forgery

1. Check webhook signature verification logs
2. Verify source IP against whitelist
3. Review recent webhook payloads for anomalies
4. Temporarily disable webhook processing if under attack
5. Contact LiveKit support
6. Rotate API keys if compromised

### SSE DoS Attack

1. Check connection count metrics
2. Identify attacking IPs
3. Apply IP-based rate limiting or blocking
4. Scale backend horizontally if needed
5. Review and tighten connection limits
6. Implement CAPTCHA for repeated connections

### Data Exposure

1. Identify what data was exposed
2. Determine exposure duration
3. Review access logs for affected users
4. Notify affected users (if PII exposed)
5. Implement additional access controls
6. Conduct security audit

## Security Best Practices

### For Operators

1. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Regular Security Scans**
   ```bash
   npm install -g snyk
   snyk test
   ```

3. **Monitor Security Advisories**
   - Subscribe to LiveKit security notifications
   - Monitor Node.js security releases
   - Track Express.js security updates

4. **Principle of Least Privilege**
   - Run backend as non-root user
   - Use minimal Docker images (Alpine)
   - Restrict file system access

5. **Defense in Depth**
   - Multiple security layers
   - Fail securely (deny by default)
   - Assume breach mentality

### For Developers

1. **Never Trust Input**
   - Validate all webhook data
   - Sanitize all user-provided content
   - Use parameterized queries (if DB added)

2. **Fail Securely**
   - Invalid signature → reject
   - Missing auth → deny access
   - Unknown event → ignore safely

3. **Log Security Events**
   - Failed authentication attempts
   - Invalid signatures
   - Rate limit violations
   - Unusual activity patterns

4. **Regular Code Review**
   - Security-focused code reviews
   - Automated security linting
   - Penetration testing

## Compliance Considerations

### GDPR (if applicable)

- Minimize personal data collection
- Document data processing purposes
- Implement data retention policies
- Provide data export/deletion capabilities

### SOC 2 (if applicable)

- Implement audit logging
- Access control documentation
- Incident response procedures
- Regular security assessments

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [LiveKit Security Documentation](https://docs.livekit.io/home/security/)
