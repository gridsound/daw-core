"use strict";

DAWCore.utils.uniqueName = ( nameOri, arr ) => {
	const name = DAWCore.utils.trim2( nameOri );

	if ( arr.indexOf( name ) > -1 ) {
		const name2 = /-\d+$/.test( name )
				? name.substr( 0, name.lastIndexOf( "-" ) ).trim()
				: name,
			reg = new RegExp( `^${ name2 }-(\\d+)$` ),
			nb = arr.reduce( ( nb, str ) => {
				const res = reg.exec( str );

				return res ? Math.max( nb, +res[ 1 ] ) : nb;
			}, 1 );

		return `${ name2 }-${ nb + 1 }`;
	}
	return name;
};
