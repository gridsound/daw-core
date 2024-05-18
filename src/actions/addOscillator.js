"use strict";

DAWCoreActions.set( "addOscillator", ( daw, synthId ) => {
	const syn = daw.$getSynth( synthId );
	const id = DAWCoreActionsCommon_getNextIdOf( syn.oscillators );
	const osc = DAWCoreJSON.oscillator( {
		order: DAWCoreActionsCommon_getNextOrderOf( syn.oscillators ),
	} );

	return [
		{ synths: { [ synthId ]: { oscillators: { [ id ]: osc } } } },
		[ "synth", "addOscillator", syn.name ],
	];
} );
