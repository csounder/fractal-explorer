# Fractal Explorer - CSD Export Feature

## Overview

The **CSD Export** feature allows you to capture your fractal L-System compositions and export them as **standalone Csound (.csd) files** that can be:

- Replayed in any Csound application
- Edited and modified in CsoundQt or Cabbage
- Shared with other Csound musicians and composers
- Archived as unique algorithmic compositions
- Used as educational resources

## How It Works

### Step 1: Generate a Fractal
1. Select or create an L-System (e.g., Algae, Tree, Dragon)
2. Adjust parameters (Axiom, Rules, Iterations, Angle)
3. Click **"Generate"** to create the pattern
4. Click **"Visualize"** to see it rendered

### Step 2: Configure Musical Parameters
Set up how the fractal maps to sound:
- **Base Frequency**: Starting pitch (100-1000 Hz)
- **Tempo**: Speed (60-240 BPM)
- **Pitch Mapping**: How visual properties affect pitch
- **Duration Mapping**: How visual properties affect note length
- **Synthesis Preset**: Which instrument to use

### Step 3: Play and Refine
- Click **"Play"** to hear your composition
- Adjust reverb, room size, and effects as desired
- Fine-tune the sound to your liking

### Step 4: Export to CSD
- Click **"💾 Export CSD"** button
- A complete .csd file is automatically generated
- The file downloads to your computer
- A preview appears in the console window on screen

## What Gets Exported

### The Complete Csound File Includes:

**Orchestra Section:**
- Full Csound instrument code matching your synthesis preset
- All effect processors (freeverb, reverb, ambisonic decoder)
- Global control channels for all parameters
- Properly configured sample rate, buffer size, and channels

**Score Section:**
- Every note event with precise timing
- Frequency, amplitude, pan, and other parameters
- Attack and release envelope times
- Brightness and spatialization settings

**Metadata Comments:**
- L-System configuration (Axiom, Rules, Iterations, Angle)
- Musical mapping parameters
- Timestamp of generation
- Total number of events
- Composition duration

## Use Cases

### 🎓 Educational
- Study L-Systems and algorithmic composition
- Learn Csound orchestration
- Understand parameter mapping in generative music
- Document compositional techniques

### 🎨 Creative
- Create permanent recordings of unique performances
- Export for editing in CsoundQt or Cabbage
- Share scores with fellow composers
- Build libraries of generative material
- Use as inspiration for new works

### 🔬 Research
- Analyze fractal properties in music
- Document algorithmic generation methods
- Create reproducible compositions
- Archive compositional experiments
- Study emergent musical structures

## Playing Exported Files

### Option 1: Csound Command Line
```bash
csound yourfile.csd
```

### Option 2: CsoundQt
1. Open CsoundQt
2. File → Open → Select your .csd file
3. Click ▶ (Run) or press Ctrl+Return

### Option 3: Cabbage
1. Open Cabbage
2. File → Open Csound File
3. Click ▶ (Build and Run)

### Option 4: Online Csound Editor
Visit https://ide.csound.com and upload your .csd file

## Tips & Tricks

### Export Multiple Times
- Try different reverb settings before exporting
- Export the same fractal with different synthesis presets
- Create variations by exporting at different iterations

### Customizing Exported Files
Once exported, you can edit the .csd file in any text editor to:
- Change reverb settings
- Adjust master volume
- Modify note parameters
- Add additional effects

## File Naming Convention

Exported files use automatic naming:
```
fractal-explorer_YYYY-MM-DDTHH-MM-SS.csd
```

Example: `fractal-explorer_2026-03-14T14-45-23.csd`

## Technical Details

### Audio Quality
- **Sample Rate**: 44.1 kHz (CD quality)
- **Bit Depth**: 32-bit floating point
- **Channels**: Stereo (2 channels)
- **Ksmps**: 32 samples per k-cycle

### Synthesis Parameters
The exported instrument uses:
- **p4**: Frequency (Hz)
- **p5**: Amplitude (0-1)
- **p6**: Synthesis preset (0-9)
- **p7**: Brightness/Filter cutoff (0-1)
- **p8**: Panning (0-1, where 0.5 = center)
- **p9**: Panning type (0 = stereo, 2 = ambisonic)
- **p10**: Attack time in seconds (-1 = use global)
- **p11**: Release time in seconds (-1 = use global)

## Troubleshooting

### Export Button Disabled
**Problem**: The export button is grayed out
**Solution**: Generate a fractal and click Play first. Events must be generated and played before export is available.

### Downloaded File Won't Play
**Problem**: File seems corrupted or Csound won't open it
**Solution**: 
- Verify it's actually a text file (not binary)
- Check for syntax errors by opening in text editor
- Try in browser-based Csound IDE first
- Ensure Csound version is compatible (6.x or 7.x)

### Events Missing from Export
**Problem**: Some notes didn't get recorded
**Solution**:
- Make sure you played the full sequence (don't stop early)
- Check that Play didn't encounter errors
- Try generating with fewer iterations for simpler score

---

**Enjoy exporting your algorithmic compositions!** 🎵✨

For more information about Csound, visit https://csound.com
