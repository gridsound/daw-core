"use strict";

DAWCore.actions.set( "cloneSelectedKeys", ( patId, keyIds, whenIncr, _get, daw ) => {
	const pat = daw.get.pattern( patId );
	const keys = daw.get.keys( pat.keys );
	const nextId = DAWCore.actionsCommon.getNextIdOf( keys );
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
	const dur = DAWCore.actionsCommon.calcNewKeysDuration( pat.keys, keysObj, daw );

	keyIds.forEach( id => {
		const keyNext = keys[ id ].next;

		if ( mapIds.has( keyNext ) ) {
			const nId = mapIds.get( id );
			const nIdNext = mapIds.get( keyNext );

			keysObj[ nId ].next = nIdNext;
			keysObj[ nIdNext ].prev = nId;
		}
	} );
	DAWCore.actionsCommon.updatePatternDuration( obj, patId, dur, daw );
	return [
		obj,
		[ "keys", "cloneSelectedKeys", pat.name, keyIds.length ],
	];
} );
