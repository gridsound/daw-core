"use strict";

DAWCore.actions.redirectNode = function( type, id, dest ) {
	const node = this.get[ type ]( id ),
		chanName = this.get.channel( dest ).name,
		types = `${ type }s`;

	return [
		{ [ types ]: { [ id ]: { dest } } },
		[ types, `redirect${ DAWCore.utils.capitalize( type ) }`, node.name, chanName ],
	];
};
