"use strict";

DAWCore.actions.removeDrumrow = ( rowId, get ) => {
	const patName = DAWCore.common.getDrumrowName( rowId, get );

	return [
		DAWCore.actions._removeDrumrow( {}, rowId, get ),
		[ "drumrows", "removeDrumrow", patName ],
	];
};

DAWCore.actions._removeDrumrow = ( obj, rowId, get ) => {
	const bPM = get.beatsPerMeasure(),
		blocksEnt = Object.entries( get.blocks() ),
		patternsEnt = Object.entries( get.patterns() ),
		objDrums = {},
		objBlocks = {},
		objPatterns = {};

	obj.drumrows = obj.drumrows || {};
	obj.drumrows[ rowId ] = undefined;
	patternsEnt.forEach( ( [ patId, pat ] ) => {
		if ( pat.type === "drums" ) {
			const drumsObj = {},
				drumWhenMax = Object.entries( get.drums( pat.drums ) )
					.reduce( ( max, [ drumId, drum ] ) => {
						if ( drum.row in obj.drumrows ) {
							drumsObj[ drumId ] = undefined;
							return max;
						}
						return Math.max( max, drum.when + .001 );
					}, 0 );

			if ( DAWCore.utils.isntEmpty( drumsObj ) ) {
				const duration = Math.max( 1, Math.ceil( drumWhenMax / bPM ) ) * bPM;

				objDrums[ pat.drums ] = drumsObj;
				if ( duration !== pat.duration ) {
					objPatterns[ patId ] = { duration };
					blocksEnt.forEach( ( [ blcId, blc ] ) => {
						if ( blc.pattern === patId && !blc.durationEdited ) {
							objBlocks[ blcId ] = { duration };
						}
					} );
				}
			}
		}
	} );
	DAWCore.utils.addIfNotEmpty( obj, "drums", objDrums );
	DAWCore.utils.addIfNotEmpty( obj, "patterns", objPatterns );
	if ( DAWCore.utils.isntEmpty( objBlocks ) ) {
		const duration = DAWCore.common.calcNewDuration( objPatterns, get );

		obj.blocks = objBlocks;
		if ( duration !== get.duration() ) {
			obj.duration = duration;
		}
	}
	return obj;
};
