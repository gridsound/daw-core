"use strict";

DAWCore.actions.addChannel = get => {
	const channels = get.channels();
	const id = DAWCore.actionsCommon.getNextIdOf( channels );
	const order = DAWCore.actionsCommon.getNextOrderOf( channels );
	const name = `chan ${ id }`;
	const chanObj = DAWCore.json.channel( { order, name } );

	return [
		{ channels: { [ id ]: chanObj } },
		[ "channels", "addChannel", name ],
	];
};
