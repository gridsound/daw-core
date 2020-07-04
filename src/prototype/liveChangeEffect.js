"use strict";

DAWCore.prototype.liveChangeEffect = function( fxId, prop, val ) {
	this.composition._waeffects.liveChangeFxProp( fxId, prop, val );
};
