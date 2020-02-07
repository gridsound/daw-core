"use strict";

DAWCore.utils.time = {

	// mixtes:
	beatToMin( beat, bpm ) {
		return ~~( beat / bpm );
	},
	beatToSec( beat, bpm ) {
		return DAWCore.utils.time._padZero( beat * 60 / bpm % 60 );
	},
	beatToMinSec( beat, bpm ) {
		const min = DAWCore.utils.time.beatToMin( beat, bpm ),
			sec = DAWCore.utils.time.beatToSec( beat, bpm );

		return `${ min }:${ sec }`;
	},

	// private:
	_padZero( val ) {
		return ( val < 10 ? "0" : "" ) + ~~val;
	}
};
