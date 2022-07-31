"use strict";

DAWCoreUtils.$getFileContent = ( file, format ) => {
	return new Promise( res => {
		const rd = new FileReader();

		rd.onload = e => res( e.target.result );
		switch ( format ) {
			case "text": rd.readAsText( file ); break;
			case "array": rd.readAsArrayBuffer( file ); break;
		}
	} );
};
