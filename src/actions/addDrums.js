"use strict";

DAWCore.actions.addDrums = ( patternId, rowId, whenFrom, whenTo, get ) => {
	return DAWCore.actions._addDrums( "drum", true, patternId, rowId, whenFrom, whenTo, get );
};

DAWCore.actions._addDrums = ( type, status, patternId, rowId, whenFrom, whenTo, get ) => {
	const stepDur = 1 / get.stepsPerBeat(),
		whenA = Math.round( Math.min( whenFrom, whenTo ) / stepDur ),
		whenB = Math.round( Math.max( whenFrom, whenTo ) / stepDur ),
		pat = get.pattern( patternId ),
		drums = get.drums( pat.drums ),
		patRowId = get.drumrow( rowId ).pattern,
		patRow = get.pattern( patRowId ),
		drumsEnt = Object.entries( drums ),
		drumsMap = drumsEnt.reduce( ( map, [ drumId, drum ] ) => {
			if ( drum.row === rowId && type === "drum" === "gain" in drum ) {
				map.set( Math.round( drum.when / stepDur ), drumId );
			}
			return map;
		}, new Map() ),
		newDrums = {},
		nextDrumId = +DAWCore.common.getNextIdOf( drums ),
		jsonType = DAWCore.json[ type ];
	let nbDrums = 0,
		drumWhenMax = pat.duration;

	for ( let w = whenA; w <= whenB; ++w ) {
		const drmId = drumsMap.get( w );

		if ( drmId ) {
			if ( !status ) {
				newDrums[ drmId ] = undefined;
				++nbDrums;
			}
		} else if ( status ) {
			const when = w * stepDur;

			drumWhenMax = Math.max( drumWhenMax, when + .001 );
			newDrums[ nextDrumId + nbDrums ] = jsonType( { when, row: rowId } );
			++nbDrums;
		}
	}
	if ( nbDrums > 0 && !status ) {
		drumWhenMax = drumsEnt.reduce( ( dur, [ drumId, drum ] ) => {
			return drumId in newDrums
				? dur
				: Math.max( dur, drum.when + .001 );
		}, 0 );
	}
	if ( nbDrums > 0 ) {
		const bPM = get.beatsPerMeasure(),
			duration = Math.max( 1, Math.ceil( drumWhenMax / bPM ) ) * bPM,
			obj = { drums: { [ pat.drums ]: newDrums } };

		DAWCore.common.updatePatternDuration( obj, patternId, duration, get );
		return [
			obj,
			[ "drums", status ? "addDrums" : "removeDrums", pat.name, patRow.name, nbDrums ],
		];
	}
};
