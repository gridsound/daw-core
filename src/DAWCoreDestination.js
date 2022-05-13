"use strict";

class DAWCoreDestination {
	static setGain( store, v ) {
		store.gain = v;
		if ( store.ctx instanceof AudioContext ) {
			store.gainNode.gain.value = v * v;
		}
	}
	static setContext( store, analyserEnable, analyserFFTsize, ctx ) {
		DAWCoreDestination.#empty( store );
		store.ctx = ctx;
		store.gainNode = ctx.createGain();
		store.inputNode = ctx.createGain();
		store.inputNode
			.connect( store.gainNode )
			.connect( ctx.destination );
		if ( ctx instanceof AudioContext ) {
			DAWCoreDestination.#toggleAnalyser( store, analyserFFTsize, analyserEnable );
			DAWCoreDestination.setGain( store, store.gain );
		} else {
			DAWCoreDestination.#toggleAnalyser( store, analyserFFTsize, false );
		}
	}
	static analyserFillData( store ) {
		if ( store.analyserNode ) {
			store.analyserNode.getByteFrequencyData( store.analyserData );
			return store.analyserData;
		}
	}

	// .........................................................................
	static #empty( store ) {
		store.gainNode && store.gainNode.disconnect();
		store.inputNode && store.inputNode.disconnect();
		store.analyserNode && store.analyserNode.disconnect();
		store.gainNode =
		store.inputNode =
		store.analyserNode =
		store.analyserData = null;
	}
	static #toggleAnalyser( store, analyserFFTsize, b ) {
		if ( store.analyserNode ) {
			store.analyserNode.disconnect();
		}
		if ( b ) {
			const an = store.ctx.createAnalyser();
			const fftSize = analyserFFTsize;

			store.analyserNode = an;
			store.analyserData = new Uint8Array( fftSize / 2 );
			an.fftSize = fftSize;
			an.smoothingTimeConstant = 0;
			store.inputNode
				.connect( an )
				.connect( store.gainNode );
		} else {
			store.analyserNode =
			store.analyserData = null;
			store.inputNode.connect( store.gainNode );
		}
	}
}
