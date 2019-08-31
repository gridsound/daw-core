"use strict";

DAWCore.prototype.liveChangeChannel = function( chanId, prop, val ) {
	this.composition._mixer.gsdata.liveChange( chanId, prop, val );
};
