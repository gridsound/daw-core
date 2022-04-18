"use strict";

DAWCore.utils.uuid = () => {
	const rnd = crypto.getRandomValues( new Uint8Array( 36 ) );
	const uuid = rnd.reduce( ( arr, n ) => {
		arr.push( ( n % 16 ).toString( 16 ) );
		return arr;
	}, [] );

	uuid[ 14 ] = "4";
	uuid[ 19 ] = ( 8 + rnd[ 19 ] % 4 ).toString( 16 );
	uuid[ 8 ] =
	uuid[ 13 ] =
	uuid[ 18 ] =
	uuid[ 23 ] = "-";
	return uuid.join( "" );
};
