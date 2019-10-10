"use strict";

DAWCore.prototype.liveChangeChannel = function( chanId, prop, val ) {
	this.composition._wamixer.gsdata.liveChange( chanId, prop, val );
};
