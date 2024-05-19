"use strict";

function DAWCoreActions_addPatternDrums( daw ) {
	const pats = daw.$getPatterns();
	const drumsId = DAWCoreActionsCommon_getNextIdOf( daw.$getDrums() );
	const patId = DAWCoreActionsCommon_getNextIdOf( pats );
	const patName = DAWCoreActionsCommon_createUniqueName( daw.$getPatterns(), "drums" );
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
			duration: daw.$getBeatsPerMeasure(),
		} },
		patternDrumsOpened: patId,
	};

	return [
		obj,
		[ "patterns", "addPattern", "drums", patName ],
	];
}
