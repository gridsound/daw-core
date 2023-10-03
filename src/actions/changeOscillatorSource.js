"use strict";

DAWCoreActions.set( "changeOscillatorSource", ( daw, synthId, oscId, patId, resetOsc ) => {
	const syn = daw.$getSynth( synthId );
	const oscOri = syn.oscillators[ oscId ];
	const osc = {};

	if ( oscOri.source !== patId ) {
		osc.source = patId;
	}
	if ( oscOri.wave ) {
		osc.wave = null;
	}
	if ( resetOsc ) {
		if ( oscOri.pan !== 0 ) { osc.pan = 0; }
		if ( oscOri.gain !== 1 ) { osc.gain = 1; }
		if ( oscOri.detune !== 0 ) { osc.detune = 0; }
		if ( oscOri.detunefine !== 0 ) { osc.detunefine = 0; }
		if ( oscOri.unisonvoices !== 1 ) { osc.unisonvoices = 1; }
	}
	if ( GSUisntEmpty( osc ) ) {
		return [
			{ synths: { [ synthId ]: { oscillators: { [ oscId ]: osc } } } },
			[ "synth", "changeOscillatorSource", syn.name, daw.$getPattern( patId ).name ],
		];
	}
} );
