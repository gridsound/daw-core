"use strict";

DAWCore.Destination = class {
	constructor( daw ) {
		this.daw = daw;
		this._gain = 1;
		this.empty();
	}

	getDestination() {
		return this._inputNode;
	}
	getGain() {
		return this._gain;
	}
	setGain( v ) {
		this._gain = v;
		this._gainNode.gain.value = v * v;
	}
	empty() {
		this._gainNode && this._gainNode.disconnect();
		this._inputNode && this._inputNode.disconnect();
		this._analyserNode && this._analyserNode.disconnect();
		this._gainNode =
		this._inputNode =
		this._analyserNode =
		this._analyserData = null;
	}
	setCtx( ctx ) {
		const offline = ctx instanceof OfflineAudioContext;

		this.empty();
		this.ctx = ctx;
		this._inputNode = ctx.createGain();
		this._gainNode = ctx.createGain();
		this._gainNode.connect( ctx.destination );
		this._inputNode.connect( this._gainNode );
		this.toggleAnalyser( !offline && this.daw.env.analyserEnable );
	}
	analyserFillData() {
		if ( this._analyserNode ) {
			this._analyserNode.getByteFrequencyData( this._analyserData );
			return this._analyserData;
		}
	}
	toggleAnalyser( b ) {
		if ( this._analyserNode ) {
			this._analyserNode.disconnect();
		}
		if ( b ) {
			const an = this.ctx.createAnalyser(),
				fftSize = this.daw.env.analyserFFTsize;

			this._analyserNode = an;
			this._analyserData = new Uint8Array( fftSize / 2 );
			an.fftSize = fftSize;
			an.smoothingTimeConstant = 0;
			an.connect( this._gainNode );
			this._inputNode.connect( an );
		} else {
			this._analyserNode =
			this._analyserData = null;
			this._inputNode.connect( this._gainNode );
		}
	}
};
