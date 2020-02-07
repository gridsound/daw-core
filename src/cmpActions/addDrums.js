"use strict";

DAWCore.actions.addDrums = ( patternId, rowId, whenFrom, whenTo, get ) => {
	return DAWCore.actions._addDrums( true, patternId, rowId, whenFrom, whenTo, get );
};

DAWCore.actions._addDrums = ( status, patternId, rowId, whenFrom, whenTo, get ) => {
	const stepDur = 1 / get.stepsPerBeat(),
		whenA = Math.round( Math.min( whenFrom, whenTo ) / stepDur ),
		whenB = Math.round( Math.max( whenFrom, whenTo ) / stepDur ),
		pat = get.pattern( patternId ),
		drums = get.drums( pat.drums ),
		drumrows = get.drumrows(),
		patRowId = get.drumrow( rowId ).pattern,
		patRow = get.pattern( patRowId ),
		drumsEnt = Object.entries( drums ),
		drumsMap = drumsEnt.reduce( ( map, [ drumId, drum ] ) => {
			if ( drum.row === rowId ) {
				map.set( Math.round( drum.when / stepDur ), drumId );
			}
			return map;
		}, new Map() ),
		newDrums = {},
		nextDrumId = +DAWCore.common.getNextIdOf( drums );
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
			newDrums[ nextDrumId + nbDrums ] = {
				when,
				row: rowId,
				gain: 1,
				pan: 0,
				lowpass: 0,
				highpass: 0,
			};
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

		if ( pat.duration !== duration ) {
			const blocks = Object.entries( get.blocks() ).reduce( ( obj, [ blcId, blc ] ) => {
					if ( blc.pattern === patternId && !blc.durationEdited ) {
						obj[ blcId ] = { duration };
					}
					return obj;
				}, {} );

			obj.patterns = { [ patternId ]: { duration } };
			if ( DAWCore.utils.isntEmpty( blocks ) ) {
				const duration = DAWCore.common.calcNewDuration( get, obj.patterns );

				obj.blocks = blocks;
				if ( duration !== get.duration() ) {
					obj.duration = duration;
				}
			}
		}
		return [
			obj,
			[ "drums", status ? "addDrums" : "removeDrums", pat.name, patRow.name, nbDrums ],
		];
	}
};
