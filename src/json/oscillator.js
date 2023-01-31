"use strict";

DAWCoreJSON.oscillator = obj => Object.assign( Object.seal( {
	order: 0,
	type: "sine",
	pan: 0,
	gain: 1,
	detune: 0,
	detunefine: 0,
	unisonvoices: 1,
	unisondetune: .2,
	unisonblend: .33,
} ), obj );
