"use strict";

DAWCore.actions.addPatternSlices = get => {
	const pats = get.patterns(),
		slicesId = DAWCore.actions.common.getNextIdOf( get.slices() ),
		patId = DAWCore.actions.common.getNextIdOf( pats ),
		patName = DAWCore.actions.common.createUniqueName( "patterns", "slices", get ),
		order = Object.values( pats ).reduce( ( max, pat ) => {
			return pat.type !== "slices"
				? max
				: Math.max( max, pat.order );
		}, -1 ) + 1,
		obj = {
			slices: { [ slicesId ]: {} },
			patterns: { [ patId ]: {
				order,
				type: "slices",
				name: patName,
				slices: slicesId,
				duration: get.beatsPerMeasure(),
			} },
			patternSlicesOpened: patId,
		};

	return [
		obj,
		[ "patterns", "addPattern", "slices", patName ],
	];
};
