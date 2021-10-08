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
		duration = get.beatsPerMeasure(),
		obj = {
			slices: {
				[ slicesId ]: {
					0: { x: .00, y: .00, w: .25 },
					1: { x: .25, y: .25, w: .25 },
					2: { x: .50, y: .50, w: .25 },
					3: { x: .75, y: .75, w: .25 },
				},
			},
			patterns: { [ patId ]: {
				order,
				type: "slices",
				name: patName,
				slices: slicesId,
				source: null,
				duration,
				cropA: 0,
				cropB: 1,
			} },
			patternSlicesOpened: patId,
		};

	return [
		obj,
		[ "patterns", "addPattern", "slices", patName ],
	];
};
