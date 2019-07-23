"use strict";

DAWCore.prototype.closeComposition = function() {
	if ( this.composition.loaded ) {
		const cmp = this.cmps[ this.get.saveMode() ].get( this.get.id() );

		this.stop();
		this.pianoroll.clearLoop();
		this.pianoroll.setCurrentTime( 0 );
		this.composition.setCurrentTime( 0 );
		this._stopLoop();
		this._call( "compositionClosed", cmp );
		this.composition.unload();
		this.history.empty();
		this.buffers.empty();
		if ( !cmp.savedAt ) {
			this._deleteComposition( cmp );
		}
	}
};
