"use strict";

DAWCoreActions.set( "removeDrumrow", ( daw, rowId ) => {
	const patName = DAWCoreActionsCommon_getDrumrowName( daw, rowId );

	return [
		DAWCoreActions._removeDrumrow( {}, rowId, daw ),
		[ "drumrows", "removeDrumrow", patName ],
	];
} );

DAWCoreActions._removeDrumrow = ( obj, rowId, daw ) => {
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

			if ( GSUisntEmpty( drumsObj ) ) {
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
	GSUaddIfNotEmpty( obj, "drums", objDrums );
	GSUaddIfNotEmpty( obj, "blocks", objBlocks );
	GSUaddIfNotEmpty( obj, "patterns", objPatterns );
	if ( GSUisntEmpty( objBlocks ) ) {
		const dur = DAWCoreActionsCommon_calcNewDuration( daw, obj );

		if ( dur !== daw.$getDuration() ) {
			obj.duration = dur;
		}
	}
	return obj;
};
