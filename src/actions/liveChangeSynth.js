"use strict";

DAWCore.prototype.liveChangeSynth = function( id, obj ) {
	const syn = this.composition._synths.get( id );

	!syn
		? this._error( "liveChangeSynth", "synths", id )
		: DAWCore.objectDeepAssign( syn.data, obj );
};
