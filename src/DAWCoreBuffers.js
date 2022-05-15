"use strict";

class DAWCoreBuffers {
	static change( daw, buffers, obj, prevObj ) {
		if ( "buffers" in obj ) {
			Object.entries( obj.buffers ).forEach( ( [ id, buf ] ) => {
				if ( !buf ) {
					DAWCoreBuffers.#removeBuffer( buffers, prevObj.buffers[ id ] );
				} else if ( !DAWCoreBuffers.getBuffer( buffers, buf ) ) {
					const pr = DAWCoreBuffers.setBuffer( daw, buffers, buf );

					if ( buf.url ) {
						pr.then( buf => daw.callCallback( "buffersLoaded", { [ id ]: buf } ) );
					}
				}
			} );
		}
	}
	static getBuffer( buffers, buf ) {
		return buffers.get( buf.hash || buf.url );
	}
	static setBuffer( daw, buffers, objBuf ) {
		const buf = { ...objBuf };
		const url = buf.url;
		const key = buf.hash || url;

		buffers.set( key, buf );
		return !url
			? Promise.resolve( buf )
			: fetch( `/assets/samples/${ url }` )
				.then( res => res.arrayBuffer() )
				.then( arr => daw.ctx.decodeAudioData( arr ) )
				.then( buffer => {
					buf.buffer = buffer;
					buf.duration = +buffer.duration.toFixed( 4 );
					return buf;
				} );
	}
	static loadFiles( daw, buffers, files ) {
		return new Promise( res => {
			const newBuffers = [];
			const knownBuffers = [];
			const failedBuffers = [];
			let nbDone = 0;

			Array.from( files ).forEach( file => {
				DAWCoreBuffers.#getBufferFromFile( daw.ctx, file )
					.then( ( [ hash, buffer ] ) => {
						const buf = {
							hash,
							buffer,
							MIME: file.type,
							name: file.name,
							duration: +buffer.duration.toFixed( 4 ),
						};
						const old = DAWCoreBuffers.getBuffer( buffers, buf );

						if ( !old ) {
							newBuffers.push( buf );
						} else if ( !old.buffer ) {
							knownBuffers.push( buf );
						}
					}, () => {
						failedBuffers.push( {
							MIME: file.type,
							name: file.name,
						} );
					} )
					.finally( () => {
						if ( ++nbDone === files.length ) {
							newBuffers.forEach( DAWCoreBuffers.setBuffer.bind( null, daw, buffers ) );
							knownBuffers.forEach( DAWCoreBuffers.setBuffer.bind( null, daw, buffers ) );
							res( { newBuffers, knownBuffers, failedBuffers } );
						}
					} );
			} );
		} );
	}

	// ..........................................................................
	static #removeBuffer( buffers, buf ) {
		buffers.delete( buf.hash || buf.url );
	}
	static #getBufferFromFile( ctx, file ) {
		return new Promise( ( res, rej ) => {
			const reader = new FileReader();

			reader.onload = e => {
				const buf = e.target.result;
				const hash = DAWCoreBuffers.#hashBufferV1( new Uint8Array( buf ) ); // 1.

				ctx.decodeAudioData( buf ).then( audiobuf => {
					res( [ hash, audiobuf ] );
				}, rej );
			};
			reader.readAsArrayBuffer( file );
		} );
	}
	static #hashBufferV1( u8buf ) {
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
	}
}

/*
1. the hash is calculed before the data decoded
   to bypass the "neutered ArrayBuffer" error.
*/
