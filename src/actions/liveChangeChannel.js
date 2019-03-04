"use strict";

DAWCore.prototype.liveChangeChannel = function( chanId, prop, val ) {
	const mixer = this.composition._mixer;

	chanId in mixer._chans
		? mixer.liveUpdateChan( chanId, prop, val )
		: this._error( "liveChangeChannel", "channels", chanId );
};
