"use strict";

class DAWCoreDestination {
	static setGain( obj, v ) {
		obj.gain = v;
		if ( obj.ctx instanceof AudioContext ) {
			obj.gainNode.gain.value = v * v;
		}
	}
	static setCtx( obj, analyserEnable, analyserFFTsize, ctx ) {
		DAWCoreDestination.#empty( obj );
		obj.ctx = ctx;
		obj.gainNode = ctx.createGain();
		obj.inputNode = ctx.createGain();
		obj.inputNode
			.connect( obj.gainNode )
			.connect( ctx.destination );
		if ( ctx instanceof AudioContext ) {
			DAWCoreDestination.#toggleAnalyser( obj, analyserFFTsize, analyserEnable );
			DAWCoreDestination.setGain( obj, obj.gain );
		} else {
			DAWCoreDestination.#toggleAnalyser( obj, analyserFFTsize, false );
		}
	}
	static analyserFillData( obj ) {
		if ( obj.analyserNode ) {
			obj.analyserNode.getByteFrequencyData( obj.analyserData );
			return obj.analyserData;
		}
	}

	// .........................................................................
	static #empty( obj ) {
		obj.gainNode && obj.gainNode.disconnect();
		obj.inputNode && obj.inputNode.disconnect();
		obj.analyserNode && obj.analyserNode.disconnect();
		obj.gainNode =
		obj.inputNode =
		obj.analyserNode =
		obj.analyserData = null;
	}
	static #toggleAnalyser( obj, analyserFFTsize, b ) {
		if ( obj.analyserNode ) {
			obj.analyserNode.disconnect();
		}
		if ( b ) {
			const an = obj.ctx.createAnalyser();
			const fftSize = analyserFFTsize;

			obj.analyserNode = an;
			obj.analyserData = new Uint8Array( fftSize / 2 );
			an.fftSize = fftSize;
			an.smoothingTimeConstant = 0;
			obj.inputNode
				.connect( an )
				.connect( obj.gainNode );
		} else {
			obj.analyserNode =
			obj.analyserData = null;
			obj.inputNode.connect( obj.gainNode );
		}
	}
};
