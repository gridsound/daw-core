"use strict";

DAWCore.Pianoroll = class {
	constructor( daw ) {
		const waKeys = new gswaKeysScheduler( daw.ctx );

		this.daw = daw;
		this.keys = {};
		this.looping =
		this.playing = false;
		this._synth =
		this.loopA =
		this.loopB = null;
		this.duration = 0;
		this._ctx = daw.ctx;
		this._waKeys = waKeys;
		this._keysStartedLive = {};
	}

	change( patObj, keysObj ) {
		this._waKeys.change( keysObj );
		if ( patObj && "duration" in patObj ) {
			this.duration = patObj.duration;
			if ( !this.looping && this.playing ) {
				this._waKeys.scheduler.setLoopBeat( 0, this.duration );
			}
		}
	}
	setSynth( id ) {
		const syn = id ? this.daw.get.audioSynth( id ) : null,
			wasPlaying = this.playing;

		if ( syn !== this._synth ) {
			if ( wasPlaying ) {
				this.pause();
			}
			this._synth = syn;
			this._waKeys.setSynth( syn );
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
		this._waKeys.scheduler.empty();
		if ( id ) {
			const pat = daw.get.pattern( id );

			this.setSynth( pat.synth );
			this.change( pat, daw.get.keys( pat.keys ) );
			if ( wasPlaying ) {
				daw.play();
			}
		}
	}

	// controls
	// ........................................................................
	getCurrentTime() {
		return this._waKeys.scheduler.getCurrentOffsetBeat();
	}
	setCurrentTime( t ) {
		this._waKeys.scheduler.setCurrentOffsetBeat( t );
		this.daw._call( "currentTime", this.getCurrentTime(), "pianoroll" );
		this.daw._clockUpdate();
	}
	setBPM( bpm ) {
		this._waKeys.scheduler.setBPM( bpm );
	}
	setLoop( a, b ) {
		this.loopA = a;
		this.loopB = b;
		this.looping = true;
		this._waKeys.scheduler.setLoopBeat( a, b );
	}
	clearLoop() {
		this.loopA =
		this.loopB = null;
		this.looping = false;
		this._waKeys.scheduler.setLoopBeat( 0, this.duration || this.daw.get.beatsPerMeasure() );
	}
	liveKeydown( midi ) {
		if ( !( midi in this._keysStartedLive ) ) {
			this._keysStartedLive[ midi ] = this._synth.startKey( [ [ null, {
				key: midi,
				pan: 0,
				gain: .8,
				lowpass: 1,
				highpass: 1,
			} ] ], this._waKeys.scheduler.currentTime(), 0, Infinity );
		}
	}
	liveKeyup( midi ) {
		if ( this._keysStartedLive[ midi ] ) {
			this._synth.stopKey( this._keysStartedLive[ midi ] );
			delete this._keysStartedLive[ midi ];
		}
	}
	play() {
		if ( !this.playing ) {
			const a = this.looping ? this.loopA : 0,
				b = this.looping ? this.loopB : this.duration;

			this.playing = true;
			this._waKeys.scheduler.setLoopBeat( a, b );
			this._waKeys.scheduler.startBeat( 0, this.getCurrentTime() );
		}
	}
	pause() {
		if ( this.playing ) {
			this.playing = false;
			this._waKeys.stop();
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
