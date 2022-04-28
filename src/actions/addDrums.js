"use strict";

DAWCore.actions.addDrums = ( patternId, rowId, whenFrom, whenTo, get ) => {
	return DAWCore.actions._addDrums( "drum", true, patternId, rowId, whenFrom, whenTo, get );
};

DAWCore.actions._addDrums = ( type, status, patternId, rowId, whenFrom, whenTo, get ) => {
	const stepDur = 1 / get.stepsPerBeat();
	const whenA = Math.round( Math.min( whenFrom, whenTo ) / stepDur );
	const whenB = Math.round( Math.max( whenFrom, whenTo ) / stepDur );
	const pat = get.pattern( patternId );
	const drums = get.drums( pat.drums );
	const patRowId = get.drumrow( rowId ).pattern;
	const patRow = get.pattern( patRowId );
	const drumsEnt = Object.entries( drums );
	const drumsMap = drumsEnt.reduce( ( map, [ drumId, drum ] ) => {
		if ( drum.row === rowId && type === "drum" === "gain" in drum ) {
			map.set( Math.round( drum.when / stepDur ), drumId );
		}
		return map;
	}, new Map() );
	const newDrums = {};
	const nextDrumId = +DAWCore.actionsCommon.getNextIdOf( drums );
	const jsonType = DAWCore.json[ type ];
	let nbDrums = 0;
	let drumWhenMax = pat.duration;

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
		const bPM = get.beatsPerMeasure();
		const duration = Math.max( 1, Math.ceil( drumWhenMax / bPM ) ) * bPM;
		const obj = { drums: { [ pat.drums ]: newDrums } };

		DAWCore.actionsCommon.updatePatternDuration( obj, patternId, duration, get );
		return [
			obj,
			[ "drums", status ? "addDrums" : "removeDrums", pat.name, patRow.name, nbDrums ],
		];
	}
};
