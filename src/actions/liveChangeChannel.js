"use strict";

DAWCore.prototype.liveChangeChannel = function( id, prop, val ) {
	this.composition._wamixer.change( { channels: { [ id ]: { [ prop ]: val } } } );
};
