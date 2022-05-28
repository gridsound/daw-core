"use strict";

DAWCore.actions.set( "addPatternSlices", daw => {
	const pats = daw.$getPatterns();
	const slicesId = DAWCore.actionsCommon.getNextIdOf( daw.$getSlices() );
	const patId = DAWCore.actionsCommon.getNextIdOf( pats );
	const patName = DAWCore.actionsCommon.createUniqueName( daw.$getPatterns(), "slices" );
	const order = Object.values( pats ).reduce( ( max, pat ) => {
		return pat.type !== "slices"
			? max
			: Math.max( max, pat.order );
	}, -1 ) + 1;
	const obj = {
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
		} },
		patternSlicesOpened: patId,
	};

	return [
		obj,
		[ "patterns", "addPattern", "slices", patName ],
	];
} );
