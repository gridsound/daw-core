"use strict";

class DAWCoreComposition {
	static init( daw, store ) {
		store.waSched.delayStopCallback = 4;
		store.waSched.currentTime = () => daw.ctx.currentTime;
		store.waSched.ondatastart = DAWCoreComposition.#onstartBlock.bind( null, daw.get, store );
		store.waSched.ondatastop = DAWCoreComposition.#onstopBlock.bind( null, store );
	}

	// .........................................................................
	static load( daw, store, cmpOri ) {
		return new Promise( ( res, rej ) => {
			const cmp = DAWCore.utils.jsonCopy( cmpOri );

			if ( DAWCoreCompositionFormat.in( cmp ) ) {
				DAWCoreComposition.unload( daw, store );
				res( cmp );
			} else {
				rej();
			}
		} ).then( cmp => {
			const proms = [];
			const bufLoaded = {};

			store.cmp = cmp;
			store.loaded = true;
			Object.entries( cmp.buffers ).forEach( kv => {
				proms.push( daw.buffersSetBuffer( kv[ 1 ] )
					.then( buf => {
						if ( buf.buffer ) {
							bufLoaded[ kv[ 0 ] ] = buf;
							daw.callCallback( "buffersLoaded", { [ kv[ 0 ] ]: buf } );
						}
					} ) );
			} );
			DAWCoreComposition.change( daw, store, cmp, {
				keys: {},
				drums: {},
				synths: {},
				blocks: {},
				slices: {},
				buffers: {},
				drumrows: {},
				channels: {},
				patterns: {},
			} );
			Promise.allSettled( proms ).then( () => {
				daw.slicesBuffersBuffersLoaded( bufLoaded );
			} );
			store.actionSavedOn = null;
			store.saved = cmp.options.saveMode === "cloud" || DAWCoreLocalStorage.has( cmp.id ) || !cmp.savedAt;
			daw.callCallback( "compositionSavedStatus", cmp, store.saved );
			return cmp;
		} );
	}
	static unload( daw, store ) {
		if ( store.loaded ) {
			const d = store.waSched.data;

			store.loaded = false;
			store.waEffects.clear(); // 1.
			store.waMixer.clear();
			store.waSched.stop();
			Object.keys( d ).forEach( id => delete d[ id ] );
			store.waSynths.clear();
			daw.slicesBuffersClear();
			store.waDrumrows.clear();
			store.saved = true;
			daw.callCallback( "compositionSavedStatus", store.cmp, true );
			store.cmp = null;
		}
	}
	static save( daw, store ) {
		if ( !store.saved ) {
			store.saved = true;
			store.actionSavedOn = daw.historyGetCurrentAction();
			store.cmp.savedAt = Math.floor( Date.now() / 1000 );
			return true;
		}
	}
	static updateChanAudioData( daw, store ) {
		const mix = store.waMixer;
		const fn = daw.callCallback.bind( daw, "channelAnalyserFilled" );

		Object.keys( daw.get.channels() ).forEach( chanId => {
			mix.fillAudioData( chanId );
			fn( chanId, mix.audioDataL, mix.audioDataR );
		} );
	}

	// .........................................................................
	static getCurrentTime( store ) {
		return store.waSched.getCurrentOffsetBeat();
	}
	static setCurrentTime( daw, store, t ) {
		store.waSched.setCurrentOffsetBeat( t );
		daw.callCallback( "currentTime", DAWCoreComposition.getCurrentTime( store ), "composition" );
	}
	static play( daw, store ) {
		if ( !store.playing ) {
			store.playing = true;
			DAWCoreComposition.#start( daw, store, DAWCoreComposition.getCurrentTime( store ) );
		}
	}
	static pause( store ) {
		if ( store.playing ) {
			store.playing = false;
			store.waSched.stop();
		}
	}
	static stop( daw, store ) {
		if ( store.playing ) {
			DAWCoreComposition.pause( store );
			DAWCoreComposition.setCurrentTime( daw, store, store.cmp.loopA || 0 );
		} else {
			DAWCoreComposition.setCurrentTime( daw, store, 0 );
		}
	}

	// .........................................................................
	static change( daw, store, obj, prevObj ) {
		const cmp = store.cmp;
		const act = daw.historyGetCurrentAction();
		const saved = act === store.actionSavedOn && !!cmp.savedAt;

		DAWCore.utils.diffAssign( cmp, obj );
		store.waMixer.change( obj );
		daw.buffersChange( obj, prevObj );
		daw.slicesBuffersChange( obj );
		daw.slicesChange( obj );
		store.waDrumrows.change( obj );
		daw.drumsChange( obj );
		store.waEffects.change( obj );
		DAWCoreComposition.#changeFns.forEach( ( fn, attr ) => {
			if ( attr in obj || attr.some?.( attr => attr in obj ) ) {
				fn( daw, store, obj, prevObj );
			}
		} );
		if ( saved !== store.saved ) {
			store.saved = saved;
			daw.callCallback( "compositionSavedStatus", cmp, saved );
		}
		daw.callCallback( "compositionChanged", obj, prevObj );
		return obj;
	}

	// .........................................................................
	static #start( daw, store, offset ) {
		const sch = store.waSched;

		if ( daw.get.ctx() instanceof OfflineAudioContext ) {
			sch.clearLoop();
			sch.enableStreaming( false );
			sch.startBeat( 0 );
		} else {
			DAWCoreComposition.#setLoop( store, store.cmp.loopA, store.cmp.loopB );
			sch.enableStreaming( true );
			sch.startBeat( 0, offset );
		}
	}
	static #setLoop( store, a, b ) {
		if ( Number.isFinite( a ) ) {
			store.waSched.setLoopBeat( a, b );
		} else {
			store.waSched.setLoopBeat( 0, store.cmp.duration || store.cmp.beatsPerMeasure );
		}
	}

	// .........................................................................
	static #assignPatternChange( store, patId, obj ) {
		store.startedSched.forEach( ( [ patId2, sched ] ) => {
			if ( patId2 === patId ) {
				sched.change( obj );
			}
		} );
	}
	static #redirectPatternBuffer( daw, store, patId, chanId ) {
		store.startedBuffers.forEach( ( [ patId2, absn ] ) => {
			if ( patId2 === patId ) {
				absn.disconnect();
				absn.connect( daw.get.audioChanIn( chanId ) );
			}
		} );
	}

	// .........................................................................
	static #onstartBlock( get, store, startedId, blcs, when, off, dur ) {
		const cmp = store.cmp;
		const blc = blcs[ 0 ][ 1 ];

		if ( cmp.tracks[ blc.track ].toggle ) {
			const patId = blc.pattern;
			const pat = cmp.patterns[ patId ];

			switch ( pat.type ) {
				case "buffer":
					DAWCoreComposition.#startBufferBlock( get, store, startedId, patId, when, off, dur, get.audioBuffer( pat.buffer ), patId );
					break;
				case "slices":
					DAWCoreComposition.#startBufferBlock( get, store, startedId, patId, when, off, dur, get.audioSlices( patId ), get.pattern( patId ).source );
					break;
				case "keys": {
					const sch = new gswaKeysScheduler();

					store.startedSched.set( startedId, [ patId, sch ] );
					sch.scheduler.setBPM( cmp.bpm );
					sch.setContext( get.ctx() );
					sch.setSynth( get.audioSynth( pat.synth ) );
					sch.change( cmp.keys[ pat.keys ] );
					sch.start( when, off, dur );
				} break;
				case "drums": {
					const sch = new gswaDrumsScheduler();

					store.startedSched.set( startedId, [ patId, sch ] );
					sch.scheduler.setBPM( cmp.bpm );
					sch.setContext( get.ctx() );
					sch.setDrumrows( store.waDrumrows );
					sch.change( cmp.drums[ pat.drums ] );
					sch.start( when, off, dur );
				} break;
			}
		}
	}
	static #startBufferBlock( get, store, startedId, patId, when, off, dur, buf, patSrcId ) {
		if ( buf ) {
			const absn = get.ctx().createBufferSource();
			const pat = get.pattern( patSrcId );
			const spd = pat.bufferBpm
				? buf.duration / ( pat.duration / get.bps() )
				: 1;

			absn.buffer = buf;
			absn.playbackRate.value = spd;
			absn.connect( get.audioChanIn( pat.dest ) );
			absn.start( when, off * spd, dur * spd );
			store.startedBuffers.set( startedId, [ patId, absn ] );
		}
	}
	static #onstopBlock( store, startedId ) {
		const objStarted =
				store.startedSched.get( startedId ) ||
				store.startedBuffers.get( startedId );

		if ( objStarted ) {
			objStarted[ 1 ].stop();
			store.startedSched.delete( startedId );
			store.startedBuffers.delete( startedId );
		}
	}

	// .........................................................................
	static #changeFns = new Map( [
		[ "bpm", ( daw, store, obj ) => {
			store.waSched.setBPM( obj.bpm );
			store.waSynths.forEach( syn => syn.setBPM( obj.bpm ) );
			daw.keysSetBPM( obj.bpm );
		} ],
		[ "blocks", ( _daw, store, obj ) => {
			store.waSched.change( obj.blocks );
		} ],
		[ [ "loopA", "loopB" ], ( daw, store ) => {
			if ( daw.getFocusedName() === "composition" ) {
				store.waSched.setLoopBeat(
					store.cmp.loopA || 0,
					store.cmp.loopB || store.cmp.duration || store.cmp.beatsPerMeasure );
			}
		} ],
		[ "duration", ( daw, store ) => {
			if ( daw.getFocusedName() === "composition" && store.cmp.loopA === null ) {
				store.waSched.setLoopBeat( 0, store.cmp.duration || store.cmp.beatsPerMeasure );
			}
		} ],
		[ "synths", ( daw, store, obj, prevObj ) => {
			Object.entries( obj.synths ).forEach( ( [ id, synthObj ] ) => {
				if ( !synthObj ) {
					store.waSynths.get( id ).stopAllKeys();
					store.waSynths.delete( id );
				} else if ( !prevObj.synths[ id ] ) {
					const syn = new gswaSynth();

					syn.setContext( daw.get.ctx() );
					syn.setBPM( store.cmp.bpm );
					syn.change( synthObj );
					syn.output.connect( store.waMixer.getChanInput( synthObj.dest ) );
					store.waSynths.set( id, syn );
				} else {
					const syn = store.waSynths.get( id );

					syn.change( synthObj );
					if ( "dest" in synthObj ) {
						syn.output.disconnect();
						syn.output.connect( store.waMixer.getChanInput( synthObj.dest ) );
					}
				}
			} );
		} ],
		[ "patterns", ( daw, store, obj ) => {
			Object.entries( obj.patterns ).forEach( ( [ patId, patObj ] ) => {
				if ( patObj ) {
					if ( "dest" in patObj && store.cmp.patterns[ patId ].type === "buffer" ) {
						DAWCoreComposition.#redirectPatternBuffer( daw, store, patId, patObj.dest );
					}
					if ( patId === store.cmp.patternKeysOpened ) {
						daw.keysChange( patObj );
					}
				}
			} );
		} ],
		[ "keys", ( daw, store, obj ) => {
			const pats = Object.entries( store.cmp.patterns );
			const patOpened = store.cmp.patternKeysOpened;

			Object.entries( obj.keys ).forEach( ( [ keysId, keysObj ] ) => {
				pats.some( ( [ patId, patObj ] ) => {
					if ( patObj.keys === keysId ) {
						DAWCoreComposition.#assignPatternChange( store, patId, keysObj );
						if ( patId === patOpened ) {
							daw.keysChange( obj.patterns && obj.patterns[ patId ], keysObj );
						}
						return true;
					}
				} );
			} );
		} ],
		[ "patternKeysOpened", ( daw, _store, obj ) => {
			daw.keysOpenPattern( obj.patternKeysOpened );
		} ],
		[ "synthOpened", ( daw, _store, obj ) => {
			daw.keysSetSynth( obj.synthOpened );
		} ],
	] );
};

/*
1. The order between the mixer and the effects is important.
*/
