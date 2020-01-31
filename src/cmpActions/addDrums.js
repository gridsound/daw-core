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
		drumsMap = Object.entries( drums ).reduce( ( map, [ drumId, drum ] ) => {
			if ( drum.row === rowId ) {
				map.set( Math.round( drum.when / stepDur ), drumId );
			}
			return map;
		}, new Map() ),
		newDrums = {},
		nextDrumId = +this._getNextIdOf( drums );
	let nbDrums = 0;

	for ( let w = whenA; w <= whenB; ++w ) {
		const drmId = drumsMap.get( w );

		if ( drmId ) {
			if ( !status ) {
				newDrums[ drmId ] = undefined;
				++nbDrums;
			}
		} else if ( status ) {
			newDrums[ nextDrumId + nbDrums ] = {
				when: w * stepDur,
				row: rowId,
				gain: 1,
				pan: 0,
				lowpass: 0,
				highpass: 0,
			};
			++nbDrums;
		}
	}
	if ( nbDrums > 0 ) {
		return [
			{ drums: { [ pat.drums ]: newDrums } },
			[ "drums", status ? "addDrums" : "removeDrums", pat.name, patRow.name, nbDrums ],
		];
	}
};
