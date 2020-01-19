"use strict";

class DAWCore {
	constructor() {
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
		this.pianoroll = null;
		this.buffers = new DAWCore.Buffers( this );
		this.history = new DAWCore.History( this );
		this.composition = new DAWCore.Composition( this );
		this.destination = new DAWCore.Destination( this );
		this._loop = this._loop.bind( this );
		this._loopMs = 1;
		this._focused = this.composition;
		this._focusedStr = "composition";
		this._getInit();
		this.setLoopRate( 60 );
		this.setCtx( new AudioContext() );
		this.destination.setGain( this.env.def_appGain );
	}

	setCtx( ctx ) {
		this.ctx = ctx;
		this.destination.setCtx( ctx );
		this.composition.setCtx( ctx );
	}
	initPianoroll() {
		this.pianoroll = new DAWCore.Pianoroll( this );
	}
	envChange( obj ) {
		Object.assign( this.env, obj );
		if ( "clockSteps" in obj ) {
			this._clockUpdate();
		}
	}
	compositionChange( obj, msg ) {
		this.history.stackChange( obj, msg );
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
		if ( this._focused !== this.pianoroll && this.pianoroll && this.get.patternKeysOpened() ) {
			this._focusOn( "pianoroll", force );
		}
	}
	isPlaying() {
		return this.composition.playing ||
			( this.pianoroll ? this.pianoroll.playing : false );
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
			const cmpFocused = focusedStr === "composition";

			this.pause();
			this._focused = cmpFocused ? this.composition : this.pianoroll;
			this._focusedStr = focusedStr;
			this._call( "focusOn", "composition", cmpFocused );
			this._call( "focusOn", "pianoroll", !cmpFocused );
			this._clockUpdate();
		}
	}
	_call( cbName, a, b, c, d ) {
		const fn = this.cb[ cbName ];

		return fn && fn( a, b, c, d );
	}
	_error( fnName, collection, id ) {
		return !this.get.composition()
			? `DAWCore.${ fnName }: cmp is not defined`
			: `DAWCore.${ fnName }: cmp.${ collection }[${ id }] is not defined`;
	}
	_getNextIdOf( obj ) {
		const ids = Object.keys( obj ),
			id = ids.reduce( ( max, id ) => Math.max( max, parseInt( id ) || 0 ), 0 );

		return `${ id + 1 }`;
	}
	_createUniqueName( collection, name ) {
		return DAWCore.uniqueName( name, Object.values(
			this.get[ collection ]() ).map( obj => obj.name ) );
	}
}

DAWCore.json = {};
