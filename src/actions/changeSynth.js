"use strict";

DAWCore.prototype.changeSynth = function( id, synth, actionMsg ) {
	actionMsg.push( id );
	this.compositionChange( {
		synths: { [ id ]: synth }
	}, actionMsg );
};
