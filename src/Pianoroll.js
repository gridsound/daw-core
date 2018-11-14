"use strict";

DAWCore.Pianoroll = class {
	constructor( daw ) {
		const waSched = new gswaScheduler();

		this.daw = daw;
		this.keys = {};
		this.looping =
		this.playing = false;
		this._synth =
		this.loopA =
		this.loopB = null;
		this.duration = 0;
		this._ctx = daw.ctx;
		this._waSched = waSched;
		this._keysStarted = {};
		this._keysStartedLive = {};
		waSched.currentTime = () => this._ctx.currentTime;
		waSched.ondatastart = this._startKey.bind( this );
		waSched.ondatastop = this._stopKey.bind( this );
	}

	change( patObj, keysObj ) {
		DAWCore.objectDeepAssign( this._waSched.data, keysObj );
		if ( patObj && "duration" in patObj ) {
			this.duration = patObj.duration;
			if ( !this.looping && this.playing ) {
				this._waSched.setLoopBeat( 0, this.duration );
			}
		}
	}
	setSynth( id ) {
		const daw = this.daw,
			syn = id ? daw.composition.getSynth( id ) : null,
			wasPlaying = this.playing;

		if ( syn !== this._synth ) {
			if ( wasPlaying ) {
				this.pause();
			}
			this._synth = syn;
			if ( wasPlaying ) {
				this.play();
			}
		}
	}
	openPattern( id ) {
		const daw = this.daw,
			wasPlaying = this.playing;

		id ? daw.pianorollFocus()
			: daw.compositionFocus( "-f" );
		if ( wasPlaying ) {
			daw.stop();
			daw.stop();
		}
		this._waSched.empty();
		if ( id ) {
			const pat = daw.get.pattern( id );

			this.setSynth( pat.synth );
			this.change( pat, daw.get.keys( pat.keys ) );
			if ( wasPlaying ) {
				daw.play();
			}
		} else {
			this.setSynth( null );
		}
	}

	// ........................................................................
	_startKey( startedId, blcs, when, off, dur ) {
		this._keysStarted[ startedId ] = this._synth.startKey( blcs, when, off, dur );
	}
	_stopKey( startedId ) {
		this._synth.stopKey( this._keysStarted[ startedId ] );
		delete this._keysStarted[ startedId ];
	}

	// controls
	// ........................................................................
	getCurrentTime() {
		return this._waSched.getCurrentOffsetBeat();
	}
	setCurrentTime( t ) {
		this._waSched.setCurrentOffsetBeat( t );
		this.daw._call( "currentTime", this.getCurrentTime(), "pianoroll" );
		this.daw._clockUpdate();
	}
	setBPM( bpm ) {
		this._waSched.setBPM( bpm );
	}
	setLoop( a, b ) {
		this.loopA = a;
		this.loopB = b;
		this.looping = true;
		this._waSched.setLoopBeat( a, b );
	}
	clearLoop() {
		this.loopA =
		this.loopB = null;
		this.looping = false;
		this._waSched.setLoopBeat( 0, this.duration || this.daw.get.beatsPerMeasure() );
	}
	liveKeydown( midi ) {
		if ( !( midi in this._keysStartedLive ) ) {
			this._keysStartedLive[ midi ] = this._synth.startKey( [ [ null, {
				key: midi,
				gain: .8,
				pan: 0,
			} ] ], this._waSched.currentTime(), 0, Infinity );
		}
	}
	liveKeyup( midi ) {
		if ( this._keysStartedLive[ midi ] ) {
			this._synth.stopKey( this._keysStartedLive[ midi ] );
			delete this._keysStartedLive[ midi ];
		}
	}
	bpm( bpm ) {
		this._waSched.setBPM( bpm );
	}
	play() {
		if ( !this.playing ) {
			const a = this.looping ? this.loopA : 0,
				b = this.looping ? this.loopB : this.duration;

			this.playing = true;
			this._waSched.setLoopBeat( a, b );
			this._waSched.startBeat( 0, this.getCurrentTime() );
		}
	}
	pause() {
		if ( this.playing ) {
			this.playing = false;
			this._waSched.stop();
		}
	}
	stop() {
		if ( this.playing ) {
			this.pause();
			this.setCurrentTime( this.loopA || 0 );
		} else {
			this.setCurrentTime( 0 );
		}
	}
};
