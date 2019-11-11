"use strict";

DAWCore.prototype.changeSynth = function( id, synth, actionMsg ) {
	this.compositionChange( {
		synths: { [ id ]: synth }
	}, actionMsg );
};
