"use strict";

DAWCore.prototype.addNewComposition = function( opt ) {
	return this.addComposition(
		DAWCore.json.composition( this.env, DAWCore.utils.uuid() ), opt );
};
