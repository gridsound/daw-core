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
		const min = DAWCore.time.beatToMin( beat, bpm ),
			sec = DAWCore.time.beatToSec( beat, bpm );

		return `${ min }:${ sec }`;
	},

	// private:
	_padZero( val ) {
		return ( val < 10 ? "0" : "" ) + ~~val;
	}
};
