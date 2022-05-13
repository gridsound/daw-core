"use strict";

DAWCore.actions.set( "addPatternKeys", ( synthId, _get, daw ) => {
	const pats = daw.get.patterns();
	const keysId = DAWCore.actionsCommon.getNextIdOf( daw.get.keys() );
	const patId = DAWCore.actionsCommon.getNextIdOf( pats );
	const patName = DAWCore.actionsCommon.createUniqueName( "patterns", "keys", daw.get );
	const synName = daw.get.synth( synthId ).name;
	const order = Object.values( pats ).reduce( ( max, pat ) => {
		return pat.synth !== synthId
			? max
			: Math.max( max, pat.order );
	}, -1 ) + 1;
	const obj = {
		keys: { [ keysId ]: {} },
		patterns: { [ patId ]: {
			order,
			type: "keys",
			name: patName,
			keys: keysId,
			synth: synthId,
			duration: daw.get.beatsPerMeasure(),
		} },
		patternKeysOpened: patId,
	};

	if ( synthId !== daw.$getOpened( "synth" ) ) {
		obj.synthOpened = synthId;
	}
	return [
		obj,
		[ "patterns", "addPatternKeys", patName, synName ],
	];
} );
