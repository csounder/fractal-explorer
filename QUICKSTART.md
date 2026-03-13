# Quick Start Guide

## Dr.C - Fractal Explorer - (L-Systems)

**Welcome!** This guide will get you making fractal music in 5 minutes.

---

## 🎵 First Steps

### 1. Launch the App

Open `app.html` in a modern web browser (Chrome, Firefox, Safari, Edge).

### 2. Wait for Initialization

You'll see debug messages in the console:

- "Loading Csound WASM 7..."
- "Orchestra compiled successfully"
- "Loaded 57 factory presets"

### 3. Click PLAY

Press the green **PLAY** button. You'll hear the default "Algae" preset with a plucked string sound.

### 4. Watch the Visualization

The fractal draws in real-time with a yellow glow showing the current playback position and a red cursor dot (6px) marking the exact note being played.

---

## 🏭 Using Factory Presets

### Load Presets

1. Click the **"🏭 LOAD FACTORY (57)"** button (green, in Performance Presets section)
2. This loads all 57 factory presets into your browser's localStorage
3. Select any preset from the dropdown list
4. Click **LOAD** to apply it
5. If "Auto-play on load" is checked (default), it will start playing immediately

### Preset Categories

**Fractal-Based (15 presets):**

- 🌿 Algae (3): Gentle Growth, Bell Garden, Organic FM
- 🌲 Tree (3): Morning Branches, Sacred Geometry, Plucked Canopy
- 🐉 Dragon (3): Spiral Dance, Metallic Bells, Granular Fold
- ❄️ Koch (3): Crystal Snowflake, Ice Cathedral, Fractal Chimes
- 🔺 Sierpinski (3): Triangle Ritual, Sacred FM, Geometric Bells

**Instrument-Based (24 presets):**

- 🎸 Pluck (3): Fast Arpeggio, Bright Melody, Deep Resonance
- 🔔 FM Bell (3): Shimmer, Cascade, Bright Chime
- 🎵 Bell (3): Crystal Garden, Temple Gong, Wind Chimes
- 🎷 Clarinet (3): Forest Walk, Warm Legato, Bright Staccato
- 🎹 Organ (3): Cathedral Drone, Harmonic Layers, Celestial Harmony
- ⚛️ Granular (3): Cloud Texture, Dense Swarm, Sparse Bells
- 🌀 Complex FM (3): Parallel Harmonics, Cascade Bells, Diamond Algorithm
- 💨 Noise (3): Wind Sweep, Bandpass Rhythm, Pink Cascade

**Extra Noise (5 presets):**

- 💨 Noise: Highpass Shimmer, Resonant Sweep, Brown Texture, Cyclic Filter Dance, White Storm

**Fast Tempo ⚡ (13 presets):**

- One fast variation (160-240 BPM) for each fractal type and instrument
- Examples: ⚡ Algae: Fast Growth, ⚡ Pluck: Lightning, ⚡ Dragon: Speed Spiral

---

## 🎛️ Essential Controls

### Master Volume

- **Location:** Top of right panel, above reverb controls
- **Range:** 0-100% (default: 70%)
- **Effect:** Immediate volume change, no restart needed
- **Tip:** Lower to 50% for late-night sessions, raise to 90% for performance

### Reverb Controls (Real-time)

Both controls update immediately without restarting playback:

1. **Room Size** (0.0-1.0): Controls reverb decay time
   - Low (0.3): Small room, tight sound
   - Default (0.75): Medium hall
   - High (0.95): Cathedral space

2. **Wet Mix** (0-100%): Balance between dry and reverb signal
   - 0%: No reverb (dry)
   - Default (45%): Balanced mix
   - 100%: Full reverb (wet)

### Tempo

- **Range:** 30-300 BPM (default: 120 BPM)
- **Fast presets:** 160-240 BPM
- **Slow presets:** 40-80 BPM (great for ambient/drone)
- **Effect:** Requires restart (click PLAY again)

### Max Polyphony

- **Range:** 1-32 voices (default: 2)
- **1 voice:** Monophonic (arpeggio style)
- **2-4 voices:** Chords and harmonies
- **8+ voices:** Dense textures (use with organ/drone presets)

---

## 🌀 Understanding Fractals

### L-System Parameters

**Axiom:** Starting string (usually "F")

- Example: "F" means "start with one forward step"

**Rules:** Transformation rules applied recursively

- Example: "F=F[+F]F[-F]F" means "replace F with branching pattern"

**Iterations:** How many times to apply the rules (1-7)

- Low (1-2): Simple, few notes
- Medium (3-5): Complex, musical phrases
- High (6-7): Very dense, thousands of notes

**Angle:** Turn angle in degrees (0-180)

- Small (10-30°): Narrow branching
- Medium (45-90°): Balanced
- Large (120-180°): Wide spread

### Built-in Fractal Presets

Use the **Fractal Preset** dropdown for instant setup:

1. **Algae** - Organic branching growth
2. **Tree** - Binary tree structure
3. **Dragon** - Space-filling spiral
4. **Koch** - Snowflake symmetry
5. **Sierpinski** - Triangle recursion

---

## 🎵 Parameter Mapping

### What is Mapping?

Mapping connects fractal geometry to sound parameters. Each line segment in the fractal becomes a musical note, and the segment's properties control the sound.

### Key Mappings

**Pitch Mapping** (What determines note pitch?)

- **Angle → Pitch** (default): Segments at different angles = different pitches
- **Position → Pitch**: Notes rise as the fractal progresses
- **Depth → Pitch**: Deeper recursion = higher notes
- **Random Walk**: Unpredictable melodic motion

**Duration Mapping** (How long are notes?)

- **Constant** (default): All notes same length
- **Depth → Duration**: Deeper notes = longer
- **Inverse Depth**: Deeper notes = shorter (staccato effect)

**Timbre Mapping** (Brightness/tone color)

- **None**: Fixed brightness
- **Angle → Brightness** (default): Different angles = different tone colors
- **Depth → Brightness**: Deeper = brighter (or darker, depending on instrument)

**Pan Mapping** (Stereo position)

- **None**: Centered
- **Angle → Pan** (default): Segments pan left/right by angle
- **Position → Pan**: Sound moves left to right over time
- **Depth → Pan**: Deeper = more extreme panning

### Advanced Mappings

**Attack Mapping** (Note fade-in time: 1-1000ms)

- **Manual** (default): Use slider value
- **Depth → Attack**: Deeper = slower attack
- **Inverse Depth**: Deeper = faster attack (punchy)

**Release Mapping** (Note fade-out time: 10-2000ms)

- **Manual** (default): Use slider value
- **Depth → Release**: Deeper = longer tail
- **Inverse Depth**: Deeper = shorter tail

**Reverb Room Size Mapping**

- **Manual** (default): Fixed room size
- **Depth/Angle/Position**: Room size changes per note
- **Inverse Depth**: Deeper notes = drier sound

**Reverb Wet Mix Mapping**

- **Manual** (default): Fixed reverb amount
- **Inverse Depth** (recommended): Deeper notes = drier, keeps clarity

---

## 🎹 Instrument Guide

### Melodic Instruments (5)

1. **Karplus-Strong Pluck**
   - Best for: Fast arpeggios, bright melodies
   - Timbre: Plucked string (guitar/harp-like)
   - Speed: Works great at 120-240 BPM

2. **FM Bell**
   - Best for: Shimmering textures, cascading melodies
   - Timbre: Metallic, bell-like harmonics
   - Speed: 80-180 BPM

3. **Additive Bell**
   - Best for: Long reverb tails, atmospheric soundscapes
   - Timbre: Pure, crystal-like tones
   - Speed: 60-120 BPM (slow tempos for ambience)

4. **Clarinet**
   - Best for: Warm, organic melodies
   - Timbre: Woodwind, odd harmonics
   - Speed: 70-140 BPM

5. **Organ**
   - Best for: Drones, sustained chords, cathedral ambience
   - Timbre: Harmonic-rich, sustained tones
   - Speed: 40-100 BPM (low polyphony for chords: 4-8 voices)

### Textural Instruments (3)

6. **Granular Synthesis**
   - Best for: Evolving clouds, swarms, experimental textures
   - Controls: Density, grain size, pitch variation, texture (tone/noise mix)
   - Mappings: Use "Depth → Density" for evolving clouds

7. **Complex FM (4-operator)**
   - Best for: Metallic cascades, evolving timbres, bell-like sounds
   - Algorithms: Parallel (4 carriers), Cascade (chain), Stack (2 pairs), Complex (diamond)
   - Mappings: "Angle → Mod Index" for dynamic brightness

8. **Noise & Filters**
   - Best for: Wind, storms, rhythmic pulses, textural backgrounds
   - Controls: Noise color (white/pink/brown), filter type (LP/BP/HP), frequency, resonance, LFO
   - Safety: Resonance capped at Q=5 to prevent filter explosion

---

## 💾 Saving Your Work

### Save a Preset

1. Configure all parameters (fractal, sound, mappings, effects)
2. Type a name in the "Preset name..." field
3. Click **SAVE**
4. Your preset appears in the dropdown list

### Load a Preset

1. Select preset from dropdown
2. Click **LOAD**
3. If "Auto-play on load" is checked, it starts immediately

### Delete a Preset

1. Select preset from dropdown
2. Click **DELETE**
3. Confirm deletion

### Clear All Presets

1. Click the **🗑️** button next to the factory preset loader
2. Confirm to clear localStorage
3. Reload factory presets with **🏭 LOAD FACTORY (57)**

---

## 🎭 Live Performance Tips

### Setup for Performance

1. **Enable "Auto-play on load"** (checkbox below preset buttons)
2. Load factory presets (**🏭 LOAD FACTORY (57)**)
3. Create a setlist by saving custom presets with numbers:
   - "1 - Opening Texture"
   - "2 - Fast Build"
   - "3 - Ambient Breakdown"
   - etc.

### Performance Workflow

1. **Load preset** → Plays immediately (auto-play enabled)
2. **Adjust master volume** in real-time (no restart)
3. **Tweak reverb** during playback for live dynamics
4. **Load next preset** → Instant transition
5. Use **STOP** button to end current preset cleanly

### Real-time Controls (No Restart)

These controls update immediately during playback:

- Master Volume
- Room Size
- Reverb Wet Mix

### Controls That Require Restart

These controls restart playback automatically:

- Sound Preset (instrument selection)
- Pitch/Duration/Timbre/Pan Mapping
- Attack/Release Mapping
- Reverb Mapping
- All fractal parameters (axiom, rules, iterations, angle)
- Complex instrument mappings (granular, FM, noise)

---

## 🐛 Troubleshooting

### No Sound?

1. **Check browser volume:** System sound must be on
2. **Check master volume:** Should be 50-90%
3. **Open browser console:** Look for Csound errors (F12 or Cmd+Option+J)
4. **Refresh page:** Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
5. **Check reverb mix:** If at 100%, sound may be too quiet

### Audio Glitches?

1. **Lower polyphony:** Reduce Max Polyphony to 1-2
2. **Reduce events:** Lower Max Events to 300-400
3. **Close other tabs:** Free up CPU/memory
4. **Use simpler instruments:** Pluck/FM Bell are lighter than Granular/Complex FM

### Visualization Not Updating?

1. **Check Max Events:** Increase to 500+ for denser fractals
2. **Increase iterations:** Higher iterations = more visible detail
3. **Change color mode:** Try "Color by Depth" for better visibility

### Presets Not Loading?

1. Click **🏭 LOAD FACTORY (57)** to reload
2. Check alert for count (should say "57 total")
3. If list is empty, click **🗑️** to clear storage, then reload factory presets

### Factory Presets Already Exist?

Factory presets only load if they don't exist. To force reload:

1. The green button now forces reload (overwrites existing)
2. Or clear all presets with **🗑️**, then reload

---

## 🎨 Creative Workflows

### Workflow 1: Fractal Exploration

1. Start with **Algae** fractal preset
2. Change **instrument** to each one and listen
3. Try **Angle → Pitch** vs **Position → Pitch** mapping
4. Adjust **iterations** (3-5) to control density
5. Save favorites as custom presets

### Workflow 2: Instrument Deep Dive

1. Pick one instrument (e.g., **Granular**)
2. Load all granular presets (Cloud Texture, Dense Swarm, Sparse Bells)
3. Try different fractals (Algae, Tree, Dragon, Koch, Sierpinski)
4. Explore complex instrument mappings (density, size, pitch var, texture)
5. Save variations

### Workflow 3: Ambient Soundscape

1. Choose **Organ** or **Bell** instrument
2. Set **tempo: 50-70 BPM**
3. Set **max polyphony: 4-8 voices**
4. Use **Depth → Release** mapping for long tails
5. Set **reverb: 80-90%, room size: 0.9**
6. Use **Sierpinski** or **Tree** fractal
7. Let it play and add real-time volume/reverb adjustments

### Workflow 4: Fast Rhythmic Patterns

1. Load any **⚡ Fast Tempo** preset (160-240 BPM)
2. Use **Pluck** or **Noise** instrument
3. Set **max polyphony: 1** (monophonic)
4. Use **Angle → Pitch** for melodic variation
5. Try **Constant** duration vs **Inverse Depth**
6. Lower **reverb wet mix: 20-30%** for clarity

### Workflow 5: Generative Composition

1. Create 4-6 custom presets with contrasting characters
2. Name them: "A - Intro", "B - Build", "C - Peak", "D - Outro"
3. Enable **Auto-play on load**
4. Load them in sequence for a complete piece
5. Record audio output with system audio capture

---

## 🔧 Advanced Tips

### Fractal Design

- **Small angle changes (5-10°)** create dramatic shifts in geometry
- **Even iterations** (2, 4, 6) often more balanced than odd
- **Rules with bracketing** `[+F]` create branching structures
- **Multiple rules** (F=..., G=...) enable more complex patterns

### Mapping Strategy

- **Inverse mappings** create contrast (e.g., Inverse Depth → Reverb Wet)
- **Position mapping** works best with Dragon/spiral fractals (linear progression)
- **Angle mapping** best with branching fractals (Algae, Tree, Sierpinski)
- **Depth mapping** creates layers (deep = different character)

### Spatialization

- **Stereo Pan Type:** Simple left/right panning (good for headphones)
- **Ambisonic Pan Type:** 1st-order B-format → stereo decode (wider stereo image on speakers)
- Use **Position → Pan** for sweeping left-to-right motion
- Use **Angle → Pan** for bouncing between speakers

### Performance Optimization

- **Lower Max Events** (100-300) for real-time tweaking
- **Increase Max Events** (800-2000) for final renders
- **Polyphony = 1** is fastest (no voice management overhead)
- **Complex FM** and **Granular** are CPU-heavy (use sparingly in dense fractals)

---

## 📚 Next Steps

1. **Read [TECHNICAL.md](TECHNICAL.md)** - Deep dive into architecture, Csound code, and JavaScript implementation
2. **Explore the code** - `app.html` is a single-file application, well-commented
3. **Create your own presets** - Build a personal preset library
4. **Share your work** - Export presets (copy JSON from localStorage) and share with others
5. **Experiment with custom L-systems** - Create your own axiom/rules combinations

---

## ❓ FAQ

**Q: Can I use this offline?**  
A: Yes! The app loads Csound from CDN, but once cached, it works offline. Save the file locally.

**Q: Can I export audio?**  
A: Use system audio recording (QuickTime on Mac, Audacity on Windows/Linux) to capture output.

**Q: Can I add my own instruments?**  
A: Yes! Edit the Csound orchestra code in `app.html` (search for `orchestraCode =`). Add new instruments and update the preset dropdown.

**Q: How do I share presets?**  
A: Open browser console, type: `localStorage.getItem('fractalPresets')`, copy JSON, send to friend. They paste into console: `localStorage.setItem('fractalPresets', 'PASTE_HERE')`.

**Q: What's the maximum fractal complexity?**  
A: Iterations are limited to 7 to prevent browser crashes. Higher iterations create exponentially more notes (e.g., iteration 7 of Algae = ~16,000 segments).

**Q: Can I change the fractal during playback?**  
A: No, fractal changes require regeneration (automatic restart). Only master volume and reverb update in real-time.

**Q: Why is the red cursor dot so visible?**  
A: The 6px radius cursor dot helps you see exactly which note is playing, even in dense fractals. It has a 15px glow for visibility.

**Q: Do presets save reverb mappings?**  
A: Yes! All 57 factory presets include reverb mapping settings. Many use "Inverse Depth → Reverb Wet" for evolving spatial character.

---

## 🎉 Happy Fractal Music Making!

**Dr.C - Fractal Explorer - (L-Systems)**  
Created by Richard Boulanger • Powered by Csound WASM 7

For technical details, see [TECHNICAL.md](TECHNICAL.md)  
For source code, visit [GitHub](https://github.com/rboulanger/fractal-explorer)
