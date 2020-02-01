"use strict";

DAWCore.actions.redirectToChannel = function( family, id, dest ) {
	const node = this.get[ family ]( id ),
		chanName = this.get.channel( dest ).name,
		families = `${ family }s`;

	return [
		{ [ families ]: { [ id ]: { dest } } },
		[ families, `redirect${ DAWCore.utils.capitalize( family ) }`, node.name, chanName ],
	];
};
