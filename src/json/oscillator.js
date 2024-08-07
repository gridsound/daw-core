"use strict";

function DAWCoreJSON_oscillator( obj ) {
	return Object.assign( Object.seal( {
		order: 0,
		wave: "sine",
		source: null,
		phaze: 0,
		pan: 0,
		gain: 1,
		detune: 0,
		detunefine: 0,
		unisonvoices: 1,
		unisondetune: .2,
		unisonblend: .33,
	} ), obj );
}
