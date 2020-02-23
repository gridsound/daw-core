"use strict";

DAWCore.actions.redirectToChannel = ( family, id, dest, get ) => {
	const node = get[ family ]( id ),
		chanName = get.channel( dest ).name,
		families = `${ family }s`;

	return [
		{ [ families ]: { [ id ]: { dest } } },
		[ families, `redirect${ GSUtils.capitalize( family ) }`, node.name, chanName ],
	];
};
