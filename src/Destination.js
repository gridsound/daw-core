"use strict";

DAWCore.Destination = class {
	#daw = null
	#ctx = null
	#gainNode = null
	#inputNode = null
	#analyserNode = null
	#analyserData = null
	#gain = 1

	constructor( daw ) {
		this.#daw = daw;
		Object.seal( this );
	}

	getDestination() {
		return this.#inputNode;
	}
	getGain() {
		return this.#gain;
	}
	setGain( v ) {
		this.#gain = v;
		if ( this.#ctx instanceof AudioContext ) {
			this.#gainNode.gain.value = v * v;
		}
	}
	empty() {
		this.#gainNode && this.#gainNode.disconnect();
		this.#inputNode && this.#inputNode.disconnect();
		this.#analyserNode && this.#analyserNode.disconnect();
		this.#gainNode =
		this.#inputNode =
		this.#analyserNode =
		this.#analyserData = null;
	}
	setCtx( ctx ) {
		this.empty();
		this.#ctx = ctx;
		this.#inputNode = ctx.createGain();
		this.#gainNode = ctx.createGain();
		this.#inputNode
			.connect( this.#gainNode )
			.connect( ctx.destination );
		if ( ctx instanceof AudioContext ) {
			this.toggleAnalyser( this.#daw.env.analyserEnable );
			this.setGain( this.#gain );
		} else {
			this.toggleAnalyser( false );
		}
	}
	analyserFillData() {
		if ( this.#analyserNode ) {
			this.#analyserNode.getByteFrequencyData( this.#analyserData );
			return this.#analyserData;
		}
	}
	toggleAnalyser( b ) {
		if ( this.#analyserNode ) {
			this.#analyserNode.disconnect();
		}
		if ( b ) {
			const an = this.#ctx.createAnalyser(),
				fftSize = this.#daw.env.analyserFFTsize;

			this.#analyserNode = an;
			this.#analyserData = new Uint8Array( fftSize / 2 );
			an.fftSize = fftSize;
			an.smoothingTimeConstant = 0;
			this.#inputNode
				.connect( an )
				.connect( this.#gainNode );
		} else {
			this.#analyserNode =
			this.#analyserData = null;
			this.#inputNode.connect( this.#gainNode );
		}
	}
};

Object.freeze( DAWCore.Destination );
