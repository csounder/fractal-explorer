# Browser Testing Guide - Fractal Explorer

## Quick Start (2 minutes)

### Option 1: Local Testing
```bash
cd "/Users/richardboulanger/dB-Studio/Dr.C-Fractal-Explorer (L-Systems)"
python3 -m http.server 8000
```
Then open: `http://localhost:8000/app.html`

### Option 2: Live Testing
Open: `https://csounder-fractal-explorer.netlify.app/`

### Option 3: Direct File
Open: `file:///Users/richardboulanger/dB-Studio/Dr.C-Fractal-Explorer\ \(L-Systems\)/app.html`

---

## Test Checklist

### 1. Page Load (30 seconds)
- [ ] Page loads without errors
- [ ] Open DevTools Console (F12 or Cmd+Option+I)
- [ ] Check for red error messages - should see NONE
- [ ] Check for yellow warnings - OK if present

### 2. Console Toggle Button (30 seconds)
- [ ] Click "👁️ Hide Console" button
  - Expected: Large textarea on right disappears
  - Expected: Button changes to "👁️ Show Console"
  - Expected: Button background changes color
- [ ] Click "👁️ Show Console" button
  - Expected: Textarea reappears
  - Expected: Button changes back to "👁️ Hide Console"

### 3. Recording Button (1 minute)
- [ ] Click "🔴 Record CSD" button
  - Expected: Button changes to "🟢 Stop Recording"
  - Expected: Button background turns green
  - Expected: "💾 Download" button becomes disabled
  - Expected: Status shows "Recording CSD events..."
- [ ] Click "🟢 Stop Recording" button
  - Expected: Button changes back to "🔴 Record CSD"
  - Expected: Button background turns red
  - Expected: "💾 Download" button becomes enabled
  - Expected: Status shows "✓ Recording stopped (0 events)"

### 4. Quantization Controls (1 minute)
- [ ] **Key Selector**
  - Click dropdown at bottom-left
  - Select different notes: C, D, E, F, G, A, B
  - Check browser console for: "🔑 Key changed to: X"
  
- [ ] **Scale Selector**
  - Click dropdown below Key
  - Select: Major, Minor, Pentatonic, Blues, Harmonic, Whole Tone
  - Check console for: "📊 Scale changed to: X"
  
- [ ] **Tempo Input**
  - Clear the input field
  - Type: 140
  - Press Enter or click away
  - Check console for: "⏱️ Tempo changed to: 140 BPM"

### 5. Space Bar Control (30 seconds)
- [ ] Generate a fractal first (click any preset like "Algae")
- [ ] Click "Visualize" button to load it
- [ ] Click "▶ Play" button to start playback
- [ ] Press Space bar on keyboard
  - Expected: Playback stops
- [ ] Press Space bar again
  - Expected: Playback resumes (or starts if was stopped)
- [ ] Click somewhere on page to ensure focus, then press Space
  - Expected: Still works without button focus

### 6. Full Workflow Test (3-5 minutes)
This tests all features working together:

1. **Setup**
   - Ensure console is visible (if hidden, click Show)
   - Ensure key is set to "C", scale to "Major", tempo to 120

2. **Generate**
   - Click preset dropdown at top-left
   - Select "Algae" (or any preset)
   - Fractal should appear in center

3. **Record**
   - Click "🔴 Record CSD" button
   - Button should turn green
   - Status should say "Recording CSD events..."

4. **Play**
   - Click "▶ Play" button
   - Should hear audio (if system has speakers)
   - Can optionally press Space bar to stop

5. **Export**
   - After playback ends, click "🟢 Stop Recording"
   - Button should turn red
   - Status should show number of events recorded
   - Large textarea on right should show CSD content

6. **Download**
   - Click "💾 Download" button
   - File should download with name like: `fractal-explorer_2026-03-14T12-34-56.csd`
   - Check downloads folder

7. **Verify**
   - Open the downloaded .csd file in text editor
   - Should see XML structure with <CsoundSynthesizer> tags
   - Should see score events with note information

---

## Console Messages to Expect

When clicking buttons and controls, browser console should show:

```
[DEBUG] 🔑 Key changed to: G
[DEBUG] 📊 Scale changed to: minor
[DEBUG] ⏱️ Tempo changed to: 140 BPM
[DEBUG] 🔴 CSD Recording started
[DEBUG] ✓ CSD Recording stopped (42 events)
[DEBUG] ✓ Downloaded: fractal-explorer_2026-03-14T12-34-56.csd
```

---

## Troubleshooting

### If buttons don't respond
1. Open DevTools Console (F12)
2. Check for red errors
3. Type in console: `window.toggleConsole` (should show function)
4. If undefined, there's a scope issue

### If console toggle doesn't hide textarea
1. Check that `#csdOutput` textarea exists on page
2. Check CSS display property isn't overridden
3. Try clicking button multiple times

### If recording doesn't work
1. Generate a fractal first (click preset)
2. Make sure you clicked "Record" BEFORE playing
3. Check console for any error messages

### If quantization controls don't log
1. Open DevTools Console
2. Make sure it's active/visible
3. Click a control and watch console in real-time
4. Messages should appear immediately

### If space bar doesn't work
1. Make sure play button is NOT disabled (should be blue, not gray)
2. Click page to ensure browser window has focus
3. Press Space and watch console for any errors

### If file doesn't download
1. Check browser's download settings (might be blocked)
2. Verify pop-ups aren't blocked
3. Try clicking Download again
4. Check Downloads folder for partial/temporary files

---

## Advanced Testing (Optional)

### Test Quantization Algorithm
1. Open DevTools Console
2. Paste this test code:
```javascript
// Test C major scale quantization
const testFrequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440, 493.88];
console.log('Testing C major scale quantization:');
testFrequencies.forEach(freq => {
  const quantized = window.quantizeNoteToScale(freq);
  console.log(`${freq.toFixed(2)} Hz → ${quantized.toFixed(2)} Hz`);
});
```
3. Check output - frequencies should snap to nearby scale tones
4. Try changing key/scale and re-running test

### Test Event Recording
1. Open DevTools Console
2. Check these variables exist:
```javascript
window.csdEventLog      // Should be array []
window.isCSDRecording   // Should be false
window.currentKey       // Should be string 'C'
window.currentScale     // Should be string 'major'
window.currentTempo     // Should be number 120
```

### Test Scale Patterns
1. In console, check scale definitions:
```javascript
// Should show all scale patterns
console.log(window.scalePatterns);
```
2. Verify all 6 scales are present
3. Verify intervals match documentation

---

## Browser Requirements

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

Minimum requirements:
- JavaScript ES6+ support
- DOM manipulation (getElementById, etc.)
- Event listeners (addEventListener)
- File API (Blob, URL.createObjectURL)

---

## Performance Notes

- Page should load in < 2 seconds on modern hardware
- Button clicks should respond immediately (< 100ms)
- Recording should not impact playback performance
- Exporting should complete in < 1 second

---

## Success Criteria

✅ All buttons respond to clicks
✅ Console shows debug messages for all controls
✅ No JavaScript errors in DevTools
✅ CSD file downloads with correct format
✅ Space bar controls play/stop
✅ Recording captures events correctly
✅ Quantization changes update controls

---

**Last Updated**: March 14, 2026  
**Test Status**: Ready for User Testing  
**Estimated Time**: 5-10 minutes for full checklist

