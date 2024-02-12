"use strict";

DAWCoreActions.set( "addOscillatorSource", ( daw, synthId, srcType, srcPatId ) => {
	const syn = daw.$getSynth( synthId );
	const newOscId = DAWCoreActionsCommon.getNextIdOf( syn.oscillators );

	return DAWCoreActionsCommon.addPatternBuffer( daw, srcType, srcPatId )
		.then( ( [ newSrcPatId, newSrcPatName, newPatObj ] ) => {
			const newOsc = DAWCoreJSON.oscillator( {
				wave: null,
				source: newSrcPatId,
				order: DAWCoreActionsCommon.getNextOrderOf( syn.oscillators ),
			} );

			return [
				Object.assign( { synths: { [ synthId ]: { oscillators: { [ newOscId ]: newOsc } } } }, newPatObj ),
				[ "synth", "addOscillatorSource", syn.name, newSrcPatName ],
			];
		} );
} );
