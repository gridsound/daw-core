"use strict";

DAWCore.actions.cloneSelectedKeys = ( patId, keyIds, whenIncr, get ) => {
	const pat = get.pattern( patId ),
		keys = get.keys( pat.keys ),
		nextId = DAWCore.common.getNextIdOf( keys ),
		keysObj = {},
		obj = { keys: { [ pat.keys ]: keysObj } },
		mapIds = keyIds.reduce( ( map, id, i ) => {
			const nId = `${ nextId + i }`,
				nKey = { ...keys[ id ] };

			nKey.when += whenIncr;
			nKey.prev =
			nKey.next = null;
			keysObj[ id ] = { selected: false };
			keysObj[ nId ] = nKey;
			map.set( id, nId );
			return map;
		}, new Map() ),
		dur = DAWCore.common.calcNewKeysDuration( pat.keys, keysObj, get );

	keyIds.forEach( id => {
		const keyNext = keys[ id ].next;

		if ( mapIds.has( keyNext ) ) {
			const nId = mapIds.get( id ),
				nIdNext = mapIds.get( keyNext );

			keysObj[ nId ].next = nIdNext;
			keysObj[ nIdNext ].prev = nId;
		}
	} );
	DAWCore.common.updatePatternDuration( obj, patId, dur, get );
	return [
		obj,
		[ "keys", "cloneSelectedKeys", pat.name, keyIds.length ],
	];
};
