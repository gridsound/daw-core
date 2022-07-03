"use strict";

DAWCoreActions.set( "addChannel", daw => {
	const channels = daw.$getChannels();
	const id = DAWCoreActionsCommon.getNextIdOf( channels );
	const order = DAWCoreActionsCommon.getNextOrderOf( channels );
	const name = `chan ${ id }`;
	const chanObj = DAWCoreJSON.channel( { order, name } );

	return [
		{ channels: { [ id ]: chanObj } },
		[ "channels", "addChannel", name ],
	];
} );
