"use strict";

DAWCore.actionsCommon.toggleSolo = ( soloId, list ) => {
	const entries = Object.entries( list );
	const someOn = entries.some( kv => kv[ 0 ] !== soloId && kv[ 1 ].toggle === true );
	const obj = entries.reduce( ( obj, [ id, item ] ) => {
		const itself = id === soloId;

		if ( ( itself && !item.toggle ) || ( !itself && item.toggle === someOn ) ) {
			obj[ id ] = { toggle: !item.toggle };
		}
		return obj;
	}, {} );

	return [ !someOn, obj ];
};
