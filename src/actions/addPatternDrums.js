"use strict";

DAWCore.actions.addPatternDrums = get => {
	const pats = get.patterns();
	const drumsId = DAWCore.actions.common.getNextIdOf( get.drums() );
	const patId = DAWCore.actions.common.getNextIdOf( pats );
	const patName = DAWCore.actions.common.createUniqueName( "patterns", "drums", get );
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
};
