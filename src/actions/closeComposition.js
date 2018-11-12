"use strict";

DAWCore.prototype.closeComposition = function() {
	if ( this.composition.loaded ) {
		const cmp = this.get.composition();

		this.stop();
		this.pianoroll.clearLoop();
		this.pianoroll.setCurrentTime( 0 );
		this.composition.setCurrentTime( 0 );
		this._stopLoop();
		this._call( "compositionClosed", cmp );
		this.composition.unload();
		this.history.empty();
		if ( !cmp.savedAt ) {
			this._deleteComposition( cmp.id );
		}
	}
};
