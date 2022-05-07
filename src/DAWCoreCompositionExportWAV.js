"use strict";

class DAWCoreCompositionExportWAV {
	static #URLToRevoke = null;

	static abort( daw ) {
		if ( daw.ctx instanceof OfflineAudioContext ) {
			daw.composition.stop();
		}
	}
	static export( daw ) {
		const ctx = daw.ctx;
		const dur = Math.ceil( daw.get.duration() / daw.get.bps() ) || 1;
		const ctxOff = new OfflineAudioContext( 2, dur * ctx.sampleRate | 0, ctx.sampleRate );

		daw.stop();
		if ( DAWCoreCompositionExportWAV.#URLToRevoke ) {
			URL.revokeObjectURL( DAWCoreCompositionExportWAV.#URLToRevoke );
		}
		daw.setCtx( ctxOff );
		daw.composition.play();
		return ctxOff.startRendering().then( buffer => {
			const pcm = gswaEncodeWAV.encode( buffer, { float32: true } );
			const url = URL.createObjectURL( new Blob( [ pcm ] ) );

			daw.composition.stop();
			daw.setCtx( ctx );
			DAWCoreCompositionExportWAV.#URLToRevoke = url;
			return {
				url,
				name: `${ daw.get.name() || "untitled" }.wav`,
			};
		} );
	}
}
