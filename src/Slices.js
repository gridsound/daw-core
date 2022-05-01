"use strict";

DAWCore.Slices = class {
	#daw = null;
	#waSched = new gswaScheduler();
	#duration = 4;
	#startedBuffers = new Map();
	playing = false;

	constructor( daw ) {
		this.looping = false;
		this.loopA =
		this.loopB = null;
		this.#daw = daw;
		Object.seal( this );

		this.setContext( daw.ctx );
		this.#waSched.ondatastart = this.#onstartBlock.bind( this );
		this.#waSched.ondatastop = this.#onstopBlock.bind( this );
		this.#waSched.change( { 1: { when: 0, offset: 0, duration: 4 } } );
	}

	// .........................................................................
	setContext( ctx ) {
		this.#waSched.currentTime = () => ctx.currentTime;
		this.#waSched.enableStreaming( !( ctx instanceof OfflineAudioContext ) );
	}
	change( obj ) {
		const get = this.#daw.get;
		const patId = get.opened( "slices" );
		let bufUpdated;
		let durUpdated;

		if ( "patternSlicesOpened" in obj ) {
			if ( obj.patternSlicesOpened ) {
				durUpdated = true;
			}
			this.#daw.focusOn( "slices" );
		}
		if ( "bpm" in obj ) {
			this.#waSched.setBPM( obj.bpm );
		}
		if ( patId ) {
			if ( "slices" in obj ) {
				const sliOpened = get.pattern( patId ).slices;

				if ( sliOpened in obj.slices ) {
					bufUpdated = true;
				}
			}
			if ( "patterns" in obj ) {
				const pat = obj.patterns[ patId ];
				const patSrcId = get.pattern( patId ).source;
				const patSrc = obj.patterns[ patSrcId ];

				if ( pat && "source" in pat ) {
					bufUpdated = true;
					durUpdated = true;
				}
				if ( patSrc ) {
					if ( "duration" in patSrc ) {
						durUpdated = true;
					}
				} else if ( patSrcId in obj.patterns ) {
					if ( this.#daw.isPlaying() ) {
						this.#daw.stop();
						this.#waSched.empty();
					}
				}
			}
		}
		if ( bufUpdated ) {
			this.#bufferUpdated();
		}
		if ( durUpdated ) {
			this.#changeDuration( get.patternDuration( patId ) );
		}
	}
	#changeDuration( dur ) {
		this.#duration = dur;
		this.#waSched.change( { 1: { duration: dur } } );
		this.#waSched.setLoopBeat( 0, dur );
	}
	#bufferUpdated() {
		this.#restart();
	}
	#restart() {
		if ( this.#waSched.started ) {
			const off = this.#waSched.getCurrentOffsetBeat();

			this.#waSched.startBeat( 0, off );
		}
	}

	// .........................................................................
	getCurrentTime() {
		return this.#waSched.getCurrentOffsetBeat();
	}
	setCurrentTime( t ) {
		this.#waSched.setCurrentOffsetBeat( t );
		this.#daw.callCallback( "currentTime", this.getCurrentTime(), "slices" );
	}
	play() {
		if ( !this.#waSched.started ) {
			const a = this.looping ? this.loopA : 0;
			const b = this.looping ? this.loopB : this.#duration;

			this.playing = true;
			this.#waSched.setLoopBeat( a, b );
			this.#waSched.startBeat( 0, this.getCurrentTime() );
		}
	}
	pause() {
		this.playing = false;
		this.#waSched.stop();
	}
	stop() {
		this.playing = false;
		if ( this.#waSched.started ) {
			this.pause();
			this.setCurrentTime( this.loopA || 0 );
		} else {
			this.setCurrentTime( 0 );
		}
	}

	// .........................................................................
	#onstartBlock( startedId, _blcs, when, off, dur ) {
		const get = this.#daw.get;
		const buf = get.audioSlices( get.opened( "slices" ) );
		const pat = get.pattern( get.opened( "slices" ) );
		const patSrc = get.pattern( pat.source );

		if ( buf && patSrc ) {
			const absn = get.ctx().createBufferSource();
			const spd = buf.duration / ( patSrc.duration / get.bps() );

			absn.buffer = buf;
			absn.playbackRate.value = spd;
			absn.connect( get.audioChanIn( patSrc.dest ) );
			absn.start( when, off * spd, dur * spd );
			this.#startedBuffers.set( startedId, absn );
		}
	}
	#onstopBlock( startedId ) {
		const absn = this.#startedBuffers.get( startedId );

		if ( absn ) {
			absn.stop();
			this.#startedBuffers.delete( startedId );
		}
	}
};
