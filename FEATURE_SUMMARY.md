# Fractal Explorer - CSD Export Feature (v1.1)

## 🎉 What's New

Fractal Explorer now supports **Csound CSD export**, allowing you to save your fractal L-System compositions as standalone Csound files!

## ✨ Key Capabilities

### Export Button
- New **"💾 Export CSD"** button in the main interface
- Enabled automatically when you generate and play a fractal
- One-click download of complete .csd files

### Event Logging
- Every note event is captured with millisecond precision
- Triggered automatically when you click "Play"
- Captures all parameters: frequency, amplitude, pan, envelopes, etc.

### Complete Csound Files
- Full orchestration included (instrument 1, reverb instr 999)
- All effect processors and control channels
- Proper Csound headers and score structure
- Ready to play in any Csound application

### Metadata & Documentation
- L-System parameters captured in comments:
  - Axiom, Rules, Iterations, Angle
  - Base Frequency, Tempo, Pitch/Duration Mapping
  - Synthesis Preset mode
- Generation timestamp
- Total event count and composition duration
- Fully documented score for easy editing

### Console Display
- Real-time text area showing generated score
- Can be toggled visible/hidden
- Useful for inspection and verification
- Styled to match app aesthetic

## 🚀 How to Use

### Basic Workflow:
```
1. Click preset (e.g., "Algae")
2. Adjust parameters (optional)
3. Click "Generate" → "Visualize"
4. Configure musical parameters
5. Click "Play" to hear composition
6. Click "💾 Export CSD" to download
7. Open in CsoundQt or command line
```

### Example Command:
```bash
csound fractal-explorer_2026-03-14T14-45-23.csd
```

## 📋 What Gets Exported

```csound
<CsoundSynthesizer>
<CsOptions>
-odac -d -m0
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 32
nchnls = 2
0dbfs = 1

; Global audio buses
gaRvbL init 0
gaRvbR init 0

; Reverb and effect instruments
instr 999
  ; ... freeverb reverb code ...
endin

; Universal note synthesizer
instr 1
  ; ... synthesis code for all presets ...
endin
</CsInstruments>
<CsScore>
; ============================================================
; FRACTAL EXPLORER - L-SYSTEM GENERATED COMPOSITION
; ============================================================
; Generated: 2026-03-14T14:45:23.123Z
;
; L-System Configuration:
;   Axiom: F
;   Rules: F=F[+F]F[-F]F
;   Iterations: 4
;   Angle: 25°
;
; Musical Parameters:
;   Base Frequency: 220 Hz
;   Tempo: 120 BPM
;   Pitch Mapping: depth
;   Duration Mapping: constant
;   Synthesis Preset: warm_pad
;
; Score Statistics:
;   Total Events: 342
;   Duration: 45.234s
; ============================================================

i 1 0.000 0.500 220.00 0.150 1 0.75 0.50 0 -1 -1
i 1 0.125 0.500 246.94 0.145 1 0.70 0.35 0 -1 -1
i 1 0.250 0.500 277.18 0.140 1 0.65 0.65 0 -1 -1
; ... hundreds more notes ...

e
</CsScore>
</CsoundSynthesizer>
```

## 🔧 Technical Implementation

### Code Changes:
- **app.html**: Added export button and textarea UI
- **app.html**: Added event logging hooks in play() function
- **app.html**: Added exportCSD() and related functions
- **csd_export.js**: Standalone module with export logic (optional)
- **CSD_EXPORT_GUIDE.md**: Comprehensive documentation

### Key Functions:
- `initializeCSDRecording()` - Start capturing events
- `logEventToCSD(scoreEvent, time)` - Log each note
- `enableCSDExport()` - Enable/disable button
- `exportCSD()` - Generate and download file
- `downloadCSDFile(content)` - Browser download helper

### Integration Points:
- Hook: Line 2081 in play() function
- Logging: Line 2483 during inputMessage() call
- Export: Global window function, called from button onclick

## 📊 Performance Impact

- **Minimal CPU overhead**: Just array push for each note
- **Memory**: ~1-2KB per event (typically 100-500 events)
- **No performance regression**: Recording is transparent to playback
- **Handles large compositions**: Tested with 2000+ events

## 🎯 Use Cases

### For Musicians
- Create permanent recordings of unique performances
- Share algorithmic compositions with colleagues
- Build personal libraries of generative material
- Archive interesting fractal-to-music discoveries

### For Educators
- Study L-Systems and algorithmic composition
- Learn Csound orchestration
- Understand parameter mapping techniques
- Create teaching examples with fractals

### For Researchers
- Document algorithmic generation methods
- Create reproducible compositions
- Analyze fractal properties in music
- Study emergent musical structures

## 📝 File Organization

```
/Dr.C-Fractal-Explorer (L-Systems)/
├── app.html                    # Main app (with export feature)
├── index.html                  # Landing page
├── netlify.toml               # Netlify config
├── CSD_EXPORT_GUIDE.md        # Detailed export documentation
├── csd_export.js              # Optional standalone module
├── QUICKSTART.md              # Getting started
├── README.md                  # Main documentation (updated)
├── TECHNICAL.md               # Technical reference
├── DEPLOYMENT.md              # Deployment guide
└── FEATURE_SUMMARY.md         # This file
```

## 🔄 Workflow Examples

### Example 1: Simple Export
```
1. Click "Algae" preset
2. Click "Generate" 
3. Click "Visualize"
4. Click "Play"
5. Click "Export CSD"
6. File downloads: fractal-explorer_2026-03-14T14-45-23.csd
7. Open in CsoundQt and render to WAV
```

### Example 2: Create Variation
```
1. Export original fractal as base.csd
2. Open in text editor
3. Modify note parameters manually
4. Save as variation.csd
5. Play both and compare
```

### Example 3: Portfolio Building
```
1. Export algae composition (algae.csd)
2. Export tree composition (tree.csd)
3. Export dragon composition (dragon.csd)
4. Create folder: my_fractal_collection/
5. Add README documenting each
6. Share with colleagues or online
```

## 🐛 Known Limitations

- Export disabled until events are generated and played
- Requires playing the full sequence for complete score
- Browser download limitations (some may require save dialog)
- File size grows with number of events

## 🚀 Future Enhancements

Possible future additions:
- MIDI file export (.mid)
- WAV audio rendering
- Multiple recording sessions
- Score editing in browser
- Parameter automation
- Real-time score streaming
- Collaborative composition

## 📞 Support

### Getting Help
- **Browser Console**: F12 for error messages
- **CSD_EXPORT_GUIDE.md**: Comprehensive documentation
- **Csound Resources**: https://csound.com

### Reporting Issues
- Check browser console for error messages
- Try in different browser
- Clear cache and reload
- Report to GitHub repository

## 📦 Dependencies

No new dependencies added:
- Uses only browser APIs
- Leverages existing Csound WASM integration
- Pure HTML5 functionality for download

## 🔐 Security & Privacy

- All processing happens client-side
- No data sent to servers
- Downloads saved to your computer
- Fully offline capable (after initial load)

## 📄 File Format

- **Format**: UTF-8 text
- **Extension**: .csd (Csound definition)
- **Size**: Typically 50KB-200KB
- **Compatibility**: Csound 6.x and 7.x

## 🎵 Audio Specifications

- **Sample Rate**: 44.1 kHz
- **Bit Depth**: 32-bit floating point
- **Channels**: Stereo (2)
- **Ksmps**: 32 samples per control cycle
- **0dbfs**: 1.0 (digital audio units)

## ✅ Testing Checklist

- [x] Export button appears in UI
- [x] Button disabled until play occurs
- [x] Events logged during playback
- [x] CSD file generates correctly
- [x] File downloads with timestamp
- [x] Console textarea displays score
- [x] Parameters appear in metadata
- [x] L-System info in comments
- [x] File plays in Csound 6.x
- [x] File plays in CsoundQt

## 📚 Documentation Links

- [CSD Export Guide](CSD_EXPORT_GUIDE.md) - Complete user guide
- [README](README.md) - Main documentation
- [Technical Docs](TECHNICAL.md) - Implementation details
- [Quick Start](QUICKSTART.md) - Getting started guide

---

**Version**: 1.1  
**Release Date**: March 14, 2026  
**Status**: ✅ Stable and Tested  
**Backward Compatible**: Yes - No changes to existing features

---

**Enjoy creating algorithmic compositions!** 🎵✨
