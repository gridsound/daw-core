"use strict";

DAWCoreActions.set( "addOscillatorSource", ( daw, synthId, sourcePatId ) => {
	const syn = daw.$getSynth( synthId );
	const id = DAWCoreActionsCommon.getNextIdOf( syn.oscillators );
	const osc = DAWCoreJSON.oscillator( {
		wave: null,
		source: sourcePatId,
		order: DAWCoreActionsCommon.getNextOrderOf( syn.oscillators ),
	} );

	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: osc } } } },
		[ "synth", "addOscillatorSource", syn.name, daw.$getPattern( sourcePatId ).name ],
	];
} );
