"use strict";

DAWCore.actions.addDrums = function( patternId, rowId, whenFrom, whenTo ) {
	return DAWCore.actions._addDrums.call( this, true, patternId, rowId, whenFrom, whenTo );
};

DAWCore.actions._addDrums = function( status, patternId, rowId, whenFrom, whenTo ) {
	const stepDur = 1 / this.get.stepsPerBeat(),
		whenA = Math.round( Math.min( whenFrom, whenTo ) / stepDur ),
		whenB = Math.round( Math.max( whenFrom, whenTo ) / stepDur ),
		pat = this.get.pattern( patternId ),
		drums = this.get.drums( pat.drums ),
		drumrows = this.get.drumrows(),
		patRowId = this.get.drumrow( rowId ).pattern,
		patRow = this.get.pattern( patRowId ),
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
		const bPM = this.get.beatsPerMeasure(),
			duration = Math.max( 1, Math.ceil( drumWhenMax / bPM ) ) * bPM,
			obj = { drums: { [ pat.drums ]: newDrums } };

		if ( pat.duration !== duration ) {
			const blocks = Object.entries( this.get.blocks() ).reduce( ( obj, [ blcId, blc ] ) => {
					if ( blc.pattern === patternId && !blc.durationEdited ) {
						obj[ blcId ] = { duration };
					}
					return obj;
				}, {} );

			obj.patterns = { [ patternId ]: { duration } };
			if ( DAWCore.utils.isntEmpty( blocks ) ) {
				const duration = DAWCore.common.calcNewDuration( this.get, obj.patterns );

				obj.blocks = blocks;
				if ( duration !== this.get.duration() ) {
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
