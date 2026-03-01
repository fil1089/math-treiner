class SoundManagerImpl {
    private ctx: AudioContext | null = null;
    private enabled: boolean = true;

    constructor() {
        // AudioContext is created on first interaction to comply with browser autoplay policies
    }

    private initCtx() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    public enable() { this.enabled = true; }
    public disable() { this.enabled = false; }
    public toggle() { this.enabled = !this.enabled; return this.enabled; }
    public isEnabled() { return this.enabled; }

    // ─── Play a quick tick/click sound (for numpad) ────────
    public playClick() {
        if (!this.enabled) return;
        try {
            this.initCtx();
            if (!this.ctx) return;
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = "sine";
            osc.frequency.setValueAtTime(600, t);
            osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

            osc.start(t);
            osc.stop(t + 0.05);
        } catch (e) { console.warn("Audio play failed", e); }
    }

    // ─── Play a happy little chime (for correct answer) ────
    public playSuccess() {
        if (!this.enabled) return;
        try {
            this.initCtx();
            if (!this.ctx) return;
            const t = this.ctx.currentTime;

            const playTone = (freq: number, startOffset: number, duration: number = 0.3) => {
                const osc = this.ctx!.createOscillator();
                const gain = this.ctx!.createGain();
                osc.connect(gain);
                gain.connect(this.ctx!.destination);

                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, t + startOffset);

                gain.gain.setValueAtTime(0, t + startOffset);
                gain.gain.linearRampToValueAtTime(0.2, t + startOffset + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, t + startOffset + duration);

                osc.start(t + startOffset);
                osc.stop(t + startOffset + duration);
            };

            // Play C major arpeggio very quickly
            playTone(523.25, 0);       // C5
            playTone(659.25, 0.08);    // E5
            playTone(783.99, 0.16, 0.5); // G5 
        } catch (e) { console.warn("Audio play failed", e); }
    }

    // ─── Play a low buzz/thud (for wrong answer) ───────────
    public playError() {
        if (!this.enabled) return;
        try {
            this.initCtx();
            if (!this.ctx) return;
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            // A slightly dissonant wave
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(80, t + 0.3);

            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

            osc.start(t);
            osc.stop(t + 0.3);
        } catch (e) { console.warn("Audio play failed", e); }
    }

    // ─── Play a victory fanfare (for round complete) ───────
    public playRoundComplete() {
        if (!this.enabled) return;
        try {
            this.initCtx();
            if (!this.ctx) return;

            const playTone = (freq: number, startOffset: number, duration: number, type: OscillatorType = "sine", vol: number = 0.2) => {
                const t = this.ctx!.currentTime;
                const osc = this.ctx!.createOscillator();
                const gain = this.ctx!.createGain();
                osc.connect(gain);
                gain.connect(this.ctx!.destination);

                osc.type = type;
                osc.frequency.setValueAtTime(freq, t + startOffset);

                gain.gain.setValueAtTime(0, t + startOffset);
                gain.gain.linearRampToValueAtTime(vol, t + startOffset + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, t + startOffset + duration);

                osc.start(t + startOffset);
                osc.stop(t + startOffset + duration);
            };

            // Little fanfare
            playTone(523.25, 0, 0.2, "triangle"); // C5
            playTone(523.25, 0.15, 0.2, "triangle"); // C5
            playTone(523.25, 0.3, 0.2, "triangle"); // C5
            playTone(659.25, 0.45, 0.6, "triangle", 0.3); // E5 sustained
        } catch (e) { console.warn("Audio play failed", e); }
    }
}

export const SoundManager = new SoundManagerImpl();
