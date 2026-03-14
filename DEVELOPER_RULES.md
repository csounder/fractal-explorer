# Dr. C Apps - Critical Developer Rules

**Effective Date**: March 14, 2026  
**All New Projects MUST Follow These Rules**

---

## Rule 1: Browser-Native Execution (NO LOCAL SERVER)

### ✅ REQUIRED
```
- Apps MUST run in browser WITHOUT local server
- NO localhost required
- NO python -m http.server
- NO npm install or build step
- Works with file:// protocol
- Drag app.html into browser = instant run
```

### How to Achieve This
```javascript
// Use ES6 dynamic imports from CDN
const { Csound } = await import(
  "https://cdn.jsdelivr.net/npm/@csound/browser@7.0.0-beta26/dist/csound.js"
);
```

### What This Means
- Single static HTML file
- All external dependencies from CDN
- No local build process
- 30-second deployment (drag and drop)
- Works offline after first load (if Csound WASM cached)

### Verification
```
✅ Can open with: file:///path/to/app.html
✅ Can open by dragging app.html into browser
✅ No port forwarding needed
✅ No special setup needed
```

---

## Rule 2: Csound 7 WASM & Modern Syntax

### ✅ REQUIRED
```
- ALL apps use Csound 7 (@csound/browser@7.0.0-beta26+)
- ALL Csound code follows Csound 7 syntax rules
- NO deprecated features allowed
- NO legacy syntax
```

### The 12 Critical Csound 7 Rules

1. **0dbfs Declaration** (REQUIRED)
   ```csound
   0dbfs = 1  ; Correct (Csound 7)
   0dbfs = 32767  ; WRONG (old style - NOT ALLOWED)
   ```

2. **Output Stage** (REQUIRED)
   ```csound
   out aL, aR  ; Correct (Csound 7)
   outs aL, aR ; WRONG (deprecated - NOT ALLOWED)
   ```

3. **Audio Variable Rate Prefix** (REQUIRED)
   ```csound
   aSig oscili aEnv, iFreq, -1  ; Correct (a-rate output)
   kSig = oscili(...)  ; WRONG (wrong rate for oscillator)
   ```

4. **Control Rate Prefix** (REQUIRED)
   ```csound
   kEnv madsr iAtt, iDec, iSus, iRel  ; Correct (k-rate)
   kEnv = 0.5 + kEnv  ; Correct (k-rate expression)
   ```

5. **Init Rate Prefix** (REQUIRED)
   ```csound
   iFreq = p4  ; Correct (i-rate parameter)
   iDur = p3   ; Correct
   ```

6. **Global Variables** (REQUIRED)
   ```csound
   gaOutL = gaOutL + aOutL  ; Correct (g prefix)
   gaOutR = gaOutR + aOutR  ; Correct
   ```

7. **Envelope Shapes** (REQUIRED)
   ```csound
   aEnv linsegr 0, iAtk, 1, iRel, 0  ; Correct (all positive)
   aEnv expseg 0.0001, iAtk, 1, iRel, 0.0001  ; Correct (no zeros)
   ```

8. **Functional Notation** (REQUIRED)
   ```csound
   kEnv = madsr(iAtt, iDec, iSus, iRel)  ; Correct (functional)
   kEnv madsr iAtt, iDec, iSus, iRel  ; OK but avoid
   ```

9. **MIDI Functions** (REQUIRED)
   ```csound
   kFreq = cpsmidinn(kMidiNote)  ; Correct (Csound 7)
   kFreq = cpsmidi()  ; WRONG (takes no arguments)
   ```

10. **UDO Syntax** (REQUIRED if UDOs used)
    ```csound
    opcode MyOp, a, ak  ; Correct (new style)
    opcode MyOp(aIn, kRate), a  ; OK but older
    xin  ; WRONG (deprecated)
    ```

11. **Type Disambiguation** (REQUIRED if needed)
    ```csound
    kEnv = linen:k(1, iAtt, iDur, iRel)  ; Correct
    aVal = oscili:a(aAmp, kFreq, giSine)  ; Correct
    kEnv = linen(...):k  ; WRONG (suffix notation)
    ```

12. **Reverb Syntax** (REQUIRED)
    ```csound
    aL, aR reverbsc aInL, aInR, kFbk, kCutoff  ; Correct (4 args)
    aOut = reverbsc(aIn, 0.85)  ; WRONG (incomplete)
    ```

### Verification Checklist
```
✅ 0dbfs = 1 at orchestra header
✅ out aL, aR (not outs)
✅ All variables properly prefixed (a, k, i, g)
✅ No deprecated outs opcode
✅ No old-style cpsmidi()
✅ Envelopes use linsegr, expsegr with proper values
✅ No xin in new UDOs
✅ Functional notation for single-output opcodes
✅ reverbsc with 4 arguments if used
```

---

## Rule 3: Single HTML File Deployment

### ✅ REQUIRED
```
- One static .html file = complete app
- All code embedded in single file
- No external JavaScript files
- No CSS files (use <style> tag)
- No build process
- No compilation step
```

### Why This Matters
- Users drag file into browser = instant run
- No dependencies to install
- No setup required
- Works offline
- Easy to share (just one file)
- Easy to host (any web server)

### File Size Limit
- Keep under 10 MB (reasonable for single file)
- Most apps will be 1-5 MB
- Csound WASM loads from CDN (separate)

---

## Rule 4: Documentation Requirements

### ✅ REQUIRED FOR EVERY APP
1. **Quick Start Guide**
   - 3-5 step instructions
   - Time estimate (should be < 2 minutes)
   - "Drag file into browser" instructions

2. **Requirements Compliance Report**
   - Verify Rule 1 (no server needed)
   - Verify Rule 2 (Csound 7 syntax)
   - Line-by-line syntax audit
   - Deployment instructions

3. **Test Report**
   - What was tested
   - Test results (should be 100% pass)
   - Feature checklist

4. **Browser Testing Guide**
   - Step-by-step test procedures
   - Expected results
   - Troubleshooting tips

5. **Code Comments**
   - All functions documented
   - All UI elements documented
   - Complex logic explained

---

## Rule 5: No External Dependencies (Except Csound)

### ✅ ALLOWED
- Csound WASM from jsDelivr CDN (only external)
- Standard HTML5 APIs
- Vanilla JavaScript (no frameworks)
- CSS Grid/Flexbox (no framework)
- Web Audio API (if needed)

### ❌ NOT ALLOWED
- Node.js or npm packages
- Framework dependencies (React, Vue, etc.)
- Build tools (webpack, babel, rollup)
- Local package managers
- Complex toolchain

### Why This Matters
- Users don't need to install anything
- No build step needed
- App works immediately
- Easy to maintain
- Minimal JavaScript knowledge required

---

## Rule 6: Testing & Quality Assurance

### ✅ REQUIRED FOR EVERY APP
- Write automated tests (at minimum 20 tests)
- Verify all functions work correctly
- Check browser compatibility (Chrome, Firefox, Safari, Edge)
- Validate HTML/CSS/JavaScript syntax
- Zero syntax errors allowed
- Document test results

### Testing Framework
- Use static code analysis (grep, regex)
- Create test checklist document
- Run tests in multiple browsers
- Publish test report with app

---

## Template for New Apps

### File Structure
```
/Path/To/MyApp/
├── app.html                          (SINGLE FILE - EVERYTHING)
├── REQUIREMENTS_COMPLIANCE.md        (Requirement verification)
├── TEST_REPORT.md                    (Test results)
├── BROWSER_TEST_GUIDE.md             (Testing checklist)
├── README.md                         (Quick start)
└── .git/                             (Version control)
```

### Minimum Content for app.html
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <style>
    /* All CSS here */
  </style>
</head>
<body>
  <!-- All HTML here -->

  <script>
    // All JavaScript here
    
    // 1. Load Csound from CDN
    const { Csound } = await import(
      "https://cdn.jsdelivr.net/npm/@csound/browser@7.0.0-beta26/dist/csound.js"
    );
    
    // 2. Initialize and run
    async function initApp() {
      // Your app code here
    }
    
    // 3. Start when ready
    window.addEventListener('DOMContentLoaded', initApp);
  </script>
</body>
</html>
```

---

## Checklist Before Publishing

### Code Quality
- [ ] 0dbfs = 1 in Csound orchestra
- [ ] out aL, aR (not outs)
- [ ] All variables properly prefixed
- [ ] No deprecated features
- [ ] Zero syntax errors
- [ ] No console.error messages

### Browser Support
- [ ] Works in Chrome 89+
- [ ] Works in Firefox 87+
- [ ] Works in Safari 14.1+
- [ ] Works in Edge 89+
- [ ] No build step required

### Documentation
- [ ] Quick start guide written
- [ ] Requirements compliance report written
- [ ] Test report written (39+ tests)
- [ ] Browser testing guide written
- [ ] Code comments added

### Deployment
- [ ] Single HTML file (no external files)
- [ ] Can drag into browser
- [ ] Works with file:// protocol
- [ ] Csound loads from CDN
- [ ] No localhost needed

### Testing
- [ ] 100% test pass rate
- [ ] Tested in multiple browsers
- [ ] All features working
- [ ] No syntax errors
- [ ] Performance acceptable

---

## Common Mistakes to AVOID

### ❌ WRONG: Local Server Required
```
"To run this app, start: python -m http.server"
"You must have Node.js installed"
"Run npm install first"
```
✅ CORRECT: No server needed
```
"Drag app.html into your browser"
"Works immediately with file:// protocol"
```

### ❌ WRONG: Old Csound Syntax
```csound
0dbfs = 32767
outs aL, aR
kVal = oscili(...)
aEnv expseg 0, ...
```
✅ CORRECT: Csound 7 Syntax
```csound
0dbfs = 1
out aL, aR
aSig = oscili(...)
aEnv expseg 0.0001, ...
```

### ❌ WRONG: Multiple Files
```
app.js
app.css
lib/utils.js
styles/theme.css
```
✅ CORRECT: Single File
```
app.html  (contains everything)
```

### ❌ WRONG: External Dependencies
```javascript
import React from 'react'
import { VueComponent } from 'vue'
const $ = require('jquery')
```
✅ CORRECT: Vanilla Code
```javascript
// Standard HTML5 APIs and vanilla JS only
const element = document.getElementById('...')
```

---

## Questions?

If unsure about any rule, follow the **Fractal Explorer** pattern:
- GitHub: https://github.com/csounder/fractal-explorer
- It demonstrates all 6 rules perfectly
- Use it as a reference for any new app

---

## Summary

All Dr. C apps MUST:
1. ✅ Run in browser without local server
2. ✅ Use Csound 7 WASM with modern syntax
3. ✅ Be single HTML file
4. ✅ Have complete documentation
5. ✅ Have no external dependencies (except Csound)
6. ✅ Be thoroughly tested

**Non-negotiable. No exceptions.**

---

**Effective**: March 14, 2026  
**Approved By**: Dr. C (sine mode)  
**Reference App**: Fractal Explorer (L-Systems)  

