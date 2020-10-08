"use strict";

DAWCore.actions.removeKeys = ( patId, keyIds, get ) => {
	const pat = get.pattern( patId ),
		keys = get.keys( pat.keys ),
		keysObj = keyIds.reduce( ( obj, id ) => {
			const { prev, next } = keys[ id ];

			obj[ id ] = undefined;
			if ( prev !== null ) {
				const objPrev = obj[ prev ];

				if ( !( prev in obj ) || objPrev !== undefined ) {
					objPrev
						? objPrev.next = null
						: obj[ prev ] = { next: null };
				}
			}
			if ( next !== null ) {
				const objNext = obj[ next ];

				if ( !( next in obj ) || objNext !== undefined ) {
					objNext
						? objNext.prev = null
						: obj[ next ] = { prev: null };
				}
			}
			return obj;
		}, {} ),
		obj = { keys: { [ pat.keys ]: keysObj } },
		patDur = DAWCore.common.calcNewKeysDuration( pat.keys, keysObj, get ),
		selLen = Object.entries( keys ).reduce( ( nb, [ id, key ] ) => {
			if ( key.selected && !( id in keysObj ) ) {
				keysObj[ id ] = { selected: false };
				return nb + 1;
			}
			return nb;
		}, 0 );

	DAWCore.common.updatePatternDuration( obj, patId, patDur, get );
	return [
		obj,
		keyIds.length
			? [ "keys", "removeKeys", pat.name, keyIds.length ]
			: [ "keys", "unselectAllKeys", pat.name, selLen ],
	];
};
