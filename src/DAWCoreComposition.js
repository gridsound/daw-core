"use strict";

class DAWCoreComposition {
	static $init( daw, store ) {
		store.$waSched.delayStopCallback = 4;
		store.$waSched.currentTime = () => daw.ctx.currentTime;
		store.$waSched.ondatastart = DAWCoreComposition.#onstartBlock.bind( null, daw, store );
		store.$waSched.ondatastop = DAWCoreComposition.#onstopBlock.bind( null, store );
	}

	// .........................................................................
	static $load( daw, store, cmpOri ) {
		return new Promise( ( res, rej ) => {
			const cmp = DAWCoreUtils.$jsonCopy( cmpOri );

			if ( DAWCoreCompositionFormat.$in( cmp ) ) {
				DAWCoreComposition.$unload( daw, store );
				res( cmp );
			} else {
				rej();
			}
		} ).then( cmp => {
			const proms = [];
			const bufLoaded = {};

			store.$cmp = cmp;
			store.$loaded = true;
			DAWCoreComposition.$change( daw, store, cmp, {
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
				daw.$slicesBuffersBuffersLoaded( bufLoaded );
			} );
			store.$actionSavedOn = null;
			store.$saved = cmp.options.saveMode === "cloud" || DAWCoreLocalStorage.$has( cmp.id ) || !cmp.savedAt;
			daw.$callCallback( "compositionSavedStatus", cmp, store.$saved );
			return cmp;
		} );
	}
	static $unload( daw, store ) {
		if ( store.$loaded ) {
			const d = store.$waSched.data;

			store.$loaded = false;
			daw.$getAudioEffects().$clear(); // 1.
			daw.$getAudioMixer().$clear();
			store.$waSched.$stop();
			Object.keys( d ).forEach( id => delete d[ id ] );
			daw.$getAudioSynths().clear();
			daw.$slicesBuffersClear();
			daw.$getAudioDrumrows().$clear();
			store.$saved = true;
			daw.$callCallback( "compositionSavedStatus", store.$cmp, true );
			store.$cmp = null;
		}
	}
	static $save( daw, store ) {
		if ( !store.$saved ) {
			store.$saved = true;
			store.$actionSavedOn = daw.$historyGetCurrentAction();
			store.$cmp.savedAt = Math.floor( Date.now() / 1000 );
			return true;
		}
	}
	static $updateChanAudioData( daw ) {
		const mix = daw.$getAudioMixer();
		const fn = daw.$callCallback.bind( daw, "channelAnalyserFilled" );

		Object.keys( daw.$getChannels() ).forEach( chanId => {
			mix.$fillAudioData( chanId );
			fn( chanId, mix.$audioDataL, mix.$audioDataR );
		} );
	}

	// .........................................................................
	static $getCurrentTime( store ) {
		return store.$waSched.$getCurrentOffsetBeat();
	}
	static $setCurrentTime( daw, store, t ) {
		store.$waSched.$setCurrentOffsetBeat( t );
		daw.$callCallback( "currentTime", DAWCoreComposition.$getCurrentTime( store ), "composition" );
	}
	static $play( daw, store ) {
		if ( !store.$playing ) {
			store.$playing = true;
			DAWCoreComposition.#start( daw, store, DAWCoreComposition.$getCurrentTime( store ) );
		}
	}
	static $pause( store ) {
		if ( store.$playing ) {
			store.$playing = false;
			store.$waSched.$stop();
		}
	}
	static $stop( daw, store ) {
		if ( store.$playing ) {
			DAWCoreComposition.$pause( store );
			DAWCoreComposition.$setCurrentTime( daw, store, store.$cmp.loopA || 0 );
		} else {
			DAWCoreComposition.$setCurrentTime( daw, store, 0 );
		}
	}

	// .........................................................................
	static $change( daw, store, obj, prevObj ) {
		const cmp = store.$cmp;
		const act = daw.$historyGetCurrentAction();
		const saved = act === store.$actionSavedOn && !!cmp.savedAt;

		DAWCoreUtils.$diffAssign( cmp, obj );
		daw.$getAudioMixer().$change( obj );
		daw.$buffersChange( obj, prevObj );
		daw.$slicesBuffersChange( obj );
		daw.$slicesChange( obj );
		daw.$getAudioDrumrows().$change( obj );
		daw.$drumsChange( obj );
		daw.$getAudioEffects().$change( obj );
		DAWCoreComposition.#changeFns.forEach( ( fn, attr ) => {
			if ( attr in obj || attr.some?.( attr => attr in obj ) ) {
				fn( daw, store, obj, prevObj );
			}
		} );
		if ( saved !== store.$saved ) {
			store.$saved = saved;
			daw.$callCallback( "compositionSavedStatus", cmp, saved );
		}
		daw.$callCallback( "compositionChanged", obj, prevObj );
		return obj;
	}

	// .........................................................................
	static #start( daw, store, offset ) {
		const sch = store.$waSched;

		if ( daw.$getCtx() instanceof OfflineAudioContext ) {
			sch.$clearLoop();
			sch.$enableStreaming( false );
			sch.$startBeat( 0 );
		} else {
			DAWCoreComposition.#setLoop( store, store.$cmp.loopA, store.$cmp.loopB );
			sch.$enableStreaming( true );
			sch.$startBeat( 0, offset );
		}
	}
	static #setLoop( store, a, b ) {
		if ( Number.isFinite( a ) ) {
			store.$waSched.$setLoopBeat( a, b );
		} else {
			store.$waSched.$setLoopBeat( 0, store.$cmp.duration || store.$cmp.beatsPerMeasure );
		}
	}

	// .........................................................................
	static #assignPatternChange( store, patId, obj ) {
		store.$startedSched.forEach( ( [ patId2, sched ] ) => {
			if ( patId2 === patId ) {
				sched.$change( obj );
			}
		} );
	}
	static #redirectPatternBuffer( daw, store, patId, chanId ) {
		store.$startedBuffers.forEach( ( [ patId2, absn ] ) => {
			if ( patId2 === patId ) {
				absn.disconnect();
				absn.connect( daw.$getAudioChanIn( chanId ) );
			}
		} );
	}

	// .........................................................................
	static #onstartBlock( daw, store, startedId, blcs, when, off, dur ) {
		const cmp = store.$cmp;
		const blc = blcs[ 0 ][ 1 ];

		if ( cmp.tracks[ blc.track ].toggle ) {
			const patId = blc.pattern;
			const pat = cmp.patterns[ patId ];

			switch ( pat.type ) {
				case "buffer":
					DAWCoreComposition.#startBufferBlock( daw, store, startedId, patId, when, off, dur, daw.$getAudioBuffer( pat.buffer ), patId );
					break;
				case "slices":
					DAWCoreComposition.#startBufferBlock( daw, store, startedId, patId, when, off, dur, daw.$getAudioSlices( patId ), daw.$getPattern( patId ).source );
					break;
				case "keys": {
					const sch = new gswaKeysScheduler();

					store.$startedSched.set( startedId, [ patId, sch ] );
					sch.scheduler.$setBPM( cmp.bpm );
					sch.$setContext( daw.$getCtx() );
					sch.$setSynth( daw.$getAudioSynth( pat.synth ) );
					sch.$change( cmp.keys[ pat.keys ] );
					sch.$start( when, off, dur );
				} break;
				case "drums": {
					const sch = new gswaDrumsScheduler();

					store.$startedSched.set( startedId, [ patId, sch ] );
					sch.scheduler.$setBPM( cmp.bpm );
					sch.$setContext( daw.$getCtx() );
					sch.$setDrumrows( daw.$getAudioDrumrows() );
					sch.$change( cmp.drums[ pat.drums ] );
					sch.$start( when, off, dur );
				} break;
			}
		}
	}
	static #startBufferBlock( daw, store, startedId, patId, when, off, dur, buf, patSrcId ) {
		if ( buf ) {
			const absn = daw.$getCtx().createBufferSource();
			const pat = daw.$getPattern( patSrcId );
			const spd = pat.bufferBpm
				? buf.duration / ( pat.duration / daw.$getBPS() )
				: 1;

			absn.buffer = buf;
			absn.playbackRate.value = spd;
			absn.connect( daw.$getAudioChanIn( pat.dest ) );
			absn.start( when, off * spd, dur * spd );
			store.$startedBuffers.set( startedId, [ patId, absn ] );
		}
	}
	static #onstopBlock( store, startedId ) {
		const absn = store.$startedBuffers.get( startedId );
		const sch = store.$startedSched.get( startedId );

		if ( absn ) {
			absn[ 1 ].stop();
			store.$startedBuffers.delete( startedId );
		}
		if ( sch ) {
			sch[ 1 ].$stop();
			store.$startedSched.delete( startedId );
		}
	}

	// .........................................................................
	static #changeFns = new Map( [
		[ "bpm", ( daw, store, obj ) => {
			store.$waSched.$setBPM( obj.bpm );
			daw.$getAudioSynths().forEach( syn => syn.$setBPM( obj.bpm ) );
			daw.$keysSetBPM( obj.bpm );
		} ],
		[ "blocks", ( _daw, store, obj ) => {
			store.$waSched.$change( obj.blocks );
		} ],
		[ [ "loopA", "loopB" ], ( daw, store ) => {
			if ( daw.$getFocusedName() === "composition" ) {
				store.$waSched.$setLoopBeat(
					store.$cmp.loopA || 0,
					store.$cmp.loopB || store.$cmp.duration || store.$cmp.beatsPerMeasure );
			}
		} ],
		[ "duration", ( daw, store ) => {
			if ( daw.$getFocusedName() === "composition" && store.$cmp.loopA === null ) {
				store.$waSched.$setLoopBeat( 0, store.$cmp.duration || store.$cmp.beatsPerMeasure );
			}
		} ],
		[ "tracks", ( daw, store, obj ) => {
			const blcs = daw.$getBlocksOrderedByTracks();
			const objChg = {};

			Object.entries( obj.tracks ).forEach( ( [ trId, trObj ] ) => {
				if ( "toggle" in trObj && trId in blcs ) {
					trObj.toggle
						? Object.assign( objChg, blcs[ trId ] )
						: Object.keys( blcs[ trId ] ).forEach( id => objChg[ id ] = undefined );
				}
			} );
			store.$waSched.$change( objChg );
		} ],
		[ "synths", ( daw, store, obj, prevObj ) => {
			Object.entries( obj.synths ).forEach( ( [ id, synthObj ] ) => {
				if ( !synthObj ) {
					daw.$getAudioSynth( id ).$stopAllKeys();
					daw.$getAudioSynths().delete( id );
				} else if ( !prevObj.synths[ id ] ) {
					const syn = new gswaSynth();

					syn.$setContext( daw.$getCtx() );
					syn.$setBPM( store.$cmp.bpm );
					syn.$change( synthObj );
					syn.$output.connect( daw.$getAudioMixer().$getChanInput( synthObj.dest ) );
					daw.$getAudioSynths().set( id, syn );
				} else {
					const syn = daw.$getAudioSynth( id );

					syn.$change( synthObj );
					if ( "dest" in synthObj ) {
						syn.$output.disconnect();
						syn.$output.connect( daw.$getAudioMixer().$getChanInput( synthObj.dest ) );
					}
				}
			} );
		} ],
		[ "patterns", ( daw, store, obj ) => {
			Object.entries( obj.patterns ).forEach( ( [ patId, patObj ] ) => {
				if ( patObj ) {
					if ( "dest" in patObj && store.$cmp.patterns[ patId ].type === "buffer" ) {
						DAWCoreComposition.#redirectPatternBuffer( daw, store, patId, patObj.dest );
					}
					if ( patId === store.$cmp.patternKeysOpened ) {
						daw.$keysChange( patObj );
					}
				}
			} );
		} ],
		[ "keys", ( daw, store, obj ) => {
			const pats = Object.entries( store.$cmp.patterns );
			const patOpened = store.$cmp.patternKeysOpened;

			Object.entries( obj.keys ).forEach( ( [ keysId, keysObj ] ) => {
				pats.some( ( [ patId, patObj ] ) => {
					if ( patObj.keys === keysId ) {
						DAWCoreComposition.#assignPatternChange( store, patId, keysObj );
						if ( patId === patOpened ) {
							daw.$keysChange( obj.patterns && obj.patterns[ patId ], keysObj );
						}
						return true;
					}
				} );
			} );
		} ],
		[ "patternKeysOpened", ( daw, _store, obj ) => {
			daw.$keysOpenPattern( obj.patternKeysOpened );
		} ],
		[ "synthOpened", ( daw, _store, obj ) => {
			daw.$keysSetSynth( obj.synthOpened );
		} ],
	] );
}

/*
1. The order between the mixer and the effects is important.
*/
