"use strict";

class DAWCoreKeys {
	static change( obj, patObj, keysObj ) {
		obj.waKeys.change( keysObj );
		if ( patObj && "duration" in patObj ) {
			obj.duration = patObj.duration;
			if ( !obj.looping && obj.playing ) {
				obj.waKeys.scheduler.setLoopBeat( 0, obj.duration );
			}
		}
	}
	static setSynth( daw, obj, id ) {
		const syn = id ? daw.get.audioSynth( id ) : null;
		const wasPlaying = obj.playing;

		if ( syn !== obj.synth ) {
			if ( wasPlaying ) {
				DAWCoreKeys.pause( obj );
			}
			obj.synth = syn;
			obj.waKeys.setSynth( syn );
			if ( wasPlaying ) {
				DAWCoreKeys.play( obj );
			}
		}
	}
	static openPattern( daw, obj, id ) {
		const wasPlaying = obj.playing;

		daw.focusOn( "keys" );
		if ( wasPlaying ) {
			daw.stop();
			daw.stop();
		}
		obj.waKeys.scheduler.empty();
		if ( id ) {
			const pat = daw.get.pattern( id );

			DAWCoreKeys.setSynth( daw, obj, pat.synth );
			DAWCoreKeys.change( obj, pat, daw.get.keys( pat.keys ) );
			if ( wasPlaying ) {
				daw.play();
			}
		}
	}
	static getCurrentTime( obj ) {
		return obj.waKeys.scheduler.getCurrentOffsetBeat();
	}
	static setCurrentTime( daw, obj, t ) {
		obj.waKeys.scheduler.setCurrentOffsetBeat( t );
		daw.callCallback( "currentTime", DAWCoreKeys.getCurrentTime( obj ), "keys" );
	}
	static setLoop( obj, a, b ) {
		obj.loopA = a;
		obj.loopB = b;
		obj.looping = true;
		obj.waKeys.scheduler.setLoopBeat( a, b );
	}
	static clearLoop( daw, obj ) {
		obj.loopA =
		obj.loopB = null;
		obj.looping = false;
		obj.waKeys.scheduler.setLoopBeat( 0, obj.duration || daw.get.beatsPerMeasure() );
	}
	static liveKeydown( obj, midi ) {
		if ( !( midi in obj.keysStartedLive ) ) {
			obj.keysStartedLive[ midi ] = obj.synth.startKey(
				[ [ null, DAWCore.json.key( { key: midi } ) ] ],
				obj.waKeys.scheduler.currentTime(), 0, Infinity );
		}
	}
	static liveKeyup( obj, midi ) {
		if ( obj.keysStartedLive[ midi ] ) {
			obj.synth.stopKey( obj.keysStartedLive[ midi ] );
			delete obj.keysStartedLive[ midi ];
		}
	}
	static play( obj ) {
		if ( !obj.playing ) {
			const a = obj.looping ? obj.loopA : 0;
			const b = obj.looping ? obj.loopB : obj.duration;

			obj.playing = true;
			obj.waKeys.scheduler.setLoopBeat( a, b );
			obj.waKeys.scheduler.startBeat( 0, DAWCoreKeys.getCurrentTime( obj ) );
		}
	}
	static pause( obj ) {
		if ( obj.playing ) {
			obj.playing = false;
			obj.waKeys.stop();
		}
	}
	static stop( daw, obj ) {
		if ( obj.playing ) {
			DAWCoreKeys.pause( obj );
			DAWCoreKeys.setCurrentTime( daw, obj, obj.loopA || 0 );
		} else {
			DAWCoreKeys.setCurrentTime( daw, obj, 0 );
		}
	}
}
