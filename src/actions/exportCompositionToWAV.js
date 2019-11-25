"use strict";

DAWCore.prototype.exportCompositionToWAV = function() {
	const ctx = this.ctx,
		gain = this.destination.getGain(),
		dur = Math.ceil( this.get.duration() * 60 / this.get.bpm() ) || 1,
		ctxOff = new OfflineAudioContext( 2, dur * ctx.sampleRate | 0, ctx.sampleRate );

	this.stop();
	if ( DAWCore._URLToRevoke ) {
		URL.revokeObjectURL( DAWCore._URLToRevoke );
	}
	this.setCtx( ctxOff );
	this.destination.setGain( 1 );
	this.composition.play();
	return ctxOff.startRendering().then( buffer => {
		const pcm = gswaEncodeWAV.encode( buffer, { float32: true } ),
			url = URL.createObjectURL( new Blob( [ pcm ] ) );

		this.composition.stop();
		this.setCtx( ctx );
		this.destination.setGain( gain );
		DAWCore._URLToRevoke = url;
		return {
			url,
			name: `${ this.get.name() || "untitled" }.wav`,
		};
	} );
};
