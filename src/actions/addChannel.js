"use strict";

DAWCore.actions.addChannel = get => {
	const channels = get.channels(),
		id = DAWCore.actions.common.getNextIdOf( channels ),
		order = DAWCore.actions.common.getNextOrderOf( channels ),
		name = `chan ${ id }`,
		chanObj = DAWCore.json.channel( { order, name } );

	return [
		{ channels: { [ id ]: chanObj } },
		[ "channels", "addChannel", name ],
	];
};
