<div align="center">

# 🎥 LiveKit Dashboard

### Open-Source Self-Hosted Alternative to LiveKit Cloud

**Monitor your LiveKit infrastructure with real-time updates, AI agent transcription, and beautiful dark-themed UI**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-114%20passing-brightgreen.svg)](./TESTING_SUMMARY.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)](https://www.typescriptlang.org/)

[Demo](#-demo) • [Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-documentation)

</div>

---

## 🎬 Demo

Watch LiveKit Dashboard in action - monitoring rooms, tracking participants, and displaying live AI agent transcriptions:

<div align="center">

[![LiveKit Dashboard Demo](https://img.youtube.com/vi/Cf5yiVFMWjk/0.jpg)](https://youtu.be/Cf5yiVFMWjk)

**[▶️ Watch 1-Minute Demo on YouTube](https://youtu.be/Cf5yiVFMWjk)**

</div>

---

## 🎯 Why LiveKit Dashboard?

- **🔓 100% Open Source** - No vendor lock-in, full transparency
- **🏠 Self-Hosted** - Your data stays on your infrastructure
- **⚡ Real-Time Updates** - Live monitoring with auto-refresh
- **🤖 AI Agent Support** - Track voice agents with live transcription
- **🎨 Beautiful UI** - Modern dark theme inspired by LiveKit Cloud
- **🛡️ Production-Ready** - 114 passing tests, TypeScript strict mode
- **🐳 Docker Ready** - One-command deployment

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 Real-Time Monitoring
- Live room dashboard with participant counts
- Auto-refresh with visual live indicators
- Session analytics and metrics cards
- Search and filter capabilities

### 🎙️ AI Agent & Transcription
- **Real-time transcription** from voice agents
- Multi-speaker support with timestamps
- Session transcript history
- Agent status and metadata tracking

</td>
<td width="50%">

### 👥 Participant Management
- Detailed participant view with connection quality
- Publisher tracking (audio/video/screen)
- Connection states monitoring
- Track information display

### 🔧 Developer Experience
- **Clean Architecture** with TypeScript
- 114 passing tests, strict type-safety
- Docker deployment with hot-reload
- Secure credential storage in browser

</td>
</tr>
</table>

**[📖 View Full Feature List →](./docs/FEATURES.md)**

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **LiveKit Server** running ([Setup Guide](https://docs.livekit.io/home/self-hosting/local/))

### 🐳 Docker (Recommended)

```bash
git clone https://github.com/Murtazokh/livekit-dashboard.git
cd livekit-dashboard

# Development mode with hot-reload
docker compose up

# Production mode
docker compose -f docker-compose.prod.yml up -d
```

Dashboard available at **http://localhost:5173** 🎉

📖 **[Full Docker Guide →](./DOCKER.md)**

### 💻 Local Development

```bash
# Clone and install
git clone https://github.com/Murtazokh/livekit-dashboard.git
cd livekit-dashboard
npm run install:all

# Start dev servers (frontend + backend)
npm run dev
```

<details>
<summary>Manual Setup (separate terminals)</summary>

```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

</details>

### ⚙️ First-Time Configuration

1. Open **http://localhost:5173**
2. Go to **Settings** (⚙️ in sidebar)
3. Enter LiveKit credentials:
   - Server URL: `ws://localhost:7880` (or your server)
   - API Key & Secret
4. **Test Connection** → **Save**
5. View your rooms on the Dashboard! 🎉


## 🛠️ Tech Stack

<table>
<tr>
<td><b>Frontend</b></td>
<td>React 19 • TypeScript • Vite • Tailwind CSS 4 • React Query • LiveKit Client SDK</td>
</tr>
<tr>
<td><b>Backend</b></td>
<td>Node.js • Express 5 • TypeScript • LiveKit Server SDK</td>
</tr>
<tr>
<td><b>Testing</b></td>
<td>Vitest • Supertest • 114 passing tests</td>
</tr>
<tr>
<td><b>Deployment</b></td>
<td>Docker • Docker Compose • Hot-reload support</td>
</tr>
</table>

---

## 📖 Documentation

| For Users | For Developers |
|-----------|----------------|
| [Quick Start](#-quick-start) | [Architecture Overview](./CLAUDE.md) |
| [Docker Guide](./DOCKER.md) | [Testing Guide](./TESTING_SUMMARY.md) |
| [Full Features](./docs/FEATURES.md) | [Project Structure](./docs/ARCHITECTURE.md) |
| Troubleshooting *(coming soon)* | API Docs *(coming soon)* |

**Additional Resources:**
- [Development Roadmap](./TASKS.md)
- [Testing Summary](./TESTING_SUMMARY.md) (114 tests)
- [Contributing Guide](./CONTRIBUTING.md) *(coming soon)*

---

## 🤝 Contributing

Contributions are welcome! We'd love your help with:

🐛 Bug fixes • 💡 Feature requests • 📝 Documentation • 🎨 UI improvements

**Quick Start:**
```bash
fork → clone → create branch → make changes → test → PR
```

**Guidelines:**
- Write tests for new features
- Use conventional commits (`feat:`, `fix:`, `docs:`)
- Run `npm test` and `npm run lint` before committing

[Full Contributing Guide →](./CONTRIBUTING.md) *(coming soon)*

---

## 🗺️ Roadmap

**✅ Completed:** Real-time monitoring • AI transcription • Docker deployment • 114 tests • Clean architecture

**🚧 Next Up:** E2E tests • Historical data • Advanced search • Room management

[View Full Roadmap →](./TASKS.md)

---

## 🌟 Community & Support

<table>
<tr>
<td width="50%">

**Get Involved**
- ⭐ [Star this repo](https://github.com/Murtazokh/livekit-dashboard)
- 🐛 [Report issues](https://github.com/Murtazokh/livekit-dashboard/issues)
- 💬 [Discussions](https://github.com/Murtazokh/livekit-dashboard/discussions)

</td>
<td width="50%">

**LiveKit Community**
- 📚 [LiveKit Docs](https://docs.livekit.io)
- 💬 [LiveKit Discord](https://discord.gg/livekit)
- 🌐 [LiveKit Website](https://livekit.io)

</td>
</tr>
</table>

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

**Built with ❤️ by [Murtazokh](https://github.com/Murtazokh) for the LiveKit community**

---

## 🙏 Acknowledgments

Special thanks to [LiveKit](https://livekit.io/), [React Query](https://tanstack.com/query/), [Tailwind CSS](https://tailwindcss.com/), and [Vite](https://vitejs.dev/)

---

<div align="center">

### ⚡ Built with ❤️ for the LiveKit Community

**[⬆ Back to Top](#-livekit-dashboard)**

---

**Note**: This is an independent community project and is not officially affiliated with LiveKit, Inc.

## Star History

<a href="https://star-history.com/#Murtazokh/livekit-dashboard&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Murtazokh/livekit-dashboard&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Murtazokh/livekit-dashboard&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Murtazokh/livekit-dashboard&type=Date" />
  </picture>
</a>

</div>
