"use strict";

DAWCore.Slicer = class {
	#daw = null
	#waSched = new gswaScheduler()
	#duration = 4
	#startedBuffers = new Map()
	playing = false

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
		const get = this.#daw.get,
			patId = get.patternSlicesOpened();
		let bufUpdated,
			durUpdated;

		if ( obj.patternSlicesOpened ) {
			durUpdated = get.pattern( patId ).duration;
		}
		if ( "bpm" in obj ) {
			this.#waSched.setBPM( obj.bpm );
		}
		if ( "slices" in obj ) {
			if ( patId ) {
				const sliOpened = get.pattern( patId ).slices;

				if ( sliOpened in obj.slices ) {
					bufUpdated = true;
				}
			}
		}
		if ( "patterns" in obj ) {
			const pat = obj.patterns[ patId ];

			if ( pat ) {
				if ( "source" in pat || "cropA" in pat || "cropB" in pat ) {
					bufUpdated = true;
				}
				if ( "duration" in pat ) {
					durUpdated = pat.duration;
				}
			}
		}
		if ( bufUpdated ) {
			this.#bufferUpdated();
		}
		if ( durUpdated ) {
			this.#changeDuration( durUpdated );
		}
	}
	#changeDuration( dur ) {
		lg("SLICER change duration", dur)
		this.#duration = dur;
		this.#waSched.change( { 1: { duration: dur } } );
		this.#waSched.setLoopBeat( 0, dur );
	}
	#bufferUpdated() {
		lg("SLICER #bufferUpdated")
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
		this.#daw._call( "currentTime", this.getCurrentTime(), "slicer" );
		this.#daw._clockUpdate();
	}
	// setLoop( a, b ) {
	// 	this.loopA = a;
	// 	this.loopB = b;
	// 	this.looping = true;
	// 	this.#waSched.setLoopBeat( a, b );
	// }
	// clearLoop() {
	// 	this.loopA =
	// 	this.loopB = null;
	// 	this.looping = false;
	// 	this.#waSched.setLoopBeat( 0, this.#duration || this.#daw.get.beatsPerMeasure() );
	// }
	play() {
		if ( !this.#waSched.started ) {
			const a = this.looping ? this.loopA : 0,
				b = this.looping ? this.loopB : this.#duration;

			lg("SLICER play", a, b)
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
		const get = this.#daw.get,
			buf = get.audioSlices( get.patternSlicesOpened() );

		lg("SLICER onstartBlock")
		if ( buf ) {
			const pat = get.pattern( get.patternSlicesOpened() ),
				absn = get.ctx().createBufferSource(),
				spd = buf.duration / ( pat.duration / get.bps() );

			absn.buffer = buf;
			absn.playbackRate.value = spd;
			absn.connect( get.audioChanIn( get.pattern( pat.source ).dest ) );
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
