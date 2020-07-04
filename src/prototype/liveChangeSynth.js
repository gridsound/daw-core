"use strict";

DAWCore.prototype.liveChangeSynth = function( id, obj ) {
	this.composition._synths.get( id ).change( obj );
};
