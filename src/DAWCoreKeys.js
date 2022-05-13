"use strict";

class DAWCoreKeys {
	static change( store, patObj, keysObj ) {
		store.waKeys.change( keysObj );
		if ( patObj && "duration" in patObj ) {
			store.duration = patObj.duration;
			if ( !store.looping && store.playing ) {
				store.waKeys.scheduler.setLoopBeat( 0, store.duration );
			}
		}
	}
	static setSynth( daw, store, id ) {
		const syn = id ? daw.$getAudioSynth( id ) : null;
		const wasPlaying = store.playing;

		if ( syn !== store.synth ) {
			if ( wasPlaying ) {
				DAWCoreKeys.pause( store );
			}
			store.synth = syn;
			store.waKeys.setSynth( syn );
			if ( wasPlaying ) {
				DAWCoreKeys.play( store );
			}
		}
	}
	static openPattern( daw, store, id ) {
		const wasPlaying = store.playing;

		daw.focusOn( "keys" );
		if ( wasPlaying ) {
			daw.stop();
			daw.stop();
		}
		store.waKeys.scheduler.empty();
		if ( id ) {
			const pat = daw.$getPattern( id );

			DAWCoreKeys.setSynth( daw, store, pat.synth );
			DAWCoreKeys.change( store, pat, daw.$getKeys( pat.keys ) );
			if ( wasPlaying ) {
				daw.play();
			}
		}
	}
	static getCurrentTime( store ) {
		return store.waKeys.scheduler.getCurrentOffsetBeat();
	}
	static setCurrentTime( daw, store, t ) {
		store.waKeys.scheduler.setCurrentOffsetBeat( t );
		daw.callCallback( "currentTime", DAWCoreKeys.getCurrentTime( store ), "keys" );
	}
	static setLoop( store, a, b ) {
		store.loopA = a;
		store.loopB = b;
		store.looping = true;
		store.waKeys.scheduler.setLoopBeat( a, b );
	}
	static clearLoop( daw, store ) {
		store.loopA =
		store.loopB = null;
		store.looping = false;
		store.waKeys.scheduler.setLoopBeat( 0, store.duration || daw.$getBeatsPerMeasure() );
	}
	static liveKeydown( store, midi ) {
		if ( !( midi in store.keysStartedLive ) ) {
			store.keysStartedLive[ midi ] = store.synth.startKey(
				[ [ null, DAWCore.json.key( { key: midi } ) ] ],
				store.waKeys.scheduler.currentTime(), 0, Infinity );
		}
	}
	static liveKeyup( store, midi ) {
		if ( store.keysStartedLive[ midi ] ) {
			store.synth.stopKey( store.keysStartedLive[ midi ] );
			delete store.keysStartedLive[ midi ];
		}
	}
	static play( store ) {
		if ( !store.playing ) {
			const a = store.looping ? store.loopA : 0;
			const b = store.looping ? store.loopB : store.duration;

			store.playing = true;
			store.waKeys.scheduler.setLoopBeat( a, b );
			store.waKeys.scheduler.startBeat( 0, DAWCoreKeys.getCurrentTime( store ) );
		}
	}
	static pause( store ) {
		if ( store.playing ) {
			store.playing = false;
			store.waKeys.stop();
		}
	}
	static stop( daw, store ) {
		if ( store.playing ) {
			DAWCoreKeys.pause( store );
			DAWCoreKeys.setCurrentTime( daw, store, store.loopA || 0 );
		} else {
			DAWCoreKeys.setCurrentTime( daw, store, 0 );
		}
	}
}
