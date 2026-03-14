// CSD EXPORT FUNCTIONALITY FOR FRACTAL EXPLORER
// Allows exporting generated fractal sequences as standalone Csound files

let csdEventLog = [];
let isCSDRecording = false;

// Call this when generating a new sequence
function initializeCSDRecording() {
  csdEventLog = [];
  isCSDRecording = true;
}

// Call this from play() when sending events to Csound
function logEventToCSD(scoreEvent, time) {
  if (isCSDRecording) {
    csdEventLog.push({
      statement: scoreEvent,
      timestamp: time,
      originalTime: new Date().getTime()
    });
  }
}

// Main export function
async function exportCSD() {
  if (csdEventLog.length === 0) {
    alert('No events recorded. Generate and play a fractal first!');
    return;
  }

  const lsystemParams = {
    axiom: document.getElementById('axiom').value,
    rules: document.getElementById('rules').value,
    iterations: parseFloat(document.getElementById('iterations').value),
    angle: parseFloat(document.getElementById('angle').value),
    baseFreq: parseFloat(document.getElementById('basefreq').value),
    tempo: parseFloat(document.getElementById('tempo').value),
    pitchMap: document.getElementById('pitchmap').value,
    durMap: document.getElementById('durmap').value,
    presetMode: document.getElementById('presetmode').value,
  };

  const timestamp = new Date().toISOString();
  
  // Get orchestra code from the app
  const orchestraCode = await getOrchestraCode();
  
  // Build CSD header
  const csdHeader = `<CsoundSynthesizer>
<CsOptions>
-odac -d -m0
</CsOptions>
<CsInstruments>
${orchestraCode}
</CsInstruments>
<CsScore>
; ============================================================
; FRACTAL EXPLORER - L-SYSTEM GENERATED COMPOSITION
; ============================================================
; Generated: ${timestamp}
;
; L-System Configuration:
;   Axiom: ${lsystemParams.axiom}
;   Rules: ${lsystemParams.rules.replace(/\n/g, ' | ')}
;   Iterations: ${lsystemParams.iterations}
;   Angle: ${lsystemParams.angle}°
;
; Musical Parameters:
;   Base Frequency: ${lsystemParams.baseFreq} Hz
;   Tempo: ${lsystemParams.tempo} BPM
;   Pitch Mapping: ${lsystemParams.pitchMap}
;   Duration Mapping: ${lsystemParams.durMap}
;   Synthesis Preset: ${lsystemParams.presetMode}
;
; Score Statistics:
;   Total Events: ${csdEventLog.length}
;   Duration: ${(csdEventLog[csdEventLog.length - 1]?.timestamp || 0).toFixed(3)}s
; ============================================================

`;

  // Build score from logged events
  let scoreStatements = '';
  csdEventLog.forEach(event => {
    scoreStatements += event.statement + '\n';
  });

  const csdFooter = `
e
</CsScore>
</CsoundSynthesizer>`;

  // Combine
  const fullCSD = csdHeader + scoreStatements + csdFooter;

  // Display in textarea
  const output = document.getElementById('csdOutput');
  output.value = fullCSD;
  output.style.display = 'block';

  // Download
  downloadCSDFile(fullCSD);
}

function downloadCSDFile(content) {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const filename = `fractal-explorer_${timestamp}.csd`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  document.getElementById('status').textContent = `✓ Exported: ${filename}`;
  console.log(`Downloaded: ${filename}`);
}

async function getOrchestraCode() {
  // Extract orchestra from global orchestraCode variable
  // This is set when initCsound() runs
  if (typeof orchestraCode !== 'undefined') {
    return orchestraCode;
  }
  
  // Fallback if not yet loaded
  return `
sr = 44100
ksmps = 32
nchnls = 2
0dbfs = 1

; Global reverb sends
gaRvbL init 0
gaRvbR init 0

; Reverb instrument
instr 999
  kRoomSize chnget "roomSize"
  kWet chnget "reverbWet"
  kMasterVol chnget "masterVolume"
  
  aRvbL, aRvbR freeverb gaRvbL, gaRvbR, kRoomSize, 0.5
  aOutL = gaRvbL*(1-kWet) + aRvbL*kWet
  aOutR = gaRvbR*(1-kWet) + aRvbR*kWet
  
  aOutL = aOutL * kMasterVol
  aOutR = aOutR * kMasterVol
  
  out aOutL, aOutR
  clear gaRvbL, gaRvbR
endin

; Universal note instrument
instr 1
  iFreq = p4
  iAmp = p5
  iPreset = p6
  iBright = p7
  iPan = p8
  iPanType = p9
  iAtkP = p10
  iRelP = p11
  
  kStopFlag = chnget:k("stopAll")
  if kStopFlag == 1 then
    turnoff
  endif
  
  iAtk = (iAtkP >= 0) ? iAtkP : 0.01
  iRel = (iRelP >= 0) ? iRelP : 0.1
  
  aEnv linsegr 0, iAtk, iAmp, iRel, 0
  
  ; Basic sine oscillator
  aOsc poscil aEnv, iFreq
  
  ; Lowpass filter for brightness control
  aFilt moogladder aOsc, 2000 + iBright * 3000, 0.4
  
  ; Panning
  kPan = iPan * 2 - 1
  aL, aR pan2 aFilt, kPan
  
  gaRvbL += aL * 0.3
  gaRvbR += aR * 0.3
  
  out aL, aR
endin
`;
}

// Enable export button when ready
function enableCSDExport() {
  const btn = document.getElementById('exportCsdBtn');
  if (btn) {
    btn.disabled = false;
  }
}

// Make functions global
window.exportCSD = exportCSD;
window.initializeCSDRecording = initializeCSDRecording;
window.logEventToCSD = logEventToCSD;
window.enableCSDExport = enableCSDExport;
