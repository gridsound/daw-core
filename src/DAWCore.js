"use strict";

class DAWCore {
	constructor() {
		const ctx = new AudioContext(),
			wadrumrows = new gswaDrumrows();

		this.cb = {};
		this.env = Object.seal( {
			def_bpm: 120,
			def_appGain: 1,
			def_nbTracks: 21,
			def_stepsPerBeat: 4,
			def_beatsPerMeasure: 4,
			analyserFFTsize: 8192,
			analyserEnable: true,
			clockSteps: false,
		} );
		this.cmps = {
			local: new Map(),
			cloud: new Map(),
		};
		this.ctx = ctx;
		this._wadrumrows = wadrumrows;
		this.drums = new DAWCore.Drums( this );
		this.buffers = new DAWCore.Buffers( this );
		this.history = new DAWCore.History( this );
		this.pianoroll = new DAWCore.Pianoroll( this );
		this.composition = new DAWCore.Composition( this );
		this.destination = new DAWCore.Destination( this );
		this._loop = this._loop.bind( this );
		this._loopMs = 1;
		this._focused = this.composition;
		this._focusedStr = "composition";
		this.get = {
			saveMode: () => this.composition.cmp.options.saveMode,
			currentTime: () => this.composition.currentTime,
			composition: ( saveMode, id ) => this.cmps[ saveMode ].get( id ),
			// .................................................................
			ctx: () => this.ctx,
			audioDestination: () => this.destination.getDestination(),
			audioBuffer: id => this.buffers.getBuffer( this.composition.cmp.buffers[ id ] ).buffer,
			audioChanIn: id => this.composition._wamixer.getChanInput( id ),
			audioChanOut: id => this.composition._wamixer.getChanOutput( id ),
			audioEffect: id => this.composition._waeffects._wafxs.get( id ),
			audioSynth: id => this.composition._synths.get( id ),
			// .................................................................
			cmp: () => this.composition.cmp,
			id: () => this.composition.cmp.id,
			bpm: () => this.composition.cmp.bpm,
			name: () => this.composition.cmp.name,
			loopA: () => this.composition.cmp.loopA,
			loopB: () => this.composition.cmp.loopB,
			duration: () => this.composition.cmp.duration,
			beatsPerMeasure: () => this.composition.cmp.beatsPerMeasure,
			stepsPerBeat: () => this.composition.cmp.stepsPerBeat,
			synthOpened: () => this.composition.cmp.synthOpened,
			patternBufferOpened: () => this.composition.cmp.patternBufferOpened,
			patternDrumsOpened: () => this.composition.cmp.patternDrumsOpened,
			patternKeysOpened: () => this.composition.cmp.patternKeysOpened,
			// .................................................................
			block: id => this.composition.cmp.blocks[ id ],
			blocks: () => this.composition.cmp.blocks,
			buffer: id => this.composition.cmp.buffers[ id ],
			buffers: () => this.composition.cmp.buffers,
			channel: id => this.composition.cmp.channels[ id ],
			channels: () => this.composition.cmp.channels,
			drumrow: id => this.composition.cmp.drumrows[ id ],
			drumrows: () => this.composition.cmp.drumrows,
			drums: id => id ? this.composition.cmp.drums[ id ] : this.composition.cmp.drums, // 1.
			effect: id => this.composition.cmp.effects[ id ],
			effects: () => this.composition.cmp.effects,
			keys: id => id ? this.composition.cmp.keys[ id ] : this.composition.cmp.keys, // 1.
			pattern: id => this.composition.cmp.patterns[ id ],
			patterns: () => this.composition.cmp.patterns,
			synth: id => this.composition.cmp.synths[ id ],
			synths: () => this.composition.cmp.synths,
			track: id => this.composition.cmp.tracks[ id ],
			tracks: () => this.composition.cmp.tracks,
		};

		wadrumrows.getAudioBuffer = this.get.audioBuffer;
		wadrumrows.getChannelInput = this.get.audioChanIn;
		wadrumrows.onstartdrum = rowId => this._call( "onstartdrum", rowId );
		wadrumrows.onstartdrumcut = rowId => this._call( "onstopdrumrow", rowId );
		this.setLoopRate( 60 );
		this.setCtx( ctx );
		this.destination.setGain( this.env.def_appGain );
	}

	setCtx( ctx ) {
		this.ctx = ctx;
		this._wadrumrows.setContext( ctx );
		this.destination.setCtx( ctx );
		this.composition.setCtx( ctx );
	}
	envChange( obj ) {
		Object.assign( this.env, obj );
		if ( "clockSteps" in obj ) {
			this._clockUpdate();
		}
	}
	callAction( action, ...args ) {
		const fn = DAWCore.actions[ action ];

		if ( !fn ) {
			console.error( `DAWCore: undefined action "${ action }"` );
		} else {
			const ret = GSUtils.deepFreeze( fn( ...args, this.get ) );

			if ( Array.isArray( ret ) ) {
				this.history.stackChange( ...ret );
			} else if ( ret ) {
				const undo = GSUtils.composeUndo( this.get.cmp(), ret );

				this.composition.change( ret, undo );
			}
		}
	}
	compositionNeedSave() {
		return !this.composition._saved;
	}
	getFocusedObject() {
		return this._focused;
	}
	getFocusedName() {
		return this._focusedStr;
	}
	compositionFocus( force ) {
		if ( this._focused !== this.composition ) {
			this._focusOn( "composition", force );
		}
	}
	pianorollFocus( force ) {
		if ( this._focused !== this.pianoroll && this.get.patternKeysOpened() ) {
			this._focusOn( "pianoroll", force );
		}
	}
	drumsFocus( force ) {
		if ( this._focused !== this.drums && this.get.patternDrumsOpened() ) {
			this._focusOn( "drums", force );
		}
	}
	isPlaying() {
		return this.composition.playing || this.pianoroll.playing || this.drums.playing;
	}
	togglePlay() {
		this.isPlaying() ? this.pause() : this.play();
	}
	play() {
		this._focused.play();
		this._call( "play", this._focusedStr );
	}
	pause() {
		this._focused.pause();
		this._call( "pause", this._focusedStr );
		this._clockUpdate();
	}
	stop() {
		this._focused.stop();
		this._call( "stop", this._focusedStr );
		this._call( "currentTime", this._focused.getCurrentTime(), this._focusedStr );
		this._clockUpdate();
	}
	setLoopRate( fps ) {
		this._loopMs = 1000 / fps | 0;
	}

	// private:
	// .........................................................................
	_startLoop() {
		this._clockUpdate();
		this._loop();
	}
	_stopLoop() {
		clearTimeout( this._frameId );
		cancelAnimationFrame( this._frameId );
	}
	_loop() {
		const anData = this.destination.analyserFillData();

		if ( anData ) {
			this.composition.updateChanAudioData();
			this._call( "analyserFilled", anData );
		}
		if ( this.isPlaying() ) {
			const beat = this._focused.getCurrentTime();

			this._call( "currentTime", beat, this._focusedStr );
			this._clockUpdate();
		}
		this._frameId = this._loopMs < 20
			? requestAnimationFrame( this._loop )
			: setTimeout( this._loop, this._loopMs );
	}
	_clockUpdate() {
		this._call( "clockUpdate", this._focused.getCurrentTime() );
	}
	_focusOn( focusedStr, force ) {
		if ( force === "-f" || !this.isPlaying() ) {
			this.pause();
			this._focused = this[ focusedStr ];
			this._focusedStr = focusedStr;
			this._call( "focusOn", "composition", focusedStr === "composition" );
			this._call( "focusOn", "pianoroll", focusedStr === "pianoroll" );
			this._call( "focusOn", "drums", focusedStr === "drums" );
			this._clockUpdate();
		}
	}
	_call( cbName, ...args ) {
		const fn = this.cb[ cbName ];

		return fn && fn( ...args );
	}
}

DAWCore.json = { effects: {} };
DAWCore.utils = {};
DAWCore.common = {};
DAWCore.actions = {};
DAWCore.controllers = {};
DAWCore.controllersFx = {};

/*
1. The getter 'keys' and 'drums' can't use their singular form like the others getters
   because 'key' and 'drum' are refering to the objects contained in ONE 'keys' or 'drums'.
   So `keys[0]` is a 'keys' not a 'key', a 'key' would be `keys[0][0]`.
*/
