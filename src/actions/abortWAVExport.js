"use strict";

DAWCore.prototype.abortWAVExport = function() {
	if ( this.ctx instanceof OfflineAudioContext ) {
		this.composition.stop();
	}
};
