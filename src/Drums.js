"use strict";

DAWCore.Drums = class {
	constructor( daw ) {
		const waDrums = new gswaDrumsScheduler( daw.ctx );

		this.daw = daw;
		this.looping =
		this.playing = false;
		this.loopA =
		this.loopB = null;
		this.duration = 0;
		this._ctx = daw.ctx;
		this._waDrums = waDrums;

		waDrums.setDrumrows( daw._wadrumrows );
	}

	change( patObj, drumsObj ) {
		this._waDrums.change( drumsObj );
		if ( patObj && "duration" in patObj ) {
			this.duration = patObj.duration;
			if ( !this.looping && this.playing ) {
				this._waDrums.scheduler.setLoopBeat( 0, this.duration );
			}
		}
	}
	openPattern( id ) {
		const daw = this.daw,
			wasPlaying = this.playing;

		id ? daw.drumsFocus()
			: daw.compositionFocus( "-f" );
		if ( wasPlaying ) {
			daw.stop();
			daw.stop();
		}
		this._waDrums.scheduler.empty();
		if ( id ) {
			const pat = daw.get.pattern( id );

			this.change( pat, daw.get.drums( pat.drums ) );
			if ( wasPlaying ) {
				daw.play();
			}
		}
	}

	// controls
	// .........................................................................
	getCurrentTime() {
		return this._waDrums.scheduler.getCurrentOffsetBeat();
	}
	setCurrentTime( t ) {
		this._waDrums.scheduler.setCurrentOffsetBeat( t );
		this.daw._call( "currentTime", this.getCurrentTime(), "drums" );
		this.daw._clockUpdate();
	}
	setBPM( bpm ) {
		this._waDrums.scheduler.setBPM( bpm );
	}
	setLoop( a, b ) {
		this.loopA = a;
		this.loopB = b;
		this.looping = true;
		this._waDrums.scheduler.setLoopBeat( a, b );
	}
	clearLoop() {
		this.loopA =
		this.loopB = null;
		this.looping = false;
		this._waDrums.scheduler.setLoopBeat( 0, this.duration || this.daw.get.beatsPerMeasure() );
	}
	play() {
		if ( !this.playing ) {
			const a = this.looping ? this.loopA : 0,
				b = this.looping ? this.loopB : this.duration;

			this.playing = true;
			this._waDrums.scheduler.setLoopBeat( a, b );
			this._waDrums.scheduler.startBeat( 0, this.getCurrentTime() );
		}
	}
	pause() {
		if ( this.playing ) {
			this.playing = false;
			this._waDrums.stop();
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
