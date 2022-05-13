"use strict";

class DAWCoreSlices {
	static init( get, store ) {
		store.waSched.ondatastart = DAWCoreSlices.#onstartBlock.bind( null, store.startedBuffers, get );
		store.waSched.ondatastop = DAWCoreSlices.#onstopBlock.bind( null, store.startedBuffers );
		store.waSched.change( { 1: { when: 0, offset: 0, duration: 4 } } );
	}
	static setContext( store, ctx ) {
		store.waSched.currentTime = () => ctx.currentTime;
		store.waSched.enableStreaming( !( ctx instanceof OfflineAudioContext ) );
	}
	static change( daw, store, obj ) {
		const patId = daw.get.opened( "slices" );
		let bufUpdated;
		let durUpdated;

		if ( "patternSlicesOpened" in obj ) {
			if ( obj.patternSlicesOpened ) {
				durUpdated = true;
			}
			daw.focusOn( "slices" );
		}
		if ( "bpm" in obj ) {
			store.waSched.setBPM( obj.bpm );
		}
		if ( patId ) {
			if ( "slices" in obj ) {
				const sliOpened = daw.get.pattern( patId ).slices;

				if ( sliOpened in obj.slices ) {
					bufUpdated = true;
				}
			}
			if ( "patterns" in obj ) {
				const pat = obj.patterns[ patId ];
				const patSrcId = daw.get.pattern( patId ).source;
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
					if ( daw.isPlaying() ) {
						daw.stop();
						store.waSched.empty();
					}
				}
			}
		}
		if ( bufUpdated ) {
			DAWCoreSlices.#bufferUpdated( store );
		}
		if ( durUpdated ) {
			DAWCoreSlices.#changeDuration( store, daw.get.patternDuration( patId ) );
		}
	}

	// .........................................................................
	static getCurrentTime( store ) {
		return store.waSched.getCurrentOffsetBeat();
	}
	static setCurrentTime( daw, store, t ) {
		store.waSched.setCurrentOffsetBeat( t );
		daw.callCallback( "currentTime", DAWCoreSlices.getCurrentTime( store ), "slices" );
	}
	static play( store ) {
		if ( !store.waSched.started ) {
			const a = store.looping ? store.loopA : 0;
			const b = store.looping ? store.loopB : store.duration;

			store.playing = true;
			store.waSched.setLoopBeat( a, b );
			store.waSched.startBeat( 0, DAWCoreSlices.getCurrentTime( store ) );
		}
	}
	static pause( store ) {
		store.playing = false;
		store.waSched.stop();
	}
	static stop( daw, store ) {
		store.playing = false;
		if ( store.waSched.started ) {
			DAWCoreSlices.pause( store );
			DAWCoreSlices.setCurrentTime( daw, store, store.loopA || 0 );
		} else {
			DAWCoreSlices.setCurrentTime( daw, store, 0 );
		}
	}

	// .........................................................................
	static #changeDuration( store, dur ) {
		store.duration = dur;
		store.waSched.change( { 1: { duration: dur } } );
		store.waSched.setLoopBeat( 0, dur );
	}
	static #bufferUpdated( store ) {
		DAWCoreSlices.#restart( store.waSched );
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
