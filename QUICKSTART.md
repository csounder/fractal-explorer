# Dr.C Fractal Explorer - Quickstart Guide

**Live L-System Fractal Music Generator** • Real-time Csound Synthesis • 12 Instruments

---

## 🚀 Getting Started (30 seconds)

### 1. Open the App

```
https://csounder.github.io/fractal-explorer
```

Or open `app.html` locally in Chrome/Firefox.

### 2. Generate Your First Fractal

1. Click **Algae** preset (top left) → fractal appears on canvas
2. Click **▶ Play Audio** → hear the fractal as music
3. Press **Spacebar** to stop

**That's it!** You're listening to a fractal-generated melody.

---

## 🎨 Fractal Presets (5 Built-in)

| Preset         | L-System Rule              | Character              |
| -------------- | -------------------------- | ---------------------- |
| **Algae**      | Simple recursive branching | Flowing, melodic       |
| **Tree**       | Organic growth pattern     | Complex, naturalistic  |
| **Dragon**     | Intertwined curve          | Chaotic, energetic     |
| **Koch**       | Snowflake fractal          | Geometric, crystalline |
| **Sierpinski** | Triangle recursion         | Sparse, mathematical   |

### Try These:

- **Algae + Pluck** → acoustic guitar vibe
- **Tree + FM Bell** → shimmering texture
- **Dragon + Organ** → dramatic, complex
- **Koch + Sine** → pure, mathematical

---

## 🎛️ Core Controls

### Play & Visualization (Left Panel)

- **Fractal Presets**: Load predefined L-Systems
- **Iterations** (0-5): Fractal complexity
  - Lower = simpler, fewer notes
  - Higher = complex, more notes
- **Angle** (0-90°): Branching angle → pitch variation
- **Max Events** (100-2000): Limit note density

### Synthesis Settings (Right Panel)

- **Sound Preset** (12 instruments):
  - **Melodic**: Sine, Pluck, FM Bell, Additive Bell, Clarinet, Organ
  - **Complex**: Granular, FM Synth, Noise/Filter
- **Attack** (5-100 ms): Note fade-in time
- **Release** (10-1000 ms): Note tail decay
- **Tempo** (30-300 BPM): Playback speed

### Effects (Bottom Right)

- **Master Volume** (0-100%): Overall loudness
- **Reverb Room Size** (0-100%): Space size
- **Reverb Wet Mix** (0-100%): Effect amount

---

## 🎵 Parameter Mapping (Advanced)

Map fractal geometry to musical parameters:

### Pitch Mapping

- **Depth**: Fractal recursion level → higher notes deeper in tree
- **Angle**: Branch angle → chromatic variation
- **Position**: Timeline → linear pitch sweep
- **Manual**: Fixed base frequency

### Duration Mapping

- **Constant**: All notes same length
- **Depth**: Deep branches = longer notes
- **Angle**: Wider angles = longer notes
- **Position**: Later notes = shorter

### Pan Mapping

- **Center**: All notes center
- **Angle**: Left-right stereo spread
- **Depth**: Front-back panning

---

## 💾 Saving Your Work

### Save Custom Presets

1. Adjust all parameters to your liking
2. Enter preset name: `My Setup`
3. Click **Save Preset**
4. Load anytime from dropdown

### Note

- Presets save to browser localStorage
- Clear browser cache = presets lost

---

## ⌨️ Keyboard Shortcuts

| Key               | Action                        |
| ----------------- | ----------------------------- |
| **Spacebar**      | Play/Stop audio               |
| **Ctrl+Option+I** | Open browser DevTools (debug) |

---

## 🎼 Music Theory Basics

### Quantization (Optional)

- **Key**: C, D, E, F, G, A, B, C#, D#, etc.
- **Scale**: Major, Minor, Dorian, Pentatonic, Blues, Whole-tone, etc.
- Constrains notes to musical scale (prevents dissonance)

### Spatialization

- **Stereo**: L/R panning
- **Ambisonic**: 1st-order spatial audio (headphones recommended)

---

## 🔧 Troubleshooting

### No Sound?

1. **Volume slider** (right panel) at 0%? Turn it up
2. **Browser audio muted?** Click speaker icon in address bar
3. **Csound initializing?** Refresh page, wait 2 seconds
4. **Try different preset** (some may be quieter)

### Fractal not showing?

1. Click a preset name
2. Increase **Iterations** (0 = no branches)
3. Check browser console for errors

### Playback lag?

1. Lower **Max Events** (fewer notes = smoother)
2. Use simpler preset (Algae instead of Dragon)
3. Close other browser tabs (frees CPU)

---

## 📚 Learn More

- **[README.md](README.md)** – Full feature overview
- **[TECHNICAL.md](TECHNICAL.md)** – Architecture & Csound details
- **[FEATURE_SUMMARY.md](FEATURE_SUMMARY.md)** – Instrument specifications

---

## 🎯 Next Steps

### Beginner (10 min):

1. Try all 5 fractal presets
2. Adjust Iterations & Angle sliders
3. Switch between 3 instruments
4. Save one custom preset

### Intermediate (30 min):

1. Create 5 custom presets
2. Experiment with parameter mappings
3. Try different scales (Blues, Pentatonic)
4. Adjust reverb settings

### Advanced (1+ hour):

1. Map each parameter independently
2. Combine complex instruments
3. Study L-System rules (TECHNICAL.md)
4. Understand fractal-to-audio mappings

---

## 🌟 Tips & Tricks

- **Sparse fractals sound best**: Lower iterations (2-3) = cleaner melodies
- **Long releases**: Create pad-like textures (Release 500+ ms)
- **Stereo panning**: Makes fractals feel spacious
- **Reverb heavy**: Great for atmospheric, dreamy textures
- **Fast tempo + pluck**: Sounds like fast guitar arpeggios
- **Low iterations + FM Bell**: Crystalline, bell-like tones

---

## 📖 Example Workflow

```
1. Open app (Algae loads by default)
2. Set Iterations = 2 (clean, sparse)
3. Set Sound = Pluck
4. Click ▶ Play
   → Hear: Pleasant plucked melody
5. Adjust Release to 200 ms
   → More sustain on each note
6. Change Angle to 45°
   → Different pitch variation
7. Add Reverb: Room 0.8, Wet 0.5
   → Spacious, atmospheric
8. Save as "My Plucked Tree"
9. Load another preset and repeat
```

---

**Ready to create?** Open https://csounder.github.io/fractal-explorer now!

Or run locally: Open `app.html` in your browser.
