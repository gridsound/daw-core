"use strict";

DAWCore.time = {

	// mixtes:
	beatToMin( beat, bpm ) {
		return ~~( beat / bpm );
	},
	beatToSec( beat, bpm ) {
		return DAWCore.time._padZero( beat * 60 / bpm % 60 );
	},
	beatToMinSec( beat, bpm ) {
		return DAWCore.time.beatToMin( beat, bpm ) + ":" +
			DAWCore.time.beatToSec( beat, bpm );
	},

	// private:
	_padZero( val ) {
		return ( val < 10 ? "0" : "" ) + ~~val;
	}
};
