"use strict";

DAWCoreActions.set( "changeOscillatorSource", ( daw, synthId, oscId, srcType, srcPatId, resetOsc ) => {
	return DAWCoreActionsCommon_addPatternBuffer( daw, srcType, srcPatId )
		.then( ( [ newSrcPatId, newSrcPatName, newPatObj ] ) => {
			const syn = daw.$getSynth( synthId );
			const oscOri = syn.oscillators[ oscId ];
			const osc = {};

			if ( oscOri.source !== newSrcPatId ) {
				osc.source = newSrcPatId;
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
					Object.assign( { synths: { [ synthId ]: { oscillators: { [ oscId ]: osc } } } }, newPatObj ),
					[ "synth", "changeOscillatorSource", syn.name, newSrcPatName ],
				];
			}
		} );
} );
