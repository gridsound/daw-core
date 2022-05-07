"use strict";

DAWCore.Drums = class {
	constructor( daw ) {
		const waDrums = new gswaDrumsScheduler();

		this.daw = daw;
		this.looping =
		this.playing = false;
		this.loopA =
		this.loopB = null;
		this.duration = 0;
		this._waDrums = waDrums;
		Object.seal( this );

		waDrums.setContext( daw.ctx );
		waDrums.setDrumrows( daw.composition.waDrumrows );
	}

	// .........................................................................
	change( obj ) {
		const get = this.daw.get;
		const patId = get.opened( "drums" );

		if ( "bpm" in obj ) {
			this._waDrums.scheduler.setBPM( obj.bpm );
		}
		if ( "patternDrumsOpened" in obj ) {
			this.#openPattern( patId );
		}
		if ( "drums" in obj ) {
			if ( patId ) {
				const drums = obj.drums[ get.pattern( patId ).drums ];

				if ( drums ) {
					this.#changePattern( obj.patterns?.[ patId ], drums );
					// this._waDrums.change( drums );
				}
			}
		}
		if ( "patterns" in obj ) {
			const pat = obj.patterns[ patId ];

			this.#changePattern( pat );
		}
	}
	#changePattern( patObj, drumsObj ) {
		if ( drumsObj ) {
			this._waDrums.change( drumsObj );
		}
		if ( patObj && "duration" in patObj ) {
			this.duration = patObj.duration;
			if ( !this.looping && this.playing ) {
				this._waDrums.scheduler.setLoopBeat( 0, this.duration );
			}
		}
	}
	#openPattern( id ) {
		const daw = this.daw;
		const wasPlaying = this.playing;

		daw.focusOn( "drums" );
		if ( wasPlaying ) {
			daw.stop();
			daw.stop();
		}
		this._waDrums.scheduler.empty();
		if ( id ) {
			const pat = daw.get.pattern( id );

			this.#changePattern( pat, daw.get.drums( pat.drums ) );
			if ( wasPlaying ) {
				daw.play();
			}
		}
	}

	// .........................................................................
	getCurrentTime() {
		return this._waDrums.scheduler.getCurrentOffsetBeat();
	}
	setCurrentTime( t ) {
		this._waDrums.scheduler.setCurrentOffsetBeat( t );
		this.daw.callCallback( "currentTime", this.getCurrentTime(), "drums" );
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
	changeLiveDrumrow( rowId, prop, val ) {
		this.daw.composition.waDrumrows.change( { drumrows: { [ rowId ]: { [ prop ]: val } } } );
	}
	startLiveDrum( rowId ) {
		this.daw.composition.waDrumrows.startLiveDrum( rowId );
	}
	stopLiveDrum( rowId ) {
		this.daw.composition.waDrumrows.stopLiveDrum( rowId );
		this.daw.callCallback( "onstopdrumrow", rowId );
	}
	play() {
		if ( !this.playing ) {
			const a = this.looping ? this.loopA : 0;
			const b = this.looping ? this.loopB : this.duration;

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
