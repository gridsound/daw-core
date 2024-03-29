"use strict";

DAWCoreActions.set( "addOscillator", ( daw, synthId ) => {
	const syn = daw.$getSynth( synthId );
	const id = DAWCoreActionsCommon.getNextIdOf( syn.oscillators );
	const osc = DAWCoreJSON.oscillator( {
		order: DAWCoreActionsCommon.getNextOrderOf( syn.oscillators ),
	} );

	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: osc } } } },
		[ "synth", "addOscillator", syn.name ],
	];
} );
