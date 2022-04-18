"use strict";

DAWCore.actions.cloneSelectedKeys = ( patId, keyIds, whenIncr, get ) => {
	const pat = get.pattern( patId );
	const keys = get.keys( pat.keys );
	const nextId = DAWCore.actions.common.getNextIdOf( keys );
	const keysObj = {};
	const obj = { keys: { [ pat.keys ]: keysObj } };
	const mapIds = keyIds.reduce( ( map, id, i ) => {
		const nId = `${ nextId + i }`;
		const nKey = { ...keys[ id ] };

		nKey.when += whenIncr;
		nKey.prev =
			nKey.next = null;
		keysObj[ id ] = { selected: false };
		keysObj[ nId ] = nKey;
		map.set( id, nId );
		return map;
	}, new Map() );
	const dur = DAWCore.actions.common.calcNewKeysDuration( pat.keys, keysObj, get );

	keyIds.forEach( id => {
		const keyNext = keys[ id ].next;

		if ( mapIds.has( keyNext ) ) {
			const nId = mapIds.get( id );
			const nIdNext = mapIds.get( keyNext );

			keysObj[ nId ].next = nIdNext;
			keysObj[ nIdNext ].prev = nId;
		}
	} );
	DAWCore.actions.common.updatePatternDuration( obj, patId, dur, get );
	return [
		obj,
		[ "keys", "cloneSelectedKeys", pat.name, keyIds.length ],
	];
};
