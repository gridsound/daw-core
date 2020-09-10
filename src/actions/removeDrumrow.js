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
					.reduce( ( max, [ id, { row, when } ] ) => {
						if ( row === rowId ) {
							drumsObj[ id ] = undefined;
						}
						return row in obj.drumrows ? max : Math.max( max, when + .001 );
					}, 0 );

			if ( GSUtils.isntEmpty( drumsObj ) ) {
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
	GSUtils.addIfNotEmpty( obj, "drums", objDrums );
	GSUtils.addIfNotEmpty( obj, "blocks", objBlocks );
	GSUtils.addIfNotEmpty( obj, "patterns", objPatterns );
	if ( GSUtils.isntEmpty( objBlocks ) ) {
		const dur = DAWCore.common.calcNewDuration( obj, get );

		if ( dur !== get.duration() ) {
			obj.duration = dur;
		}
	}
	return obj;
};
