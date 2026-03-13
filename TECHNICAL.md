# Technical Documentation

## Dr.C - Fractal Explorer - (L-Systems)

**Comprehensive technical analysis of architecture, implementation, and audio synthesis.**

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Csound Audio Engine](#csound-audio-engine)
3. [L-System Generator](#l-system-generator)
4. [Parameter Mapping System](#parameter-mapping-system)
5. [Preset System](#preset-system)
6. [Visualization](#visualization)
7. [Performance Optimization](#performance-optimization)
8. [Extending the System](#extending-the-system)

---

## Architecture Overview

### Single-File Web Application

**File:** `app.html` (~4500 lines)

**Structure:**

```
<!DOCTYPE html>
<html>
  <head>
    <style>...</style>           <!-- CSS styling (green theme, 3D effects) -->
  </head>
  <body>
    <div class="container">
      <!-- Left Panel: Visualization Canvas -->
      <!-- Right Panel: All Controls -->
    </div>

    <script type="module">
      // Csound WASM 7 initialization
      // L-system generator
      // Fractal-to-music mapper
      // Preset system
      // Visualization engine
      // Event scheduler
    </script>
  </body>
</html>
```

### Technology Stack

| Component      | Technology         | Version      |
| -------------- | ------------------ | ------------ |
| Audio Engine   | Csound WASM        | 7.0.0-beta26 |
| Module Loading | ES6 Dynamic Import | Native       |
| Audio Output   | Web Audio API      | Native       |
| Visualization  | HTML5 Canvas       | 2D Context   |
| Storage        | localStorage API   | Native       |
| UI Framework   | Vanilla JavaScript | ES6+         |

### Data Flow

```
User Input
  ↓
L-System Generator → Path Array [{x, y, angle, depth}]
  ↓
Parameter Mapper → Note Events [{time, freq, dur, amp, ...}]
  ↓
JavaScript setTimeout Scheduler → Csound inputMessage()
  ↓
Csound Synthesis Engine → Web Audio API
  ↓
Audio Output (speakers/headphones)
```

### Key Design Decisions

1. **Single-file deployment:** Entire app in one HTML file for easy distribution
2. **Client-side processing:** No server required, runs in browser
3. **JavaScript-based scheduling:** Uses `setTimeout()` instead of Csound score queue for precise stop control
4. **Real-time parameter control:** Master volume and reverb update via control channels without restarting playback
5. **Factory preset bank:** 57 presets embedded in JavaScript object, loaded to localStorage on first run

---

## Csound Audio Engine

### Initialization

**Code Location:** Lines ~1045-1555 in `app.html`

```javascript
async function initCsound() {
  // Dynamic ES6 import from CDN
  const { Csound } = await import(
    "https://cdn.jsdelivr.net/npm/@csound/browser@7.0.0-beta26/dist/csound.js"
  );

  // Create Csound instance
  csound = await Csound({
    useWorker: false, // Run in main thread for lower latency
    useSPN: false, // No Scientific Pitch Notation
    outputChannelCount: 2, // Stereo output
  });

  // Compile orchestra
  await csound.compileOrc(orchestraCode);

  // Set audio output
  await csound.setOption("-odac");

  // Start performance thread
  await csound.start();

  // Start always-on effect instruments
  await csound.inputMessage("i 998 0 -1"); // Ambisonic decoder
  await csound.inputMessage("i 999 0 -1"); // Global reverb
}
```

### Orchestra Architecture

**Sample Rate:** 44100 Hz  
**Block Size:** 32 samples (ksmps)  
**Channels:** 2 (stereo)  
**0dbfs:** 1.0 (normalized)

#### Global Audio Buses

```csound
; Stereo reverb sends
gaRvbL init 0
gaRvbR init 0

; B-format ambisonic buses (1st order: W, X, Y, Z)
gaAmbiW init 0
gaAmbiX init 0
gaAmbiY init 0
gaAmbiZ init 0
```

#### Control Channels

```csound
chnset 0.01, "globalAttack"    ; Default attack: 10ms
chnset 0.1, "globalRelease"    ; Default release: 100ms
chnset 0.75, "roomSize"        ; Reverb room size: 0-1
chnset 0.45, "reverbWet"       ; Reverb wet mix: 0-1
chnset 0.7, "masterVolume"     ; Master volume: 0-1
chnset 0, "stopAll"            ; Emergency stop flag
```

### Instrument Design

#### Instrument 1: Universal Melodic Instrument

**P-fields:**

- p1: Instrument number (1)
- p2: Start time (0 = now)
- p3: Duration (seconds)
- p4: Frequency (Hz)
- p5: Amplitude (0-1)
- p6: Preset number (2=pluck, 3=FM bell, 4=additive bell, 5=clarinet, 8=organ)
- p7: Brightness (0-1, controls timbre)
- p8: Pan (0-1, stereo or azimuth for ambisonic)
- p9: Pan type (0=stereo, 2=ambisonic)
- p10: Attack override (if >= 0, use this; else use global channel)
- p11: Release override (if >= 0, use this; else use global channel)

**Synthesis Methods:**

1. **Karplus-Strong Pluck (preset 2):**

```csound
aNoise noise 1, 0                          ; White noise burst
aDelSig delayr 1/iFreq                     ; Delay line (period = 1/freq)
aFilt tone aDelSig, iFreq*2                ; Lowpass filter
  delayw aNoise*0.001 + aFilt*0.998       ; Feedback with decay
aSig = aFilt * aEnv * ampdb(-6)
```

2. **FM Bell (preset 3):**

```csound
kMod = 2 + iBright*3                       ; Modulation index: 2-5
iModRatio = 1.4                            ; Modulator ratio
aSig foscili aEnv, iFreq, 1, iModRatio, kMod, -1
aSig *= ampdb(-12)
```

3. **Additive Bell (preset 4):**

```csound
; 5 harmonic partials with exponential decay
a1 oscili aEnv*1.0, iFreq*1, -1
a2 oscili aEnv*0.5*expseg(1,p3,0.01), iFreq*2.76, -1
a3 oscili aEnv*0.3*expseg(1,p3,0.001), iFreq*5.4, -1
a4 oscili aEnv*0.15*expseg(1,p3,0.0001), iFreq*8.93, -1
a5 oscili aEnv*0.1*expseg(1,p3,0.00001), iFreq*13.34, -1
aSig = (a1 + a2 + a3 + a4 + a5) * ampdb(-18)
```

4. **Clarinet (preset 5):**

```csound
; Odd harmonics only (1, 3, 5, 7, 9)
a1 oscili aEnv*1.0, iFreq*1, -1
a3 oscili aEnv*0.3, iFreq*3, -1
a5 oscili aEnv*0.2, iFreq*5, -1
a7 oscili aEnv*0.1, iFreq*7, -1
a9 oscili aEnv*0.05, iFreq*9, -1
aSig = (a1 + a3 + a5 + a7 + a9) * ampdb(-12)
```

5. **Organ (preset 8):**

```csound
; 6 harmonic drawbars (8', 4', 2 2/3', 2', 1 3/5', 1 1/3')
a1 oscili aEnv*1.0, iFreq*1, -1
a2 oscili aEnv*0.7, iFreq*2, -1
a3 oscili aEnv*0.5, iFreq*3, -1
a4 oscili aEnv*0.4, iFreq*4, -1
a5 oscili aEnv*0.3, iFreq*5, -1
a6 oscili aEnv*0.2, iFreq*6, -1
aSig = (a1 + a2 + a3 + a4 + a5 + a6) * ampdb(-18)
```

**Brightness Control:**
All presets scale amplitude by `iBright^2` (0-1), making higher brightness = louder and more present.

**Envelope:**

```csound
if (iAtkP >= 0) then
  iAtk = iAtkP                  ; Use p-field override
else
  iAtk = i(chnget:k("globalAttack"))  ; Use global channel
endif

if (iRelP >= 0) then
  iRel = iRelP
else
  iRel = i(chnget:k("globalRelease"))
endif

aEnv linsegr 0, iAtk, iAmp, iRel, 0   ; Linear attack/release with release segment
```

**Spatialization:**

```csound
if (iPanType == 0) then
  ; Stereo panning
  aL, aR pan2 aSig, iPan
  gaRvbL += aL
  gaRvbR += aR
elseif (iPanType == 2) then
  ; 1st-order ambisonic encoding
  iAzim = iPan * 360    ; Convert 0-1 to 0-360 degrees
  aW, aX, aY, aZ bformenc1 aSig, iAzim, 0
  gaAmbiW += aW
  gaAmbiX += aX
  gaAmbiY += aY
  gaAmbiZ += aZ
endif
```

#### Instrument 2: Granular Synthesis

**P-fields:**

- p1-p5: Standard (instr, start, dur, freq, amp)
- p6: Density (grains/sec, default: 20)
- p7: Grain size (seconds, default: 0.05)
- p8: Pitch variation (0-1, default: 0.1 = ±10%)
- p9: Texture (0=pure tone, 1=pure noise, 0.5=mixed)
- p10-p13: Pan, panType, attack, release

**Implementation:**

```csound
kTrig metro iDensity                      ; Grain trigger
kPitchRand randomi 1-iPitchVar, 1+iPitchVar, iDensity*0.3
kGrainFreq = iFreq * kPitchRand

aGrainEnv linseg 0, iGrainSize*0.3, 1, iGrainSize*0.4, 1, iGrainSize*0.3, 0

aTone oscili 1, kGrainFreq, -1
aNoise noise 1, 0
aSource = aTone*(1-iTexture) + aNoise*iTexture

aSig = aSource * aGrainEnv * aEnv * ampdb(-6)
```

**Mappings:**

- Density: Constant (20), or map to depth/angle/position (5-40 grains/sec)
- Grain Size: Constant (50ms), or map to depth/angle/inverse (10-100ms)
- Pitch Variation: None (0), or map to depth/angle/random (0-0.3 = ±30%)
- Texture: Pure tone (0), or map to depth/angle (0-1)

#### Instrument 3: Complex FM (4-Operator)

**P-fields:**

- p1-p5: Standard
- p6: Modulation index (0.1-4, clamped for safety)
- p7: Algorithm (0=parallel, 1=cascade, 2=stack, 3=complex)
- p8: Carrier ratio shift (0.5-2, multiplies all carrier frequencies)
- p9: Operator mix (0-1, balance between operators)
- p10-p13: Pan, panType, attack, release

**Operator Frequency Ratios:**

```csound
iRatio1 = 1 * iCarrierRatio       ; Fundamental
iRatio2 = 2.76 * iCarrierRatio    ; Bell-like
iRatio3 = 5.4 * iCarrierRatio     ; Bell-like
iRatio4 = 8.93 * iCarrierRatio    ; Bell-like
```

**Algorithms:**

1. **Parallel (0):** All 4 operators are carriers (no modulation between them)

```csound
aOp1 oscili aEnv, iFreq*iRatio1, -1
aOp2 oscili aEnv, iFreq*iRatio2, -1
aOp3 oscili aEnv, iFreq*iRatio3, -1
aOp4 oscili aEnv, iFreq*iRatio4, -1
aSig = (aOp1 + aOp2*iOpMix + aOp3*iOpMix*0.7 + aOp4*iOpMix*0.5) * 0.3
```

2. **Cascade (1):** Simple FM chain (Op4 → Op3 → Op2 → Op1)

```csound
aSig foscili aEnv, iFreq*iRatio1, iRatio2/iRatio1, iRatio3/iRatio2, iModSafe, -1
```

3. **Stack (2):** Two parallel FM pairs

```csound
aOp2 foscili aEnv*0.5, iFreq*iRatio2, 1, iRatio1/iRatio2, iModSafe, -1
aOp4 foscili aEnv*0.5, iFreq*iRatio4, 1, iRatio3/iRatio4, iModSafe, -1
aSig = (aOp2 + aOp4*iOpMix)
```

4. **Complex (3):** Diamond routing with multiple modulators

```csound
; Op1 and Op4 are simple carriers
aOp1 oscili aEnv*0.5, iFreq*iRatio1, -1
aOp4 oscili aEnv*0.5, iFreq*iRatio4, -1

; Op2 modulates Op3, Op3 becomes carrier
kMod2 = iFreq*iRatio2*iModSafe
aOp2 oscili aEnv*iModSafe*0.3, kMod2, -1
aOp3 oscili aEnv*0.5, iFreq*iRatio3 + aOp2, -1

aSig = (aOp1 + aOp3*iOpMix + aOp4*iOpMix*0.7) * 0.5
```

**Safety:** Modulation index clamped to 0.1-4 to prevent excessive sideband generation.

#### Instrument 4: Noise & Filters

**P-fields:**

- p1-p5: Standard
- p6: Noise color (0=white, 0.5=pink, 1=brown)
- p7: Filter type (0=lowpass, 1=bandpass, 2=highpass)
- p8: Filter frequency (Hz, 80-8000)
- p9: Resonance (Q factor, 0.5-5, clamped for safety)
- p10: LFO modulation rate (Hz, 0-5)
- p11-p14: Pan, panType, attack, release

**Noise Generation:**

```csound
aNoise noise 1, 0                          ; White noise

if (iNoiseColor > 0.3) then
  ; Pink noise (1/f) - lowpass filter white noise
  aNoise tone aNoise, 3000
  aNoise tone aNoise, 3000
endif

if (iNoiseColor > 0.7) then
  ; Brown noise (1/f²) - further filtering
  aNoise tone aNoise, 1000
  aNoise tone aNoise, 1000
endif
```

**Filter Modulation:**

```csound
kModRateSafe = limit(iModRate, 0, 5)
kLFO oscili iFilterFreq*0.2, kModRateSafe, -1
kCenterFreq = limit(iFilterFreq + kLFO, 100, 8000)

iResSafe = limit(iResonance, 0.5, 5)    ; CRITICAL: Prevent filter explosion
```

**Multi-Filter:**

```csound
aSig = aNoise * aEnv

if (iFilterType < 0.5) then
  ; Lowpass - moogladder with VERY low resonance
  aSig moogladder aSig, kCenterFreq, limit(iResSafe*0.01, 0, 0.05)
elseif (iFilterType < 1.5) then
  ; Bandpass - wide bandwidth to prevent blowup
  kBW = limit(kCenterFreq / max(iResSafe, 0.5), 50, kCenterFreq*0.8)
  aSig butterbp aSig, kCenterFreq, kBW
else
  ; Highpass - simple 2-pole
  aSig butterhp aSig, kCenterFreq
endif

; Hard limiting to prevent any overflow
aSig limit aSig*0.6, -0.95, 0.95
aSig *= ampdb(-3)     ; Output at -3dB for safety
```

**Safety Measures:**

- Resonance Q capped at 5 (prevents self-oscillation/explosion)
- Moogladder resonance scaled to 0-0.05 (Csound's moogladder is VERY sensitive)
- Bandpass bandwidth kept wide (prevents Q runaway)
- Hard limiter on output (±0.95)
- Output level at -3dB

#### Instrument 998: Ambisonic Decoder

**Always-on instrument** (started with `i 998 0 -1`)

```csound
; First-order ambisonic decode to stereo
; Simple stereo decode: L = W + X, R = W - X
aL = gaAmbiW + 0.707*gaAmbiX
aR = gaAmbiW - 0.707*gaAmbiX

; Send to reverb
gaRvbL += aL
gaRvbR += aR

clear gaAmbiW, gaAmbiX, gaAmbiY, gaAmbiZ
```

**Note:** Y and Z components are ignored in this simple stereo decode. Full surround would use all 4 channels.

#### Instrument 999: Global Freeverb Reverb

**Always-on instrument** (started with `i 999 0 -1`)

```csound
kRoomSize chnget "roomSize"      ; 0-1, updates in real-time
kWet chnget "reverbWet"          ; 0-1, updates in real-time
kMasterVol chnget "masterVolume" ; 0-1, updates in real-time

; Apply freeverb to accumulated signals
aRvbL, aRvbR freeverb gaRvbL, gaRvbR, kRoomSize, 0.5

; Mix dry/wet
aOutL = gaRvbL*(1-kWet) + aRvbL*kWet
aOutR = gaRvbR*(1-kWet) + aRvbR*kWet

; Apply master volume
aOutL = aOutL * kMasterVol
aOutR = aOutR * kMasterVol

out aOutL, aOutR

clear gaRvbL, gaRvbR
```

**Real-time Controls:**

- `roomSize`: Reverb decay time (0=small room, 1=cathedral)
- `reverbWet`: Dry/wet balance (0=dry, 1=wet)
- `masterVolume`: Master output level (0=silent, 1=full)

All three update immediately without restarting playback.

---

## L-System Generator

**Code Location:** Lines ~1770-1890 in `app.html`

### Algorithm

```javascript
function generateLSystem(axiom, rules, iterations) {
  let current = axiom;
  const ruleMap = {};

  // Parse rules: "F=F[+F]F[-F]F\nG=GG"
  rules.split("\n").forEach((rule) => {
    const [symbol, replacement] = rule.split("=");
    if (symbol && replacement) {
      ruleMap[symbol.trim()] = replacement.trim();
    }
  });

  // Apply rules iteratively
  for (let i = 0; i < iterations; i++) {
    let next = "";
    for (let char of current) {
      next += ruleMap[char] || char; // Replace or keep symbol
    }
    current = next;
  }

  return current;
}
```

**Exponential Growth:**

- Iteration 0: "F" = 1 symbol
- Iteration 1: "F[+F]F[-F]F" = 9 symbols
- Iteration 2: 81 symbols
- Iteration 3: 729 symbols
- Iteration 4: 6,561 symbols
- Iteration 7: ~2.2 million symbols (browser limit)

### Turtle Graphics Interpreter

```javascript
function interpretLSystem(lstring, angle) {
  const paths = [];
  const stack = [];
  let x = 0,
    y = 0,
    heading = 90; // Start pointing up
  let depth = 0;

  for (let char of lstring) {
    switch (char) {
      case "F":
      case "G":
        // Draw forward
        const rad = (heading * Math.PI) / 180;
        const newX = x + Math.cos(rad) * stepSize;
        const newY = y + Math.sin(rad) * stepSize;
        paths.push({
          x1: x,
          y1: y,
          x2: newX,
          y2: newY,
          angle: heading,
          depth: depth,
        });
        x = newX;
        y = newY;
        break;

      case "+":
        heading += angle; // Turn left
        break;

      case "-":
        heading -= angle; // Turn right
        break;

      case "[":
        stack.push({ x, y, heading, depth }); // Save state
        depth++;
        break;

      case "]":
        const state = stack.pop(); // Restore state
        if (state) {
          x = state.x;
          y = state.y;
          heading = state.heading;
          depth = state.depth;
        }
        break;
    }
  }

  return paths;
}
```

**Symbols:**

- `F`, `G`: Move forward and draw
- `+`: Turn left by angle
- `-`: Turn right by angle
- `[`: Push position/heading/depth to stack
- `]`: Pop position/heading/depth from stack

**Depth Tracking:**
Increments on `[`, decrements on `]`. Used for:

- Fractal-to-parameter mapping (deeper branches = different sound)
- Visualization coloring (color by depth)

### Built-in Fractals

```javascript
const fractalPresets = {
  algae: {
    axiom: "F",
    rules: "F=F[+F]F[-F]F",
    angle: 25,
    iterations: 4,
  },
  tree: {
    axiom: "F",
    rules: "F=FF+[+F-F-F]-[-F+F+F]",
    angle: 25,
    iterations: 4,
  },
  dragon: {
    axiom: "F",
    rules: "F=F+G\nG=F-G",
    angle: 90,
    iterations: 10,
  },
  koch: {
    axiom: "F++F++F",
    rules: "F=F-F++F-F",
    angle: 60,
    iterations: 4,
  },
  sierpinski: {
    axiom: "F-G-G",
    rules: "F=F-G+F+G-F\nG=GG",
    angle: 120,
    iterations: 5,
  },
};
```

**Mathematical Properties:**

| Fractal    | Dimension | Symmetry          | Growth                | Notes                  |
| ---------- | --------- | ----------------- | --------------------- | ---------------------- |
| Algae      | ~1.6      | None              | Exponential branching | Organic, asymmetric    |
| Tree       | ~1.7      | Bilateral         | Binary branching      | Symmetric, balanced    |
| Dragon     | 2.0       | None              | Space-filling curve   | Spiral, position-based |
| Koch       | ~1.26     | 3-fold rotational | Snowflake edges       | Crystalline, symmetric |
| Sierpinski | ~1.58     | 3-fold rotational | Triangle subdivision  | Geometric, recursive   |

---

## Parameter Mapping System

**Code Location:** Lines ~2100-2470 in `app.html`

### Mapping Architecture

```
Fractal Path Data                Parameter Mappers               Csound Score Event
┌─────────────────┐             ┌──────────────────┐            ┌────────────────┐
│ {                │             │ pitchMap(path)   │            │ i 1 0 dur      │
│   x1, y1, x2, y2 │────────────>│ durMap(path)     │───────────>│   freq amp     │
│   angle: 45°     │             │ timbreMap(path)  │            │   preset       │
│   depth: 3       │             │ panMap(path)     │            │   bright pan   │
│ }                │             │ attackMap(path)  │            │   panType      │
└─────────────────┘             │ releaseMap(path) │            │   atk rel      │
                                 │ reverbMap(path)  │            └────────────────┘
                                 └──────────────────┘
```

### Core Mappers

#### 1. Pitch Mapping

**Angle → Pitch (default):**

```javascript
const angleNorm = ((path.angle + 180) % 360) / 360; // Normalize -180 to 180 → 0 to 1
const octaveSpan = 3; // 3 octaves
const freq = baseFreq * Math.pow(2, angleNorm * octaveSpan);
```

- Full rotation = 3 octaves
- Example: baseFreq=220Hz, angle=0° → 220Hz, angle=180° → 880Hz, angle=360° → 1760Hz

**Position → Pitch:**

```javascript
const posNorm = i / Math.max(selectedPaths.length - 1, 1); // 0 to 1
const freq = baseFreq * Math.pow(2, posNorm * octaveSpan);
```

- Linear pitch rise from start to end
- Works well with Dragon (spiral) fractal

**Depth → Pitch:**

```javascript
const depthNorm = path.depth / maxDepth; // 0 to 1
const freq = baseFreq * Math.pow(2, depthNorm * octaveSpan);
```

- Deeper branches = higher pitch
- Creates layered textures

**Random Walk:**

```javascript
randomPitch += (Math.random() - 0.5) * 0.3; // Brownian motion
randomPitch = Math.max(-1.5, Math.min(1.5, randomPitch)); // Clamp to ±1.5 octaves
const freq = baseFreq * Math.pow(2, randomPitch);
```

- Drunk walk, bounded to ±1.5 octaves
- Unpredictable melodies

#### 2. Duration Mapping

**Constant:**

```javascript
const dur = beatDur; // One beat per note
```

**Depth → Duration:**

```javascript
const depthNorm = path.depth / maxDepth;
const dur = beatDur * (0.5 + depthNorm * 1.5); // 0.5x to 2x beat duration
```

- Deeper = longer notes

**Inverse Depth:**

```javascript
const depthNorm = path.depth / maxDepth;
const dur = beatDur * (2 - depthNorm * 1.5); // 2x to 0.5x beat duration
```

- Deeper = shorter notes (staccato)

#### 3. Timbre Mapping

**None:**

```javascript
const brightness = 0.5; // Fixed 50% brightness
```

**Depth → Brightness:**

```javascript
const brightness = Math.max(0.1, Math.min(1, path.depth / maxDepth));
```

**Angle → Brightness:**

```javascript
const brightness = Math.max(0.1, Math.min(1, ((path.angle + 180) % 360) / 360));
```

- Full rotation = full brightness range
- Adds timbral variety to melodies

#### 4. Pan Mapping

**None:**

```javascript
const pan = 0.5; // Center
```

**Depth → Pan:**

```javascript
const pan = Math.max(0, Math.min(1, path.depth / maxDepth));
```

- Deeper = more extreme L/R

**Angle → Pan:**

```javascript
const pan = Math.max(0, Math.min(1, ((path.angle + 180) % 360) / 360));
```

- Full rotation = full L-R sweep

**Position → Pan:**

```javascript
const pan = Math.max(0, Math.min(1, i / Math.max(selectedPaths.length - 1, 1)));
```

- Linear sweep left to right

#### 5. Attack/Release Mapping

**Manual:**

```javascript
const noteAttack = attack / 1000; // Slider value in seconds
const noteRelease = release / 1000;
```

**Depth → Attack:**

```javascript
const depthNorm = path.depth / maxDepth;
const noteAttack = 0.001 + depthNorm * 0.999; // 1ms to 1000ms
```

**Inverse Depth → Attack:**

```javascript
const depthNorm = path.depth / maxDepth;
const noteAttack = 1 - depthNorm * 0.999; // 1000ms to 1ms
```

**Same for Release** (range: 10ms to 2000ms)

#### 6. Reverb Mapping

**Manual:**

```javascript
// Set once at playback start
await csound.setControlChannel("roomSize", roomSize);
await csound.setControlChannel("reverbWet", reverbWet);
```

**Depth/Angle/Position → Room Size:**

```javascript
// Updated per-note in setTimeout
let roomNorm = roomSize; // Start with slider value
if (roomSizeMap === "depth") {
  roomNorm = pathData.depth / maxDepth;
} else if (roomSizeMap === "angle") {
  roomNorm = ((pathData.angle + 180) % 360) / 360;
} else if (roomSizeMap === "position") {
  roomNorm = noteIdx / Math.max(selectedPaths.length - 1, 1);
} else if (roomSizeMap === "inverse") {
  roomNorm = 1 - pathData.depth / maxDepth;
}
await csound.setControlChannel("roomSize", Math.max(0, Math.min(1, roomNorm)));
```

**Same for Reverb Wet Mix**

**Key Innovation:** Reverb mappings update per-note, creating evolving spatial character.

### Complex Instrument Mappings

#### Granular Synthesis

**Grain Density Map:**

```javascript
if (grainDensityMap === "constant") {
  grainDensity = 20; // 20 grains/sec
} else if (grainDensityMap === "depth") {
  grainDensity = 5 + (path.depth / maxDepth) * 35; // 5-40 grains/sec
} else if (grainDensityMap === "angle") {
  grainDensity = 5 + (((path.angle + 180) % 360) / 360) * 35;
} else if (grainDensityMap === "position") {
  grainDensity = 5 + (i / Math.max(selectedPaths.length - 1, 1)) * 35;
}
```

**Grain Size, Pitch Variation, Texture:** Similar mapping patterns (constant or fractal-mapped)

#### Complex FM

**Modulation Index Map:**

```javascript
if (fmModIndexMap === "constant") {
  modIndex = 2;
} else if (fmModIndexMap === "depth") {
  modIndex = 0.5 + (path.depth / maxDepth) * 3.5; // 0.5-4
} else if (fmModIndexMap === "angle") {
  modIndex = 0.5 + (((path.angle + 180) % 360) / 360) * 3.5;
} else if (fmModIndexMap === "position") {
  modIndex = 0.5 + (i / Math.max(selectedPaths.length - 1, 1)) * 3.5;
}
```

**Algorithm Selection:**

```javascript
const algoMap = {
  parallel: 0,
  cascade: 1,
  stack: 2,
  complex: 3,
};
const algorithm = algoMap[fmAlgorithm] || 0;
```

**Carrier Ratio Map:**

- `harmonic`: Use default ratios (1, 2.76, 5.4, 8.93)
- `depth`: Scale ratios by depth (0.5-2x)
- `angle`: Scale ratios by angle
- `bells`: Use bell ratios (fixed)

**Operator Mix Map:** Similar mapping for operator balance (0-1)

#### Noise & Filters

**Noise Type Map:**

```javascript
if (noiseTypeMap === "white") {
  noiseColor = 0;
} else if (noiseTypeMap === "depth") {
  noiseColor = path.depth / maxDepth; // 0=white, 1=brown
} else if (noiseTypeMap === "angle") {
  noiseColor = ((path.angle + 180) % 360) / 360;
}
```

**Filter Type Map:**

- `lowpass`: Always lowpass (0)
- `depth`: Map depth to 0-2 (LP → BP → HP)
- `angle`: Map angle to 0-2
- `cycle`: Cycle through filter types sequentially

**Filter Frequency, Resonance, LFO Rate:** Similar mapping patterns

---

## Preset System

**Code Location:** Lines ~2525-2750, ~2816-4360 in `app.html`

### Data Structure

```javascript
const preset = {
  // L-System (4 fields)
  axiom: "F",
  rules: "F=F[+F]F[-F]F",
  iterations: 4,
  angle: 25,

  // Sound (5 fields)
  soundPreset: "pluck",
  attack: 10,
  release: 100,
  attackMapEnv: "manual",
  releaseMapEnv: "manual",

  // Master Volume (1 field)
  masterVolume: 70,

  // Reverb (4 fields)
  roomSize: 75,
  reverb: 45,
  roomSizeMap: "manual",
  reverbWetMap: "inverse",

  // Music (7 fields)
  baseFreq: 220,
  tempo: 120,
  pitchMap: "angle",
  durMap: "constant",
  timbreMap: "angle",
  panMap: "angle",
  panType: "ambi",

  // Density (2 fields)
  maxEvents: 500,
  maxPoly: 2,

  // Visualization (1 field)
  vizColor: "single",

  // Granular Synthesis (4 fields)
  grainDensityMap: "angle",
  grainSizeMap: "depth",
  grainPitchVarMap: "angle",
  grainTextureMap: "angle",

  // Complex FM (4 fields)
  fmAlgorithm: "parallel",
  fmModIndexMap: "angle",
  fmCarrierMap: "depth",
  fmMixMap: "angle",

  // Noise & Filters (5 fields)
  noiseTypeMap: "angle",
  filterTypeMap: "depth",
  filterFreqMap: "angle",
  filterResMap: "depth",
  filterModMap: "angle",
};

// Total: 41 fields per preset
```

### Storage Backend

**localStorage API:**

```javascript
// Save all presets
localStorage.setItem("fractalPresets", JSON.stringify(presetsObject));

// Load all presets
const presets = JSON.parse(localStorage.getItem("fractalPresets") || "{}");
```

**Storage Limits:**

- Most browsers: 5-10 MB per domain
- 57 presets × ~1 KB each = ~57 KB (well within limits)
- User presets + factory presets share same storage

### Factory Preset Loading

```javascript
function loadFactoryPresets(force = false) {
  const existingPresets = JSON.parse(
    localStorage.getItem("fractalPresets") || "{}",
  );
  let addedCount = 0;
  let updatedCount = 0;

  Object.entries(factoryPresets).forEach(([name, preset]) => {
    if (!existingPresets[name]) {
      existingPresets[name] = preset;
      addedCount++;
    } else if (force) {
      existingPresets[name] = preset; // Overwrite
      updatedCount++;
    }
  });

  if (addedCount > 0 || updatedCount > 0) {
    localStorage.setItem("fractalPresets", JSON.stringify(existingPresets));
  }
}
```

**Call on Page Load:**

```javascript
window.addEventListener("DOMContentLoaded", async () => {
  loadFactoryPresets(); // Loads 57 factory presets if not present
  refreshPresetList(); // Updates dropdown
  await initCsound();
});
```

**Force Reload:**
User clicks **"🏭 LOAD FACTORY (57)"** button → calls `loadFactoryPresets(true)` → overwrites all 57 factory presets.

### Preset Categories

**Factory Presets (57 total):**

| Category         | Count | Naming Pattern                                       |
| ---------------- | ----- | ---------------------------------------------------- |
| Fractal-based    | 15    | `🌿/🌲/🐉/❄️/🔺 [Fractal]: [Descriptor]`             |
| Instrument-based | 24    | `🎸/🔔/🎵/🎷/🎹/⚛️/🌀/💨 [Instrument]: [Descriptor]` |
| Extra Noise      | 5     | `💨 Noise: [Descriptor]`                             |
| Fast Tempo       | 13    | `⚡ [Category]: [Descriptor]`                        |

**Emoji Prefixes:**

- 🌿 Algae
- 🌲 Tree
- 🐉 Dragon
- ❄️ Koch
- 🔺 Sierpinski
- 🎸 Pluck
- 🔔 FM Bell
- 🎵 Additive Bell
- 🎷 Clarinet
- 🎹 Organ
- ⚛️ Granular
- 🌀 Complex FM
- 💨 Noise & Filters
- ⚡ Fast Tempo

**Naming Convention:**

- `[Emoji] [Category]: [Descriptor]`
- Emoji for visual scanning in dropdown
- Category for grouping (fractals vs instruments)
- Descriptor for sonic character

**Example Presets:**

- `🌿 Algae: Gentle Growth` - Default preset, pluck, 100 BPM
- `⚡ Pluck: Lightning` - Fast arpeggio, 240 BPM
- `🎹 Organ: Cathedral Drone` - Slow chords, 40 BPM, 8 voices, 95% reverb
- `💨 Noise: Hurricane` - Fast noise, 220 BPM, cyclic filter, fast LFO

---

## Visualization

**Code Location:** Lines ~1766-1920 in `app.html`

### Canvas Setup

```javascript
const canvas = document.getElementById("fractalCanvas");
const ctx = canvas.getContext("2d");

// High-DPI support
const dpr = window.devicePixelRatio || 1;
canvas.width = 800 * dpr;
canvas.height = 600 * dpr;
canvas.style.width = "800px";
canvas.style.height = "600px";
ctx.scale(dpr, dpr);
```

### Drawing Algorithm

```javascript
function drawPaths(paths, bounds, highlightIndex) {
  ctx.clearRect(0, 0, 800, 600);

  // Calculate scale and center
  const margin = 50;
  const scaleX = (800 - margin * 2) / (bounds.maxX - bounds.minX);
  const scaleY = (600 - margin * 2) / (bounds.maxY - bounds.minY);
  const scale = Math.min(scaleX, scaleY);

  const centerX = 400;
  const centerY = 300;
  const offsetX = centerX - ((bounds.minX + bounds.maxX) / 2) * scale;
  const offsetY = centerY - ((bounds.minY + bounds.maxY) / 2) * scale;

  // Draw all paths
  paths.forEach((path, i) => {
    const x1 = path.x1 * scale + offsetX;
    const y1 = path.y1 * scale + offsetY;
    const x2 = path.x2 * scale + offsetX;
    const y2 = path.y2 * scale + offsetY;

    if (i === highlightIndex) {
      // Current note: bright yellow glow
      ctx.strokeStyle = "#ffff00";
      ctx.lineWidth = 8;
      ctx.shadowColor = "#ffff00";
      ctx.shadowBlur = 25;
      ctx.globalAlpha = 1.0;
    } else if (i < highlightIndex) {
      // Already played: dim green
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.25;
    } else {
      // Not yet played: full green
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 5;
      ctx.globalAlpha = 1.0;
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // Draw red cursor dot at current note endpoint
  if (highlightIndex >= 0 && highlightIndex < paths.length) {
    const path = paths[highlightIndex];
    const x2 = path.x2 * scale + offsetX;
    const y2 = path.y2 * scale + offsetY;

    ctx.shadowColor = "#ff0000";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#ff0000";
    ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.arc(x2, y2, 6, 0, Math.PI * 2); // 6px radius
    ctx.fill();
  }

  // Draw info overlay
  drawInfoOverlay(highlightIndex, paths);
}
```

### Info Overlay

```javascript
function drawInfoOverlay(highlightIndex, paths) {
  if (highlightIndex < 0 || highlightIndex >= paths.length) return;

  const path = paths[highlightIndex];

  // Semi-transparent black box
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "#000000";
  ctx.fillRect(10, 10, 320, 160);

  // White text
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Rajdhani";

  const lines = [
    `Note: ${highlightIndex + 1} / ${paths.length}`,
    `Depth: ${path.depth}`,
    `Angle: ${path.angle.toFixed(1)}°`,
    `Instrument: ${currentInstrument}`,
    `Pitch Map: ${currentPitchMap}`,
    `Timbre Map: ${currentTimbreMap}`,
    `Pan Map: ${currentPanMap}`,
    `Attack Map: ${currentAttackMap}`,
    `Release Map: ${currentReleaseMap}`,
  ];

  lines.forEach((line, i) => {
    ctx.fillText(line, 20, 30 + i * 16);
  });
}
```

### Color Modes

**Single Color (default):**
All segments draw in green (#00ff88).

**Color by Depth:**

```javascript
const depthNorm = path.depth / maxDepth;
const hue = depthNorm * 120; // 0 (red) to 120 (green)
ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
```

Deeper branches = greener color.

**Color by Angle:**

```javascript
const angleNorm = ((path.angle + 180) % 360) / 360;
const hue = angleNorm * 360; // Full hue spectrum
ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
```

Full rotation = full color wheel.

### Performance

**Optimization Techniques:**

1. **requestAnimationFrame**: Not used (setTimeout is sufficient for note-by-note updates)
2. **Path caching**: Fractal paths generated once, reused for all playback
3. **Bounds pre-calculation**: Min/max X/Y calculated once, reused for scaling
4. **Simple line drawing**: No gradients or complex fills
5. **Shadow usage**: Only on highlighted segment and cursor (not all segments)

**Typical Performance:**

- 500 paths: ~1-2ms per frame
- 1000 paths: ~2-4ms per frame
- 2000 paths: ~5-10ms per frame (still smooth)

---

## Performance Optimization

### JavaScript Event Scheduling

**Why JavaScript setTimeout instead of Csound score?**

1. **Precise Stop Control**: Can cancel all scheduled events instantly
2. **Per-note Control Channel Updates**: Reverb mapping requires per-note `setControlChannel()` calls
3. **Visualization Sync**: Easier to update canvas in same setTimeout callback
4. **No Score Queue Limits**: Csound score queue has buffer limits

**Implementation:**

```javascript
const scheduledTimeouts = [];

selectedPaths.forEach((path, i) => {
  const noteTime = time * 1000; // Convert seconds to milliseconds

  const timeoutId = setTimeout(async () => {
    if (isPlaying && csound && csoundReady) {
      // 1. Send note to Csound
      csound.inputMessage(scoreEvent);

      // 2. Update reverb control channels (if mapped)
      if (roomSizeMap !== "manual") {
        await csound.setControlChannel("roomSize", roomNorm);
      }
      if (reverbWetMap !== "manual") {
        await csound.setControlChannel("reverbWet", wetNorm);
      }

      // 3. Update visualization
      currentNoteIndex = i;
      drawPaths(selectedPathsGlobal, paths.bounds, i);
    }
  }, noteTime);

  scheduledTimeouts.push(timeoutId);

  time += beatDur / maxPoly; // Polyphonic spacing
});
```

**Stop Function:**

```javascript
window.stop = async function () {
  // Clear all scheduled timeouts
  scheduledTimeouts.forEach((id) => clearTimeout(id));
  scheduledTimeouts.length = 0;

  // Clear playback end timeout
  if (playbackTimeoutId) {
    clearTimeout(playbackTimeoutId);
    playbackTimeoutId = null;
  }

  // Send panic to Csound (sets stopAll flag)
  if (csound && csoundReady) {
    await csound.inputMessage("i 997 0 0.01");

    // Reset stop flag after 100ms
    setTimeout(async () => {
      await csound.setControlChannel("stopAll", 0);
    }, 100);
  }

  isPlaying = false;
  // ... reset UI ...
};
```

### Polyphony Management

**Polyphonic Spacing:**

```javascript
const spacing = beatDur / maxPoly;
time += spacing;
```

**Example (tempo=120 BPM, maxPoly=2):**

- Beat duration: 0.5s
- Spacing: 0.25s
- Notes scheduled: 0s, 0.25s, 0.5s, 0.75s, ...
- Result: 2 notes per beat (chord-like)

**Example (tempo=120 BPM, maxPoly=1):**

- Beat duration: 0.5s
- Spacing: 0.5s
- Notes scheduled: 0s, 0.5s, 1s, 1.5s, ...
- Result: Monophonic arpeggio

### Csound Optimization

**useWorker: false**
Run Csound in main thread (not Web Worker) for lower latency.

- Main thread: ~10-20ms latency
- Web Worker: ~50-100ms latency (message passing overhead)

**Trade-off:** Main thread can block on heavy CPU load, but fractal events are sparse enough that this isn't an issue.

**ksmps = 32**
Block size of 32 samples = 0.73ms at 44.1kHz.

- Lower latency than ksmps=64 (1.45ms)
- Higher CPU than ksmps=128 (2.9ms)
- Good balance for real-time control

**Global Buses Instead of ZAK**
Use simple `init 0` audio buses instead of ZAK opcodes.

- Faster (no table lookups)
- Simpler code
- Standard Csound practice

**Instrument Always-On Pattern**
Start reverb and ambisonic decoder with `i 998 0 -1` and `i 999 0 -1`.

- No startup/teardown overhead per note
- Global reverb accumulates all sources
- Single master output

### Browser Limits

**Maximum Events:**

- Default: 500 events
- Maximum: 2000 events (UI limit)
- Above 2000: Risk of browser tab freeze during generation

**Maximum Iterations:**

- Default: 4-5
- Maximum: 7 (UI limit)
- Above 7: Exponential growth causes millions of symbols (browser crash)

**localStorage Limit:**

- 5-10 MB per domain (browser-dependent)
- 57 factory presets = ~57 KB
- Room for ~5000-10000 user presets (not a real-world concern)

**Audio Context Autoplay Policy:**
Modern browsers require user interaction before starting audio.

- First click on PLAY button satisfies policy
- No workaround needed (user explicitly clicks PLAY)

---

## Extending the System

### Adding a New Instrument

**Step 1: Add Csound Instrument**

```csound
; Add to orchestraCode string in app.html
instr 5
  iFreq = p4
  iAmp = p5
  iBright = p7
  iPan = p8
  iPanType = p9

  ; Your synthesis code here
  aSig poscil iAmp, iFreq
  aSig *= iBright

  ; Envelope
  iAtk = (p10 >= 0) ? p10 : i(chnget:k("globalAttack"))
  iRel = (p11 >= 0) ? p11 : i(chnget:k("globalRelease"))
  aEnv linsegr 0, iAtk, 1, iRel, 0
  aSig *= aEnv

  ; Spatialization
  if (iPanType == 0) then
    aL, aR pan2 aSig, iPan
    gaRvbL += aL
    gaRvbR += aR
  else
    iAzim = iPan * 360
    aW, aX, aY, aZ bformenc1 aSig, iAzim, 0
    gaAmbiW += aW
    gaAmbiX += aX
    gaAmbiY += aY
    gaAmbiZ += aZ
  endif
endin
```

**Step 2: Update Preset Map**

```javascript
// In play() function, around line 2077
const presetMap = {
  pluck: { instr: 1, preset: 2 },
  fm: { instr: 1, preset: 3 },
  bell: { instr: 1, preset: 4 },
  clarinet: { instr: 1, preset: 5 },
  organ: { instr: 1, preset: 8 },
  mynewinstrument: { instr: 5, preset: 0 }, // ADD THIS
  granular: { instr: 2, preset: 0 },
  complexfm: { instr: 3, preset: 0 },
  noisefilter: { instr: 4, preset: 0 },
};
```

**Step 3: Add to UI Dropdown**

```html
<!-- Around line 680 -->
<select id="soundPreset">
  <option value="pluck">Karplus-Strong Pluck</option>
  <option value="fm">FM Bell</option>
  <option value="bell">Additive Bell</option>
  <option value="clarinet">Clarinet</option>
  <option value="organ">Organ</option>
  <option value="mynewinstrument">My New Instrument</option>
  <!-- ADD THIS -->
  <option value="granular">Granular Synthesis</option>
  <option value="complexfm">Complex FM (4-op)</option>
  <option value="noisefilter">Noise & Filters</option>
</select>
```

**Step 4: Create Factory Presets**

```javascript
// In factoryPresets object, around line 2816
"🎺 My Instrument: Cool Sound": {
  axiom: "F",
  rules: "F=F[+F]F[-F]F",
  iterations: 4,
  angle: 25,
  soundPreset: "mynewinstrument",  // Use your preset name
  attack: 10,
  release: 150,
  attackMapEnv: "manual",
  releaseMapEnv: "depth",
  masterVolume: 70,
  roomSize: 70,
  reverb: 50,
  roomSizeMap: "manual",
  reverbWetMap: "inverse",
  baseFreq: 220,
  tempo: 120,
  pitchMap: "angle",
  durMap: "constant",
  timbreMap: "angle",
  panMap: "angle",
  panType: "ambi",
  maxEvents: 500,
  maxPoly: 2,
  vizColor: "single",
  // ... (include all other fields for complex instruments)
},
```

### Adding a New Fractal

**Step 1: Add to Fractal Presets**

```javascript
// Around line 995
const fractalPresets = {
  algae: {
    /* ... */
  },
  tree: {
    /* ... */
  },
  dragon: {
    /* ... */
  },
  koch: {
    /* ... */
  },
  sierpinski: {
    /* ... */
  },
  myfractal: {
    axiom: "F",
    rules: "F=F+F-F-F+F", // Your L-system rules
    angle: 90,
    iterations: 4,
  },
};
```

**Step 2: Add to UI Dropdown**

```html
<!-- Around line 574 -->
<select id="fractalPreset">
  <option value="none">Custom (use controls below)</option>
  <option value="algae" selected>Algae</option>
  <option value="tree">Tree</option>
  <option value="dragon">Dragon Curve</option>
  <option value="koch">Koch Snowflake</option>
  <option value="sierpinski">Sierpinski Triangle</option>
  <option value="myfractal">My Fractal</option>
  <!-- ADD THIS -->
</select>
```

**Step 3: Create Factory Presets**

```javascript
"🌟 My Fractal: Exploration": {
  axiom: "F",
  rules: "F=F+F-F-F+F",
  iterations: 4,
  angle: 90,
  soundPreset: "pluck",
  // ... (all other fields)
},
```

### Adding a New Mapping

**Step 1: Add UI Control**

```html
<!-- Add new dropdown in appropriate section -->
<label>My New Mapping</label>
<select id="myNewMap">
  <option value="none">None</option>
  <option value="depth">Depth → My Parameter</option>
  <option value="angle">Angle → My Parameter</option>
  <option value="position">Position → My Parameter</option>
</select>
```

**Step 2: Read in Play Function**

```javascript
// Around line 2095
const myNewMap = document.getElementById("myNewMap").value;
```

**Step 3: Implement Mapping Logic**

```javascript
// In forEach loop around line 2150
let myNewValue = 0.5; // Default
if (myNewMap === "depth") {
  myNewValue = path.depth / maxDepth;
} else if (myNewMap === "angle") {
  myNewValue = ((path.angle + 180) % 360) / 360;
} else if (myNewMap === "position") {
  myNewValue = i / Math.max(selectedPaths.length - 1, 1);
}

// Scale to your parameter range
myNewValue = minValue + myNewValue * (maxValue - minValue);
```

**Step 4: Pass to Csound**

```javascript
// In score event string
scoreEvent = `i ${instrNum} 0 ${dur} ${freq} ${amp} ${preset} ${brightness} ${pan} ${panType} ${noteAttack} ${noteRelease} ${myNewValue}`;
```

**Step 5: Update Preset System**

```javascript
// In savePreset() around line 2590
const preset = {
  // ... existing fields ...
  myNewMap: document.getElementById("myNewMap").value,
};

// In loadSavedPreset() around line 2690
document.getElementById("myNewMap").value = preset.myNewMap || "none";
```

### Adding Real-time Controls

**For parameters that should update during playback without restart:**

```javascript
// Add listener around line 1704
setupListener("myControl", async () => {
  updateDisplays();
  if (csound && csoundReady) {
    const myValue =
      parseFloat(document.getElementById("myControl").value) / 100;
    await csound.setControlChannel("myChannel", myValue);
    debugLog(`⚡ My control updated: ${myValue} (immediate effect)`);
  }
});
```

**In Csound orchestra:**

```csound
; In master output instrument (999)
kMyControl chnget "myChannel"
; Use kMyControl in processing
```

**For parameters that require restart:**

```javascript
// Add to auto-restart list around line 1730
const addAutoRestart = (id) => setupListener(id, autoRestart);
addAutoRestart("myControl");
```

This triggers stop → play cycle when control changes.

---

## Appendix: Complete Parameter Reference

### Csound P-field Reference

#### Instrument 1 (Universal Melodic)

| P-field | Name       | Range         | Default | Notes                                      |
| ------- | ---------- | ------------- | ------- | ------------------------------------------ |
| p1      | Instrument | 1             | 1       | Fixed                                      |
| p2      | Start time | 0+            | 0       | Always 0 (immediate)                       |
| p3      | Duration   | 0.01-10       | 0.5     | Seconds                                    |
| p4      | Frequency  | 20-20000      | 440     | Hz                                         |
| p5      | Amplitude  | 0-1           | 0.5     | 0dbfs=1                                    |
| p6      | Preset     | 2,3,4,5,8     | 2       | 2=pluck, 3=FM, 4=bell, 5=clarinet, 8=organ |
| p7      | Brightness | 0-1           | 0.5     | Timbre control                             |
| p8      | Pan        | 0-1           | 0.5     | Stereo: 0=L, 1=R; Ambi: 0=front, 1=back    |
| p9      | Pan type   | 0,2           | 2       | 0=stereo, 2=ambisonic                      |
| p10     | Attack     | -1 or 0.001-1 | -1      | -1=use global, else override (seconds)     |
| p11     | Release    | -1 or 0.01-2  | -1      | -1=use global, else override (seconds)     |

#### Instrument 2 (Granular)

| P-field | Name                          | Range    | Default | Notes             |
| ------- | ----------------------------- | -------- | ------- | ----------------- |
| p1-p5   | Standard                      |          |         | See Instrument 1  |
| p6      | Density                       | 5-40     | 20      | Grains per second |
| p7      | Grain size                    | 0.01-0.1 | 0.05    | Seconds           |
| p8      | Pitch var                     | 0-0.3    | 0.1     | ±30% max          |
| p9      | Texture                       | 0-1      | 0       | 0=tone, 1=noise   |
| p10-p13 | Pan, panType, attack, release |          |         | See Instrument 1  |

#### Instrument 3 (Complex FM)

| P-field | Name                          | Range | Default | Notes                                     |
| ------- | ----------------------------- | ----- | ------- | ----------------------------------------- |
| p1-p5   | Standard                      |       |         | See Instrument 1                          |
| p6      | Mod index                     | 0.1-4 | 2       | Clamped for safety                        |
| p7      | Algorithm                     | 0-3   | 0       | 0=parallel, 1=cascade, 2=stack, 3=complex |
| p8      | Carrier ratio                 | 0.5-2 | 1       | Scales all carrier frequencies            |
| p9      | Op mix                        | 0-1   | 0.5     | Operator balance                          |
| p10-p13 | Pan, panType, attack, release |       |         | See Instrument 1                          |

#### Instrument 4 (Noise & Filters)

| P-field | Name                          | Range   | Default | Notes                      |
| ------- | ----------------------------- | ------- | ------- | -------------------------- |
| p1-p5   | Standard                      |         |         | See Instrument 1           |
| p6      | Noise color                   | 0-1     | 0       | 0=white, 0.5=pink, 1=brown |
| p7      | Filter type                   | 0-2     | 0       | 0=LP, 1=BP, 2=HP           |
| p8      | Filter freq                   | 80-8000 | 1000    | Hz                         |
| p9      | Resonance                     | 0.5-5   | 1       | Q factor, CLAMPED          |
| p10     | LFO rate                      | 0-5     | 0       | Hz, modulates filter freq  |
| p11-p14 | Pan, panType, attack, release |         |         | See Instrument 1           |

---

## Conclusion

Dr.C - Fractal Explorer - (L-Systems) is a complete fractal sonification system combining:

- **L-system generation** with 5 built-in fractals
- **Professional audio synthesis** via Csound WASM 7 (8 instruments)
- **Comprehensive parameter mapping** (8 mappings: pitch, duration, timbre, pan, attack, release, room size, reverb wet)
- **57 factory presets** (15 fractal + 24 instrument + 5 noise + 13 fast)
- **Real-time visualization** with playback highlighting
- **Live performance tools** (preset system, auto-play, master volume)

The single-file architecture makes it easy to deploy, modify, and extend. All processing runs client-side in the browser with no server dependencies.

For questions, bug reports, or contributions, visit the [GitHub repository](https://github.com/rboulanger/fractal-explorer).

---

**Dr.C - Fractal Explorer - (L-Systems)**  
Created by Richard Boulanger • Powered by Csound WASM 7  
Technical Documentation v1.0
