"use strict";

function DAWCoreActions_addOscillatorSource( daw, synthId, srcType, srcPatId ) {
	const syn = daw.$getSynth( synthId );
	const newOscId = DAWCoreActionsCommon_getNextIdOf( syn.oscillators );

	return DAWCoreActionsCommon_addPatternBuffer( daw, srcType, srcPatId )
		.then( ( [ newSrcPatId, newSrcPatName, newPatObj ] ) => {
			const newOsc = DAWCoreJSON.oscillator( {
				wave: null,
				source: newSrcPatId,
				order: DAWCoreActionsCommon_getNextOrderOf( syn.oscillators ),
			} );

			return [
				Object.assign( { synths: { [ synthId ]: { oscillators: { [ newOscId ]: newOsc } } } }, newPatObj ),
				[ "synth", "addOscillatorSource", syn.name, newSrcPatName ],
			];
		} );
}
