<div align="center">

# 🎥 LiveKit Dashboard

### Open-Source Self-Hosted Dashboard for LiveKit

**Monitor and manage your LiveKit real-time infrastructure with a beautiful, production-ready interface**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-114%20passing-brightgreen.svg)](./TESTING_SUMMARY.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing) • [Community](#-community)

</div>

---

## 🎯 Overview

**LiveKit Dashboard** is a modern, open-source alternative to LiveKit Cloud Dashboard. Built for developers who want full control over their monitoring infrastructure, it provides real-time insights into rooms, participants, agents, and transcriptions.

### Why LiveKit Dashboard?

- ✅ **100% Open Source** - No vendor lock-in, full transparency
- ✅ **Self-Hosted** - Your data stays on your infrastructure
- ✅ **Production-Ready** - Comprehensive testing with 114 passing tests
- ✅ **Real-Time Updates** - Live monitoring with 5-second refresh intervals
- ✅ **Beautiful UI** - Dark theme inspired by LiveKit Cloud Dashboard
- ✅ **Type-Safe** - Built with TypeScript for reliability
- ✅ **Zero Configuration** - Works out of the box with any LiveKit server

---

## ✨ Features

### 📊 Real-Time Monitoring
- **Live Room Dashboard** - Monitor all active rooms with participant counts and publishers
- **Session Analytics** - Comprehensive metrics cards tracking total rooms, participants, and publishers
- **Auto-Refresh** - Configurable real-time updates (5-second default) with visual live indicators
- **Search & Filters** - Quickly find rooms by name or filter by criteria

### 🎙️ Transcription Support
- **Real-Time Transcriptions** - Display live transcriptions from voice agents
- **Session Transcripts** - Review complete transcription history for past sessions
- **Multi-Speaker Support** - Track transcriptions by participant identity
- **Interim & Final States** - Distinguish between partial and completed transcriptions

### 👥 Participant Management
- **Detailed Participant View** - See connection quality, tracks, and metadata
- **Publisher Tracking** - Identify who's actively publishing audio/video
- **Connection States** - Monitor participant states (joining, active, disconnected)
- **Track Information** - View video, audio, and screen share tracks

### 🤖 Agent Monitoring
- **Agent Status** - Track voice, chat, and transcription agents
- **Agent Metadata** - View agent types and custom metadata
- **Room-Level Agents** - See which agents are active in each room

### 🎨 Modern UI/UX
- **Dark Theme** - Professional design matching LiveKit Cloud aesthetic
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- **Status Badges** - Visual indicators for active, closed, and error states
- **Feature Badges** - Quick identification of recording, SIP, agents, and transcription
- **Loading States** - Smooth skeleton loaders and animations

### 🔧 Configuration & Setup
- **Secure Credential Storage** - Browser localStorage for API credentials
- **Connection Validation** - Test LiveKit server connectivity before saving
- **WebSocket Support** - Automatic URL conversion (ws:// → http://, wss:// → https://)
- **Error Recovery** - User-friendly error messages and retry logic

### 🏗️ Architecture
- **Clean Architecture** - Separation of concerns with domain, use cases, and infrastructure
- **Type-Safe** - Full TypeScript implementation with strict mode
- **Production-Grade Testing** - 114 comprehensive tests with 100% pass rate
- **Performance Optimized** - React Query caching and efficient re-renders
- **Security First** - Credentials never leave your browser or backend

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **LiveKit Server** running ([Setup Guide](https://docs.livekit.io/home/self-hosting/local/))
- **npm** or **yarn**

### One-Command Setup

```bash
# Clone and install
git clone https://github.com/Murtazokh/livekit-dashboard.git
cd livekit-dashboard
npm run install:all

# Start development servers
npm run dev
```

The dashboard will be available at **http://localhost:5173** 🎉

### 🐳 Docker Deployment (Recommended)

For production deployments or containerized environments:

```bash
# Development mode with hot reload
docker compose up

# Production mode
docker compose -f docker-compose.prod.yml up -d
```

**Features:**
- ✅ One-command startup
- ✅ Hot reload for both frontend and backend
- ✅ Automatic service networking
- ✅ Production-optimized builds
- ✅ Health checks included

📖 **[Read Full Docker Guide →](./DOCKER.md)**

### Manual Setup

<details>
<summary>Click to expand detailed setup instructions</summary>

#### 1. Clone the Repository
```bash
git clone https://github.com/Murtazokh/livekit-dashboard.git
cd livekit-dashboard
```

#### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

#### 3. Configure Environment (Optional)

Create `backend/.env` (optional - credentials can be set via UI):
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional: Default credentials
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

#### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### 5. Access Dashboard
Open your browser to **http://localhost:5173**

</details>

### First-Time Configuration

1. Navigate to **Settings** (⚙️ icon in sidebar)
2. Enter your **LiveKit Server** details:
   - **Server URL**: `ws://localhost:7880` or `https://your-server.com`
   - **API Key**: Your LiveKit API key
   - **API Secret**: Your LiveKit API secret
3. Click **"Test Connection"** to verify
4. Click **"Save Configuration"**
5. Return to **Dashboard** to see your rooms!

---

## 📸 Screenshots

### Dashboard Overview
*Coming soon - Beautiful dark-themed dashboard showing live rooms*

### Sessions Page
*Coming soon - Comprehensive session list with metrics and filters*

### Settings Page
*Coming soon - Clean configuration interface with connection testing*

> 📷 **Have screenshots?** Open a PR to add them!

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI with hooks
- **TypeScript 5.9** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **React Query 5** - Data fetching & caching
- **React Router 7** - Client-side routing
- **LiveKit Client SDK** - WebRTC integration
- **Vitest** - Unit & integration testing

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **TypeScript 5.9** - Type-safe development
- **LiveKit Server SDK** - LiveKit API integration
- **Vitest + Supertest** - API testing

---

## 📖 Documentation

### For Users
- [Quick Start Guide](#-quick-start)
- [Docker Deployment Guide](./DOCKER.md)
- [Configuration Guide](./docs/configuration.md) *(coming soon)*
- [Troubleshooting](./docs/troubleshooting.md) *(coming soon)*

### For Developers
- [Architecture Overview](./CLAUDE.md)
- [Testing Guide](./TESTING_SUMMARY.md)
- [Contributing Guide](./CONTRIBUTING.md) *(coming soon)*
- [API Documentation](./docs/api.md) *(coming soon)*

### Project Documentation
- [Task Tracking](./TASKS.md)
- [Testing Summary](./TESTING_SUMMARY.md)
- [Clean Architecture](./CLAUDE.md)

---

## 🏗️ Project Structure

```
livekit-dashboard/
├── frontend/                    # React application
│   ├── src/
│   │   ├── core/               # Business logic (Clean Architecture)
│   │   │   ├── domain/         # Entities (Room, Participant, Agent)
│   │   │   ├── ports/          # Interfaces (ILiveKitService)
│   │   │   └── usecases/       # Business logic (GetRooms, ValidateConnection)
│   │   ├── infrastructure/     # External implementations
│   │   │   ├── api/            # ApiClient (HTTP client)
│   │   │   └── storage/        # LocalStorageConfig
│   │   ├── presentation/       # UI layer
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── pages/          # Dashboard, Sessions, Settings
│   │   │   └── providers/      # Context providers
│   │   └── test/               # Test infrastructure
│   │       ├── __fixtures__/   # Test data
│   │       └── __mocks__/      # Mock implementations
│   └── vitest.config.ts        # Test configuration
├── backend/                     # Express API server
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── services/           # LiveKitService
│   │   └── test/               # Test infrastructure
│   └── vitest.config.ts        # Test configuration
├── TESTING_SUMMARY.md          # Comprehensive testing docs
├── TASKS.md                    # Development roadmap
└── README.md                   # This file
```

---

## 🧪 Testing

We take testing seriously! This project includes **114 comprehensive tests** with **100% pass rate**.

### Run Tests

```bash
# Frontend tests (85 tests)
cd frontend
npm test              # Watch mode
npm run test:coverage # With coverage report

# Backend tests (29 tests)
cd backend
npm test              # Watch mode
npm run test:coverage # With coverage report
```

### Test Coverage

- ✅ **ValidateConnection** use case (15 tests)
- ✅ **LocalStorageConfig** infrastructure (37 tests)
- ✅ **GetRooms** use case with filters (33 tests)
- ✅ **extractLiveKitConfig** middleware (29 tests)

[View Full Testing Documentation →](./TESTING_SUMMARY.md)

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's:

- 🐛 **Bug reports**
- 💡 **Feature requests**
- 📝 **Documentation improvements**
- 🔧 **Code contributions**
- 🎨 **UI/UX enhancements**

### How to Contribute

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/livekit-dashboard.git`
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes
5. **Test** your changes: `npm test`
6. **Commit** your changes: `git commit -m 'feat: Add amazing feature'`
7. **Push** to your fork: `git push origin feature/amazing-feature`
8. **Open** a Pull Request

### Development Guidelines

- ✅ Write tests for new features
- ✅ Follow TypeScript strict mode
- ✅ Use conventional commits (feat:, fix:, docs:, etc.)
- ✅ Run `npm run lint` before committing
- ✅ Update documentation as needed

[View Contributing Guide →](./CONTRIBUTING.md) *(coming soon)*

---

## 🌟 Community

### Get Involved

- ⭐ **Star this repo** to show your support
- 🐛 **Report bugs** via [GitHub Issues](https://github.com/Murtazokh/livekit-dashboard/issues)
- 💬 **Join discussions** in [GitHub Discussions](https://github.com/Murtazokh/livekit-dashboard/discussions)
- 🐦 **Follow updates** on Twitter (coming soon)

### LiveKit Community

This project is built for the LiveKit community:

- 📚 [LiveKit Documentation](https://docs.livekit.io)
- 💬 [LiveKit Discord](https://discord.gg/livekit)
- 🐦 [LiveKit Twitter](https://twitter.com/livekit)
- 🌐 [LiveKit Website](https://livekit.io)

---

## 📊 Project Stats

- **114** passing tests
- **100%** test pass rate
- **100%** TypeScript
- **<1s** test execution time
- **Clean Architecture** principles
- **Production-ready** codebase

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Real-time room monitoring
- [x] Session analytics with metrics
- [x] Transcription display
- [x] Dark theme UI
- [x] Production-grade testing (114 tests)
- [x] Clean Architecture implementation
- [x] WebSocket URL support
- [x] Docker deployment with hot reload
- [x] Production Docker builds

### 🚧 In Progress
- [ ] Component tests for UI layer
- [ ] E2E tests with Playwright

### 📋 Planned Features
- [ ] Historical data persistence
- [ ] Advanced filtering and search
- [ ] Room creation/deletion
- [ ] Participant management actions
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Kubernetes manifests
- [ ] Grafana dashboard export
- [ ] Webhook configuration

[View Full Roadmap →](./TASKS.md)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Murtazokh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 🙏 Acknowledgments

This project wouldn't be possible without:

- **[LiveKit](https://livekit.io/)** - For building an amazing real-time platform
- **[React Query](https://tanstack.com/query/)** - For powerful data fetching
- **[Tailwind CSS](https://tailwindcss.com/)** - For beautiful styling
- **[Vite](https://vitejs.dev/)** - For lightning-fast development

---

## 💬 Support

### Need Help?

- 📖 [Read the documentation](#-documentation)
- 💬 [Start a discussion](https://github.com/Murtazokh/livekit-dashboard/discussions)
- 🐛 [Report an issue](https://github.com/Murtazokh/livekit-dashboard/issues)
- 📧 Contact: [Your Email] *(optional)*

### Found a Bug?

Please [open an issue](https://github.com/Murtazokh/livekit-dashboard/issues/new) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, browser)

---

<div align="center">

### ⚡ Built with ❤️ for the LiveKit Community

**[⬆ Back to Top](#-livekit-dashboard)**

---

**Note**: This is an independent community project and is not officially affiliated with LiveKit, Inc.

[![Star History Chart](https://api.star-history.com/svg?repos=Murtazokh/livekit-dashboard&type=Date)](https://star-history.com/#Murtazokh/livekit-dashboard&Date)

</div>
