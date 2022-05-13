"use strict";

DAWCore.actions.set( "removeDrumrow", ( daw, rowId ) => {
	const patName = DAWCore.actionsCommon.getDrumrowName( daw, rowId );

	return [
		DAWCore.actions._removeDrumrow( {}, rowId, daw ),
		[ "drumrows", "removeDrumrow", patName ],
	];
} );

DAWCore.actions._removeDrumrow = ( obj, rowId, daw ) => {
	const bPM = daw.$getBeatsPerMeasure();
	const blocksEnt = Object.entries( daw.$getBlocks() );
	const patternsEnt = Object.entries( daw.$getPatterns() );
	const objDrums = {};
	const objBlocks = {};
	const objPatterns = {};

	obj.drumrows = obj.drumrows || {};
	obj.drumrows[ rowId ] = undefined;
	patternsEnt.forEach( ( [ patId, pat ] ) => {
		if ( pat.type === "drums" ) {
			const drumsObj = {};
			const drumWhenMax = Object.entries( daw.$getDrums( pat.drums ) )
				.reduce( ( max, [ id, { row, when } ] ) => {
					if ( row === rowId ) {
						drumsObj[ id ] = undefined;
					}
					return row in obj.drumrows ? max : Math.max( max, when + .001 );
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
	DAWCore.utils.addIfNotEmpty( obj, "blocks", objBlocks );
	DAWCore.utils.addIfNotEmpty( obj, "patterns", objPatterns );
	if ( DAWCore.utils.isntEmpty( objBlocks ) ) {
		const dur = DAWCore.actionsCommon.calcNewDuration( daw, obj );

		if ( dur !== daw.$getDuration() ) {
			obj.duration = dur;
		}
	}
	return obj;
};
