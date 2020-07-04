"use strict";

DAWCore.prototype.addNewComposition = function( opt ) {
	return this.addComposition(
		DAWCore.json.composition( this.env, GSUtils.uuid() ), opt );
};
