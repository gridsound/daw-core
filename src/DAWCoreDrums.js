"use strict";

class DAWCoreDrums {
	static change( daw, store, obj ) {
		const patId = daw.$getOpened( "drums" );

		if ( "bpm" in obj ) {
			store.waDrums.scheduler.setBPM( obj.bpm );
		}
		if ( "patternDrumsOpened" in obj ) {
			DAWCoreDrums.#openPattern( daw, store, patId );
		}
		if ( "drums" in obj ) {
			if ( patId ) {
				const drums = obj.drums[ daw.$getPattern( patId ).drums ];

				if ( drums ) {
					DAWCoreDrums.#changePattern( store, obj.patterns?.[ patId ], drums );
				}
			}
		}
		if ( "patterns" in obj ) {
			const pat = obj.patterns[ patId ];

			DAWCoreDrums.#changePattern( store, pat );
		}
	}
	static getCurrentTime( store ) {
		return store.waDrums.scheduler.getCurrentOffsetBeat();
	}
	static setCurrentTime( daw, store, t ) {
		store.waDrums.scheduler.setCurrentOffsetBeat( t );
		daw.callCallback( "currentTime", DAWCoreDrums.getCurrentTime( store ), "drums" );
	}
	static setLoop( store, a, b ) {
		store.loopA = a;
		store.loopB = b;
		store.looping = true;
		store.waDrums.scheduler.setLoopBeat( a, b );
	}
	static clearLoop( daw, store ) {
		store.loopA =
		store.loopB = null;
		store.looping = false;
		store.waDrums.scheduler.setLoopBeat( 0, store.duration || daw.$getBeatsPerMeasure() );
	}
	static liveDrumrowChange( daw, rowId, prop, val ) {
		daw.$getAudioDrumrows().change( { drumrows: { [ rowId ]: { [ prop ]: val } } } );
	}
	static liveDrumStart( daw, rowId ) {
		daw.$getAudioDrumrows().liveDrumStart( rowId );
	}
	static liveDrumStop( daw, rowId ) {
		daw.$getAudioDrumrows().liveDrumStop( rowId );
		daw.callCallback( "onstopdrumrow", rowId );
	}
	static play( store ) {
		if ( !store.playing ) {
			const a = store.looping ? store.loopA : 0;
			const b = store.looping ? store.loopB : store.duration;

			store.playing = true;
			store.waDrums.scheduler.setLoopBeat( a, b );
			store.waDrums.scheduler.startBeat( 0, DAWCoreDrums.getCurrentTime( store ) );
		}
	}
	static pause( store ) {
		if ( store.playing ) {
			store.playing = false;
			store.waDrums.stop();
		}
	}
	static stop( daw, store ) {
		if ( store.playing ) {
			DAWCoreDrums.pause( store );
			DAWCoreDrums.setCurrentTime( daw, store, store.loopA || 0 );
		} else {
			DAWCoreDrums.setCurrentTime( daw, store, 0 );
		}
	}

	// .........................................................................
	static #changePattern( store, patObj, drumsObj ) {
		if ( drumsObj ) {
			store.waDrums.change( drumsObj );
		}
		if ( patObj && "duration" in patObj ) {
			store.duration = patObj.duration;
			if ( !store.looping && store.playing ) {
				store.waDrums.scheduler.setLoopBeat( 0, store.duration );
			}
		}
	}
	static #openPattern( daw, store, id ) {
		const wasPlaying = store.playing;

		daw.focusOn( "drums" );
		if ( wasPlaying ) {
			daw.stop();
			daw.stop();
		}
		store.waDrums.scheduler.empty();
		if ( id ) {
			const pat = daw.$getPattern( id );

			DAWCoreDrums.#changePattern( store, pat, daw.$getDrums( pat.drums ) );
			if ( wasPlaying ) {
				daw.play();
			}
		}
	}
}
