"use strict";

DAWCore.actions.set( "removeKeys", ( daw, patId, keyIds ) => {
	const pat = daw.$getPattern( patId );
	const keys = daw.$getKeys( pat.keys );
	const keysObj = keyIds.reduce( ( obj, id ) => {
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
	}, {} );
	const obj = { keys: { [ pat.keys ]: keysObj } };
	const patDur = DAWCore.actionsCommon.calcNewKeysDuration( daw, pat.keys, keysObj );
	const selLen = Object.entries( keys ).reduce( ( nb, [ id, key ] ) => {
		if ( key.selected && !( id in keysObj ) ) {
			keysObj[ id ] = { selected: false };
			return nb + 1;
		}
		return nb;
	}, 0 );

	DAWCore.actionsCommon.updatePatternDuration( daw, obj, patId, patDur );
	return [
		obj,
		keyIds.length
			? [ "keys", "removeKeys", pat.name, keyIds.length ]
			: [ "keys", "unselectAllKeys", pat.name, selLen ],
	];
} );
