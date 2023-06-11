"use strict";

DAWCoreActions.set( "addDrums", ( daw, patternId, rowId, arr ) => {
	return DAWCoreActions._addDrums( "drum", true, patternId, rowId, arr, daw );
} );

DAWCoreActions._addDrums = ( type, status, patternId, rowId, arr, daw ) => {
	const bPM = daw.$getBeatsPerMeasure();
	const stepDur = 1 / daw.$getStepsPerBeat();
	const pat = daw.$getPattern( patternId );
	const drums = daw.$getDrums( pat.drums );
	const patRowId = daw.$getDrumrow( rowId ).pattern;
	const patRow = daw.$getPattern( patRowId );
	const nextDrumId = +DAWCoreActionsCommon.getNextIdOf( drums );
	const jsonType = DAWCoreJSON[ type ];
	const newDrums = {};
	const obj = { drums: { [ pat.drums ]: newDrums } };
	let nbDrums = 0;
	let drumWhenMax = pat.duration;

	if ( status ) {
		arr.forEach( ( dr, i ) => {
			newDrums[ nextDrumId + i ] = jsonType( { ...dr, row: rowId } );
			drumWhenMax = Math.max( drumWhenMax, dr.when + .001 );
		} );
	} else {
		arr.forEach( id => newDrums[ id ] = undefined );
		drumWhenMax = Object.entries( drums ).reduce( ( dur, [ drumId, drum ] ) => {
			return drumId in newDrums
				? dur
				: Math.max( dur, drum.when + .001 );
		}, 0 );
	}

	const duration = Math.max( 1, Math.ceil( drumWhenMax / bPM ) ) * bPM;

	DAWCoreActionsCommon.updatePatternDuration( daw, obj, patternId, duration );
	return [
		obj,
		[ "drums", status ? "addDrums" : "removeDrums", pat.name, patRow.name, nbDrums ],
	];
};
