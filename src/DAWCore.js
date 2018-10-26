"use strict";

class DAWCore {
	constructor() {
		this.cb = {};
		this.env = Object.seal( {
			def_bpm: 120,
			def_appGain: .5,
			def_nbTracks: 21,
			def_stepsPerBeat: 4,
			def_beatsPerMeasure: 4,
			analyserFFTsize: 1024,
			analyserEnable: true,
			sampleRate: 44100,
			clockSteps: false,
		} );
		this.pianoroll = null;
		this.compositionFocused = true;
		this.compositions = new Map();
		this.composition = new DAWCore.Composition( this );
		this.destination = new DAWCore.Destination( this );
		this.history = new DAWCore.History( this );
		this._loop = this._loop.bind( this );
		this._getInit();
		this.setCtx( new AudioContext() );
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
	compositionChange( obj ) {
		this.history.stackChange( obj );
	}
	compositionNeedSave() {
		return !this.composition._saved;
	}
	compositionFocus( force ) {
		if ( !this.compositionFocused ) {
			this._focusOn( true, force );
		}
	}
	pianorollFocus( force ) {
		if ( this.compositionFocused && this.pianoroll && this.get.patternOpened() ) {
			this._focusOn( false, force );
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
		this._focusedObj().play();
		this._call( "play", this._focused() );
	}
	pause() {
		this._focusedObj().pause();
		this._call( "pause", this._focused() );
		this._clockUpdate();
	}
	stop() {
		const obj = this._focusedObj();

		obj.stop();
		this._call( "stop", this._focused() );
		this._call( "currentTime", obj.getCurrentTime(), this._focused() );
		this._clockUpdate();
	}

	// private:
	_startLoop() {
		this._clockUpdate();
		this._loop();
	}
	_stopLoop() {
		cancelAnimationFrame( this._frameId );
	}
	_loop() {
		const anData = this.destination.analyserFillData();

		if ( anData ) {
			this._call( "analyserFilled", anData );
		}
		if ( this.isPlaying() ) {
			const beat = this._focusedObj().getCurrentTime();

			this._call( "currentTime", beat, this._focused() );
			this._clockUpdate();
		}
		this._frameId = requestAnimationFrame( this._loop );
	}
	_clockUpdate() {
		const t = DAWCore.time,
			beat = this._focusedObj().getCurrentTime();

		if ( this.env.clockSteps ) {
			const sPB = this.get.stepsPerBeat();

			this._call( "clockUpdate",
				t.beatToBeat( beat ),
				t.beatToStep( beat, sPB ),
				t.beatToMStep( beat, sPB ) );
		} else {
			const sec = beat * 60 / this.get.bpm();

			this._call( "clockUpdate",
				t.secToMin( sec ),
				t.secToSec( sec ),
				t.secToMs( sec ) );
		}
	}
	_focused() {
		return this.compositionFocused ? "composition" : "pianoroll";
	}
	_focusedObj() {
		return this.compositionFocused ? this.composition : this.pianoroll;
	}
	_focusOn( cmpFocused, force ) {
		if ( force === "-f" || !this.isPlaying() ) {
			this.pause();
			this.compositionFocused = cmpFocused;
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
		return Object.keys( obj ).reduce( ( max, id ) => (
			Math.max( max, parseInt( id ) || 0 )
		), 0 ) + 1 + "";
	}
	_createUniqueName( collection, name ) {
		return DAWCore.uniqueName( name, Object.values(
			this.get[ collection ]() ).map( obj => obj.name ) );
	}
}

DAWCore.json = {};
