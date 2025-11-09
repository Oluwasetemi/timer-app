# Timer App

A professional presentation timer application built with Tauri, React, and TypeScript. Perfect for tracking time during presentations, meetings, or any timed activities with support for projection mode.

## Features

- ⏱️ **Multiple Time Slots** - Create and manage multiple timers with custom durations
- 🎯 **Projection Mode** - Full-screen projection with large, easy-to-read countdown
- 📺 **Multi-Window Support** - Project to a second screen/display
- ⚠️ **Smart Warnings** - Visual red flash warnings at 50%, 75%, and 90% of duration
- ⏸️ **Pause/Resume** - Pause and resume timers without losing progress
- 🔄 **Restart** - Quickly restart completed timers
- 🎨 **Clean UI** - Modern interface with Tailwind CSS v4 and shadcn/ui
- 💾 **Persistent Storage** - Timers sync across windows and persist between sessions
- 🔔 **Desktop Notifications** - Get notified when timers complete

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Desktop:** Tauri v2
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Package Manager:** Bun

## Installation

### Prerequisites

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [Rust](https://rustup.rs/) - Required for Tauri

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/timer-app.git
cd timer-app

# Install dependencies
bun install

# Run in development mode
bun run tauri dev

# Build for production
bun run tauri build
```

## Usage

### Creating a Timer

1. Enter a title for your time slot
2. Set the duration (hours, minutes, seconds)
3. Click "Add Time Slot"
4. Click "Start" to begin the timer

### Projection Mode

**In-App Full Screen:**
- Click "Full Screen" button when a timer is running
- Press "Exit Projection" to return to normal view

**Separate Window:**
- Click "Project to Window" to open a dedicated projection window
- Perfect for projecting to a second screen or projector
- The projection window stays in sync with the main window

### Warning System

The timer automatically flashes red at key milestones:
- **50% elapsed** - 3 second red flash
- **75% elapsed** - 5 second red flash
- **90% elapsed** - 10 second red flash
- **Time Up** - Countdown and "Time Up!" message turn red

### Keyboard Shortcuts

- Pause/Resume timers with control buttons
- Delete time slots you no longer need
- Restart completed timers instantly

## Development

```bash
# Start development server
bun run dev

# Type checking
bun run build

# Preview production build
bun run preview
```

## Building for Release

### Local Build

```bash
# Build for your current platform
bun run tauri build
```

Outputs:
- **macOS:** `.dmg` and `.app` in `src-tauri/target/release/bundle/`
- **Windows:** `.msi` and `.exe` in `src-tauri/target/release/bundle/`

### GitHub Actions (Automated)

The project includes automated builds for both macOS and Windows:

```bash
# Create and push a release tag
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions will automatically:
1. Build for macOS and Windows
2. Create a GitHub Release
3. Upload all installers (DMG, MSI, EXE)

## Project Structure

```
timer-app/
├── src/
│   ├── components/          # React components
│   │   ├── Timer.tsx        # Timer display with warnings
│   │   ├── TimeSlotForm.tsx # Create new time slots
│   │   └── TimeSlotList.tsx # List of time slots
│   ├── hooks/               # Custom React hooks
│   │   ├── useTimeSlots.ts  # Timer state management
│   │   └── useWindowLabel.ts # Window detection
│   ├── types.ts             # TypeScript interfaces
│   ├── App.tsx              # Main application
│   └── App.css              # Styles
├── src-tauri/
│   ├── src/
│   │   └── lib.rs           # Rust backend (Tauri commands)
│   └── tauri.conf.json      # Tauri configuration
└── .github/
    └── workflows/
        └── release.yml      # CI/CD for releases
```

## Configuration

### Tauri Settings

Edit `src-tauri/tauri.conf.json`:
- `productName` - Application name
- `version` - App version
- `identifier` - Unique app identifier

### Styling

The app uses Tailwind CSS v4 with custom themes. Modify `src/App.css` to customize colors and styles.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and feature requests, please open an issue on GitHub.
