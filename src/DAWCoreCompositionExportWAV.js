"use strict";

class DAWCoreCompositionExportWAV {
	static #URLToRevoke = null;

	static $abort( daw ) {
		if ( daw.ctx instanceof OfflineAudioContext ) {
			daw.$compositionStop();
		}
	}
	static $export( daw ) {
		const ctx = daw.ctx;
		const dur = Math.ceil( daw.$getDuration() / daw.$getBPS() ) || 1;
		const ctxOff = new OfflineAudioContext( 2, dur * ctx.sampleRate | 0, ctx.sampleRate );

		daw.$stop();
		if ( DAWCoreCompositionExportWAV.#URLToRevoke ) {
			URL.revokeObjectURL( DAWCoreCompositionExportWAV.#URLToRevoke );
		}
		daw.$setContext( ctxOff );
		daw.$compositionPlay();
		return ctxOff.startRendering().then( buffer => {
			const pcm = gswaEncodeWAV.$encode( buffer, { float32: true } );
			const url = URL.createObjectURL( new Blob( [ pcm ] ) );

			daw.$compositionStop();
			daw.$setContext( ctx );
			DAWCoreCompositionExportWAV.#URLToRevoke = url;
			return {
				url,
				name: `${ daw.$getName() || "untitled" }.wav`,
			};
		} );
	}
}
