"use strict";

function DAWCoreActions_openChannel( daw, id ) {
	if ( id !== daw.$getOpened( "channel" ) ) {
		return { channelOpened: id };
	}
}
