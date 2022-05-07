"use strict";

class DAWCoreSlices {
	static init( get, obj ) {
		obj.waSched.ondatastart = DAWCoreSlices.#onstartBlock.bind( null, obj.startedBuffers, get );
		obj.waSched.ondatastop = DAWCoreSlices.#onstopBlock.bind( null, obj.startedBuffers );
		obj.waSched.change( { 1: { when: 0, offset: 0, duration: 4 } } );
	}
	static setContext( obj, ctx ) {
		obj.waSched.currentTime = () => ctx.currentTime;
		obj.waSched.enableStreaming( !( ctx instanceof OfflineAudioContext ) );
	}
	static change( daw, obj, objChange ) {
		const patId = daw.get.opened( "slices" );
		let bufUpdated;
		let durUpdated;

		if ( "patternSlicesOpened" in objChange ) {
			if ( objChange.patternSlicesOpened ) {
				durUpdated = true;
			}
			daw.focusOn( "slices" );
		}
		if ( "bpm" in objChange ) {
			obj.waSched.setBPM( objChange.bpm );
		}
		if ( patId ) {
			if ( "slices" in objChange ) {
				const sliOpened = daw.get.pattern( patId ).slices;

				if ( sliOpened in objChange.slices ) {
					bufUpdated = true;
				}
			}
			if ( "patterns" in objChange ) {
				const pat = objChange.patterns[ patId ];
				const patSrcId = daw.get.pattern( patId ).source;
				const patSrc = objChange.patterns[ patSrcId ];

				if ( pat && "source" in pat ) {
					bufUpdated = true;
					durUpdated = true;
				}
				if ( patSrc ) {
					if ( "duration" in patSrc ) {
						durUpdated = true;
					}
				} else if ( patSrcId in objChange.patterns ) {
					if ( daw.isPlaying() ) {
						daw.stop();
						obj.waSched.empty();
					}
				}
			}
		}
		if ( bufUpdated ) {
			DAWCoreSlices.#bufferUpdated( obj );
		}
		if ( durUpdated ) {
			DAWCoreSlices.#changeDuration( obj, daw.get.patternDuration( patId ) );
		}
	}

	// .........................................................................
	static getCurrentTime( obj ) {
		return obj.waSched.getCurrentOffsetBeat();
	}
	static setCurrentTime( daw, obj, t ) {
		obj.waSched.setCurrentOffsetBeat( t );
		daw.callCallback( "currentTime", DAWCoreSlices.getCurrentTime( obj ), "slices" );
	}
	static play( obj ) {
		if ( !obj.waSched.started ) {
			const a = obj.looping ? obj.loopA : 0;
			const b = obj.looping ? obj.loopB : obj.duration;

			obj.playing = true;
			obj.waSched.setLoopBeat( a, b );
			obj.waSched.startBeat( 0, DAWCoreSlices.getCurrentTime( obj ) );
		}
	}
	static pause( obj ) {
		obj.playing = false;
		obj.waSched.stop();
	}
	static stop( daw, obj ) {
		obj.playing = false;
		if ( obj.waSched.started ) {
			DAWCoreSlices.pause( obj );
			DAWCoreSlices.setCurrentTime( daw, obj, obj.loopA || 0 );
		} else {
			DAWCoreSlices.setCurrentTime( daw, obj, 0 );
		}
	}

	// .........................................................................
	static #changeDuration( obj, dur ) {
		obj.duration = dur;
		obj.waSched.change( { 1: { duration: dur } } );
		obj.waSched.setLoopBeat( 0, dur );
	}
	static #bufferUpdated( obj ) {
		DAWCoreSlices.#restart( obj.waSched );
	}
	static #restart( waSched ) {
		if ( waSched.started ) {
			waSched.startBeat( 0, waSched.getCurrentOffsetBeat() );
		}
	}
	static #onstartBlock( startedBuffers, get, startedId, _blcs, when, off, dur ) {
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
			startedBuffers.set( startedId, absn );
		}
	}
	static #onstopBlock( startedBuffers, startedId ) {
		const absn = startedBuffers.get( startedId );

		if ( absn ) {
			absn.stop();
			startedBuffers.delete( startedId );
		}
	}
}
