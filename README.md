# Dr.C - Fractal Explorer - (L-Systems)

**Professional L-System Sonification with Csound WASM 7**

![Status](https://img.shields.io/badge/status-stable-green)
![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-orange)

Transform fractal geometry into music in your browser. No installation, no server, just pure algorithmic beauty.

🎵 **[Launch Application](https://your-netlify-url.netlify.app/app.html)** | 📖 **[Quick Start Guide](QUICKSTART.md)** | ⚙️ **[Technical Docs](TECHNICAL.md)**

---

## 🌟 Features

### 🌀 5 Fractal Types

- **Algae** - Organic branching growth
- **Tree** - Binary tree structure
- **Dragon Curve** - Space-filling spiral
- **Koch Snowflake** - Crystalline symmetry
- **Sierpinski Triangle** - Recursive triangles

### 🎹 8 Synthesis Engines

- **Melodic (5):** Karplus-Strong Pluck, FM Bell, Additive Bell, Clarinet, Organ
- **Textural (3):** Granular Synthesis, Complex FM (4-operator), Noise & Filters

### 🎛️ Comprehensive Parameter Mapping

Map fractal geometry (depth, angle, position) to sound parameters:

- **Pitch** - Angle/position/depth/random
- **Duration** - Constant/depth/inverse
- **Timbre** - Brightness control
- **Pan** - Stereo or 1st-order ambisonic
- **Attack/Release** - Per-note envelope control
- **Reverb Room Size** - Spatial evolution
- **Reverb Wet Mix** - Depth-based clarity

### 🏭 57 Factory Presets

- 15 fractal-based presets (3 per curve)
- 24 instrument-based presets (3 per instrument)
- 5 extra noise & filters presets
- 13 fast tempo variations (⚡ 160-240 BPM)

### 🎨 Real-time Visualization

- Live fractal generation with playback highlighting
- Yellow glow shows current note
- Red cursor dot (6px) marks exact playback position
- Parameter info overlay

### 🎭 Live Performance Tools

- Master volume control (real-time, no restart)
- Reverb controls (real-time room size and wet mix)
- Preset save/load/delete system
- Auto-play on load (perfect for live sets)
- localStorage-based preset bank

---

## 🚀 Quick Start

### 1. Launch the App

Open `app.html` in any modern browser (Chrome, Firefox, Safari, Edge).

### 2. Load Factory Presets

Click the green **"🏭 LOAD FACTORY (57)"** button to load all 57 factory presets.

### 3. Select a Preset

Choose from the dropdown (try **"🌿 Algae: Gentle Growth"** or **"⚡ Pluck: Lightning"**).

### 4. Click PLAY

Press the green **PLAY** button and listen!

### 5. Explore

- Adjust **Master Volume** slider (real-time)
- Tweak **Reverb** controls (real-time)
- Try different **Fractal Presets** (Algae, Tree, Dragon, Koch, Sierpinski)
- Change **Instrument** (Pluck, FM Bell, Organ, Granular, etc.)
- Experiment with **Parameter Mappings**

---

## 📖 Documentation

### For Users

- **[Quick Start Guide](QUICKSTART.md)** - Get making music in 5 minutes
  - Essential controls
  - Preset categories
  - Mapping guide
  - Creative workflows
  - Troubleshooting

### For Developers

- **[Technical Documentation](TECHNICAL.md)** - Complete architecture reference
  - Csound audio engine details
  - L-system generator
  - Parameter mapping system
  - Preset system
  - Extending the system

---

## 🎵 Example Presets

### Melodic

- **🌿 Algae: Gentle Growth** - Plucked string, organic branching, 100 BPM
- **❄️ Koch: Crystal Snowflake** - Bell tones, snowflake symmetry, 90 BPM
- **🎸 Pluck: Fast Arpeggio** - Bright pluck, 180 BPM, monophonic

### Atmospheric

- **🎹 Organ: Cathedral Drone** - Slow chords, 40 BPM, 8 voices, deep reverb
- **🔺 Sierpinski: Triangle Ritual** - Organ harmonics, 45 BPM, spatial evolution
- **🎵 Bell: Temple Gong** - Long reverb tails, 60 BPM, additive synthesis

### Textural

- **⚛️ Granular: Cloud Texture** - Evolving grain clouds, Dragon spiral, 100 BPM
- **🌀 Complex FM: Diamond Algorithm** - 4-operator FM, complex routing, 75 BPM
- **💨 Noise: Hurricane** - Fast cyclic filter, 220 BPM, stereo

### Fast Tempo

- **⚡ Pluck: Lightning** - 240 BPM arpeggio
- **⚡ Dragon: Speed Spiral** - 220 BPM bell cascade
- **⚡ Koch: Crystal Rush** - 240 BPM crystalline patterns

---

## 🛠️ Technical Stack

| Component      | Technology               | Notes                    |
| -------------- | ------------------------ | ------------------------ |
| Audio Engine   | Csound WASM 7.0.0-beta26 | Professional synthesis   |
| Module Loading | ES6 Dynamic Import       | CDN-based, no build step |
| Audio Output   | Web Audio API            | Native browser support   |
| Visualization  | HTML5 Canvas             | 2D context, high-DPI     |
| Storage        | localStorage API         | Preset persistence       |
| UI             | Vanilla JavaScript       | No frameworks, pure ES6+ |

### Architecture Highlights

- **Single-file deployment** - Entire app in one HTML file
- **Client-side processing** - No server required
- **JavaScript-based scheduling** - Uses `setTimeout()` for precise stop control
- **Real-time parameter control** - Master volume and reverb update via control channels
- **Factory preset bank** - 57 presets embedded in JavaScript

### Audio Specifications

- **Sample Rate:** 44.1kHz
- **Block Size:** 32 samples (ksmps)
- **Latency:** ~10-20ms (useWorker: false)
- **Channels:** Stereo (2)
- **Effects:** Freeverb reverb, 1st-order ambisonic spatialization
- **Polyphony:** 1-32 voices (user adjustable)

---

## 📂 Project Structure

```
fractal-music-explorer/
├── index.html          # Landing page
├── app.html            # Main application (~4500 lines, single-file)
├── QUICKSTART.md       # User guide
├── TECHNICAL.md        # Developer documentation
├── README.md           # This file
├── LICENSE             # MIT License
└── netlify.toml        # Netlify deployment config
```

---

## 🎨 Customization

### Add Your Own Instrument

1. **Edit Csound Orchestra** (in `app.html`, search for `orchestraCode =`)
2. **Add Instrument Code** (use p-field parameters)
3. **Update Preset Map** (map instrument name to Csound instr number)
4. **Add to UI Dropdown** (sound preset selector)
5. **Create Factory Presets** (showcase your instrument)

See [TECHNICAL.md - Extending the System](TECHNICAL.md#extending-the-system) for detailed instructions.

### Add Your Own Fractal

1. **Add to Fractal Presets** (define axiom, rules, angle, iterations)
2. **Add to UI Dropdown** (fractal preset selector)
3. **Create Factory Presets** (explore the fractal with different instruments)

### Add Custom Mappings

1. **Add UI Control** (new dropdown or slider)
2. **Read in Play Function** (capture value)
3. **Implement Mapping Logic** (map fractal properties to parameter)
4. **Pass to Csound** (add to score event string)
5. **Update Preset System** (save/load new mapping)

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Preserve single-file architecture
- Maintain Csound 7 compatibility
- Follow existing naming conventions
- Add factory presets for new features
- Update documentation

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:

- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console error messages (F12 or Cmd+Option+J)

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

You are free to:

- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Private use

---

## 🙏 Acknowledgments

### Powered By

- **[Csound](https://csound.com)** - The legendary audio programming language by Barry Vercoe
- **[@csound/browser](https://www.npmjs.com/package/@csound/browser)** - Csound WASM 7 by Steven Yi and contributors
- **Web Audio API** - W3C standard for browser audio

### Inspiration

- **The Algorithmic Beauty of Plants** by Przemysław Prusinkiewicz and Aristid Lindenmayer
- **The Csound Book** edited by Richard Boulanger
- **Computer Music Tutorial** by Curtis Roads
- Decades of fractal music research by composers and researchers worldwide

### Special Thanks

- The Csound community for decades of audio programming innovation
- L-system pioneers for their work in algorithmic beauty
- Open source contributors making browser-based synthesis possible

---

## 📬 Contact

**Created by Richard Boulanger**

- 🌐 Website: [https://your-website.com](https://your-website.com)
- 📧 Email: your.email@example.com
- 🐦 Twitter: [@yourusername](https://twitter.com/yourusername)
- 💼 GitHub: [@rboulanger](https://github.com/rboulanger)

Part of the **Dr.C Suite** - Algorithmic music tools for composers and sound designers.

---

## 🎵 Gallery

### User Creations

Share your fractal music! Tag your creations with **#DrCFractalExplorer** on social media.

### Video Demos

- Coming soon: YouTube tutorial series
- Coming soon: Live performance examples
- Coming soon: Sound design workflows

---

## 🗺️ Roadmap

### Future Features (Community Feedback Welcome!)

- [ ] **MIDI Export** - Export fractal sequences as MIDI files
- [ ] **Audio Recording** - Built-in WAV export
- [ ] **More Fractals** - Hilbert curve, Peano curve, Cantor dust
- [ ] **More Instruments** - Physical modeling, wavetable synthesis
- [ ] **Advanced Mappings** - Velocity, modulation wheel, expression
- [ ] **3D Visualization** - Three.js integration for 3D fractals
- [ ] **Collaborative Mode** - Share presets via URL parameters
- [ ] **Mobile Optimization** - Touch-friendly interface
- [ ] **VST Plugin** - Desktop version for DAW integration

### Version History

- **v1.0** (2024) - Initial release
  - 57 factory presets
  - 8 synthesis engines
  - 5 fractals
  - Real-time visualization
  - Master volume control

---

## ⭐ Star This Repo!

If you find this project useful, please consider giving it a star on GitHub. It helps others discover the project and motivates continued development.

**[⭐ Star on GitHub](https://github.com/rboulanger/fractal-explorer)**

---

## 📖 Learn More

### L-Systems

- [Wikipedia: L-system](https://en.wikipedia.org/wiki/L-system)
- [The Algorithmic Beauty of Plants (online)](http://algorithmicbotany.org/papers/#abop)
- [L-systems Tutorial](http://paulbourke.net/fractals/lsys/)

### Csound

- [Csound Official Website](https://csound.com)
- [Csound FLOSS Manual](https://flossmanual.csound.com/)
- [Csound Journal](https://csoundjournal.com/)

### Algorithmic Composition

- [Computer Music Tutorial by Curtis Roads](https://mitpress.mit.edu/books/computer-music-tutorial)
- [The Csound Book](https://mitpress.mit.edu/books/csound-book)
- [Algorithmic Composition Resources](https://algorithmiccomposition.com/)

---

**Happy Fractal Music Making! 🎵🌿**
