"use strict";

class DAWCoreDrums {
	static change( daw, obj, objChange ) {
		const get = daw.get;
		const patId = get.opened( "drums" );

		if ( "bpm" in objChange ) {
			obj.waDrums.scheduler.setBPM( objChange.bpm );
		}
		if ( "patternDrumsOpened" in objChange ) {
			DAWCoreDrums.#openPattern( daw, obj, patId );
		}
		if ( "drums" in objChange ) {
			if ( patId ) {
				const drums = objChange.drums[ get.pattern( patId ).drums ];

				if ( drums ) {
					DAWCoreDrums.#changePattern( obj, objChange.patterns?.[ patId ], drums );
				}
			}
		}
		if ( "patterns" in objChange ) {
			const pat = objChange.patterns[ patId ];

			DAWCoreDrums.#changePattern( obj, pat );
		}
	}
	static getCurrentTime( obj ) {
		return obj.waDrums.scheduler.getCurrentOffsetBeat();
	}
	static setCurrentTime( daw, obj, t ) {
		obj.waDrums.scheduler.setCurrentOffsetBeat( t );
		daw.callCallback( "currentTime", DAWCoreDrums.getCurrentTime( obj ), "drums" );
	}
	static setLoop( obj, a, b ) {
		obj.loopA = a;
		obj.loopB = b;
		obj.looping = true;
		obj.waDrums.scheduler.setLoopBeat( a, b );
	}
	static clearLoop( daw, obj ) {
		obj.loopA =
		obj.loopB = null;
		obj.looping = false;
		obj.waDrums.scheduler.setLoopBeat( 0, obj.duration || daw.get.beatsPerMeasure() );
	}
	static liveDrumrowChange( daw, rowId, prop, val ) {
		daw.get.audioDrumrows().change( { drumrows: { [ rowId ]: { [ prop ]: val } } } );
	}
	static liveDrumStart( daw, rowId ) {
		daw.get.audioDrumrows().liveDrumStart( rowId );
	}
	static liveDrumStop( daw, rowId ) {
		daw.get.audioDrumrows().liveDrumStop( rowId );
		daw.callCallback( "onstopdrumrow", rowId );
	}
	static play( obj ) {
		if ( !obj.playing ) {
			const a = obj.looping ? obj.loopA : 0;
			const b = obj.looping ? obj.loopB : obj.duration;

			obj.playing = true;
			obj.waDrums.scheduler.setLoopBeat( a, b );
			obj.waDrums.scheduler.startBeat( 0, DAWCoreDrums.getCurrentTime( obj ) );
		}
	}
	static pause( obj ) {
		if ( obj.playing ) {
			obj.playing = false;
			obj.waDrums.stop();
		}
	}
	static stop( daw, obj ) {
		if ( obj.playing ) {
			DAWCoreDrums.pause( obj );
			DAWCoreDrums.setCurrentTime( daw, obj, obj.loopA || 0 );
		} else {
			DAWCoreDrums.setCurrentTime( daw, obj, 0 );
		}
	}

	// .........................................................................
	static #changePattern( obj, patObj, drumsObj ) {
		if ( drumsObj ) {
			obj.waDrums.change( drumsObj );
		}
		if ( patObj && "duration" in patObj ) {
			obj.duration = patObj.duration;
			if ( !obj.looping && obj.playing ) {
				obj.waDrums.scheduler.setLoopBeat( 0, obj.duration );
			}
		}
	}
	static #openPattern( daw, obj, id ) {
		const wasPlaying = obj.playing;

		daw.focusOn( "drums" );
		if ( wasPlaying ) {
			daw.stop();
			daw.stop();
		}
		obj.waDrums.scheduler.empty();
		if ( id ) {
			const pat = daw.get.pattern( id );

			DAWCoreDrums.#changePattern( obj, pat, daw.get.drums( pat.drums ) );
			if ( wasPlaying ) {
				daw.play();
			}
		}
	}
}
