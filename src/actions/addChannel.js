"use strict";

DAWCore.actions.addChannel = get => {
	const channels = get.channels();
	const id = DAWCore.actions.common.getNextIdOf( channels );
	const order = DAWCore.actions.common.getNextOrderOf( channels );
	const name = `chan ${ id }`;
	const chanObj = DAWCore.json.channel( { order, name } );

	return [
		{ channels: { [ id ]: chanObj } },
		[ "channels", "addChannel", name ],
	];
};
