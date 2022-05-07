"use strict";

class DAWCoreCompositionExportJSON {
	static #URLToRevoke = null;
	static #tabs = Object.freeze( {
		keys: 4,
		drums: 4,
		synths: 5,
		tracks: 3,
		blocks: 3,
		buffers: 3,
		channels: 3,
		patterns: 3,
		drumrows: 3,
	} );

	static export( cmp ) {
		if ( cmp ) {
			const cpy = DAWCore.utils.jsonCopy( cmp );
			const cpyFormated = DAWCoreCompositionFormat.out( DAWCoreCompositionFormat.in( cpy ) );

			return {
				name: `${ cmp.name || "untitled" }.gs`,
				url: DAWCoreCompositionExportJSON.#export( cpyFormated ),
			};
		}
	}

	// .........................................................................
	static #export( cmp ) {
		const delTabs = DAWCoreCompositionExportJSON.#tabs;
		const reg = /^\t"(\w*)": \{$/u;
		const lines = JSON.stringify( cmp, null, "\t" ).split( "\n" );
		let regTab;
		let regTa2;
		let delTabCurr;

		if ( DAWCoreCompositionExportJSON.#URLToRevoke ) {
			URL.revokeObjectURL( DAWCoreCompositionExportJSON.#URLToRevoke );
		}
		lines.forEach( ( line, i ) => {
			const res = reg.exec( line );

			if ( res ) {
				if ( delTabCurr = delTabs[ res[ 1 ] ] ) {
					regTab = new RegExp( `^\\t{${ delTabCurr }}`, "u" );
					regTa2 = new RegExp( `^\\t{${ delTabCurr - 1 }}\\}`, "u" );
				}
			}
			if ( delTabCurr ) {
				lines[ i ] = lines[ i ].replace( regTab, "~" ).replace( regTa2, "~}" );
			}
		} );
		return DAWCoreCompositionExportJSON.#URLToRevoke = URL.createObjectURL( new Blob( [
			lines.join( "\n" ).replace( /\n~/ug, " " ) ] ) );
	}
}
