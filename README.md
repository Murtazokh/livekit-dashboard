# LiveKit Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An open-source, self-hosted alternative to LiveKit Cloud Dashboard that provides comprehensive monitoring and management of your LiveKit real-time communication infrastructure.

## ✨ Features

### 🏠 Dashboard Overview
- **Real-time Room Monitoring**: View active rooms with participant counts and creation times
- **Live Metrics**: Track publishers, streams, and connection status
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### ⚙️ Configuration Management
- **Secure Credential Storage**: Local browser storage for API credentials
- **Connection Validation**: Test server connectivity before saving settings
- **User-Friendly Setup**: Guided configuration process with error feedback

### 🔧 Technical Features
- **Clean Architecture**: Modular, maintainable codebase following SOLID principles
- **Type-Safe**: Full TypeScript implementation with strict mode
- **Real-time Updates**: Automatic data refresh with React Query
- **Error Resilience**: Comprehensive error handling and recovery
- **Performance Optimized**: Efficient caching and lazy loading

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **LiveKit Server** running (for full functionality)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/livekit-dashboard.git
   cd livekit-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   Server will start on `http://localhost:3001`

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```
   Dashboard will be available at `http://localhost:5173`

4. **Access the dashboard**

   Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

### First-Time Setup

1. **Configure LiveKit Server**
   - Navigate to the Settings page
   - Enter your LiveKit server details:
     - Server URL (e.g., `https://your-livekit-server.com` or `ws://localhost:7880`)
     - API Key
     - API Secret
   - Click "Test Connection" to verify credentials
   - Save your configuration

2. **View Dashboard**
   - The dashboard will display real-time information about your rooms
   - Monitor active participants, publishers, and room status
   - Click on rooms for detailed information

### Development Usage

- **Backend API**: Available at `http://localhost:3001/api`
- **Frontend Dev Server**: Hot-reload enabled for rapid development
- **Type Checking**: Run `npm run build` to verify TypeScript compilation

## 🏗️ Architecture

### Project Structure

```
livekit-dashboard/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── core/            # Business logic layer
│   │   │   ├── domain/      # Domain entities
│   │   │   ├── ports/       # Interface definitions
│   │   │   └── usecases/    # Application business logic
│   │   ├── infrastructure/  # External implementations
│   │   │   ├── api/         # API client
│   │   │   └── storage/     # Data persistence
│   │   └── presentation/    # UI layer
│   │       ├── components/  # Reusable UI components
│   │       ├── hooks/       # Custom React hooks
│   │       └── pages/       # Page components
│   └── package.json
├── backend/                  # Express API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business services
│   │   └── types/           # Type definitions
│   └── package.json
└── README.md
```

### Tech Stack

**Frontend:**
- **React 18** - UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **shadcn/ui** - Component design system

**Backend:**
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe development
- **LiveKit Server SDK** - LiveKit integration
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Backend:**
```bash
cd backend
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

**Backend (.env):**
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
LIVEKIT_HOST=http://localhost:7880
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

### Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests (when implemented)
cd frontend && npm test
```

## 🔒 Security

- API credentials are stored locally in the browser
- No sensitive data is transmitted to external services
- Backend acts as a secure proxy for LiveKit API calls
- CORS restrictions prevent unauthorized access
- Input validation on both client and server

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for code quality
- **Prettier**: Automatic code formatting
- **Clean Architecture**: Follow established patterns

## 📝 API Documentation

### Backend Endpoints

- `GET /api/rooms` - List all active rooms
- `GET /api/rooms/:roomName` - Get room details
- `GET /api/rooms/:roomName/participants` - List room participants
- `GET /api/rooms/:roomName/agents` - List room agents
- `POST /api/config/validate` - Validate server configuration

### Frontend Components

- `Settings` - Server configuration page
- `Dashboard` - Main monitoring dashboard
- `RoomList` - Display list of rooms
- `RoomCard` - Individual room information card

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LiveKit](https://livekit.io/) - Real-time communication platform
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Query](https://tanstack.com/query/) - Powerful data fetching

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/livekit-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/livekit-dashboard/discussions)
- **LiveKit Community**: [LiveKit Discord](https://discord.gg/livekit)

---

**Note**: This is a community project and not officially affiliated with LiveKit, Inc.