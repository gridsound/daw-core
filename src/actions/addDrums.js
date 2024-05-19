"use strict";

function DAWCoreActions_addDrums( daw, patternId, rowId, arr ) {
	return DAWCoreActions__addDrums( "drum", true, patternId, rowId, arr, daw );
}

function DAWCoreActions__addDrums( type, status, patternId, rowId, arr, daw ) {
	const bPM = daw.$getBeatsPerMeasure();
	const stepDur = 1 / daw.$getStepsPerBeat();
	const pat = daw.$getPattern( patternId );
	const drums = daw.$getDrums( pat.drums );
	const patRowId = daw.$getDrumrow( rowId ).pattern;
	const patRow = daw.$getPattern( patRowId );
	const nextDrumId = +DAWCoreActionsCommon_getNextIdOf( drums );
	const jsonType = type === "drum" ? DAWCoreJSON_drum : DAWCoreJSON_drumcut;
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

	DAWCoreActionsCommon_updatePatternDuration( daw, obj, patternId, duration );
	return [
		obj,
		[ "drums", status ? "addDrums" : "removeDrums", pat.name, patRow.name, nbDrums ],
	];
}
