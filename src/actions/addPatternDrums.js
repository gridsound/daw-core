"use strict";

DAWCore.actions.set( "addPatternDrums", get => {
	const pats = get.patterns();
	const drumsId = DAWCore.actionsCommon.getNextIdOf( get.drums() );
	const patId = DAWCore.actionsCommon.getNextIdOf( pats );
	const patName = DAWCore.actionsCommon.createUniqueName( "patterns", "drums", get );
	const order = Object.values( pats ).reduce( ( max, pat ) => {
		return pat.type !== "drums"
			? max
			: Math.max( max, pat.order );
	}, -1 ) + 1;
	const obj = {
		drums: { [ drumsId ]: {} },
		patterns: { [ patId ]: {
			order,
			type: "drums",
			name: patName,
			drums: drumsId,
			duration: get.beatsPerMeasure(),
		} },
		patternDrumsOpened: patId,
	};

	return [
		obj,
		[ "patterns", "addPattern", "drums", patName ],
	];
} );
