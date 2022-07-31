"use strict";

DAWCoreUtils.$hashBufferV1 = u8buf => {
	const hash = new Uint8Array( 19 );
	const len = `${ u8buf.length }`.padStart( 9, "0" );
	let i = 0;
	let ind = 0;

	for ( const u8 of u8buf ) {
		hash[ ind ] += u8;
		if ( ++ind >= 19 ) {
			ind = 0;
		}
		if ( ++i >= 1000000 ) {
			break;
		}
	}
	return `1-${ len }-${ Array.from( hash )
		.map( u8 => u8.toString( 16 ).padStart( 2, "0" ) )
		.join( "" ) }`;
};
