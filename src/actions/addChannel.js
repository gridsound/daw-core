"use strict";

function DAWCoreActions_addChannel( daw ) {
	const channels = daw.$getChannels();
	const id = DAWCoreActionsCommon_getNextIdOf( channels );
	const order = DAWCoreActionsCommon_getNextOrderOf( channels );
	const name = `chan ${ id }`;
	const chanObj = DAWCoreJSON_channel( { order, name } );

	return [
		{ channels: { [ id ]: chanObj } },
		[ "channels", "addChannel", name ],
	];
}
