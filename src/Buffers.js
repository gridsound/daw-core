"use strict";

DAWCore.Buffers = class {
	#daw = null
	#files = new Map()

	constructor( daw ) {
		this.#daw = daw;
		Object.seal( this );
	}

	empty() {
		this.#files.clear();
	}
	getBuffer( buf ) {
		return this.#files.get( buf.hash || buf.url );
	}
	getSize() {
		return this.#files.size;
	}
	setBuffer( obj ) {
		const buf = { ...obj },
			url = buf.url,
			key = buf.hash || url;

		this.#files.set( key, buf );
		return !url
			? Promise.resolve( buf )
			: fetch( `../assets/samples/${ url }` )
				.then( res => res.arrayBuffer() )
				.then( arr => this.#daw.ctx.decodeAudioData( arr ) )
				.then( buffer => {
					buf.buffer = buffer;
					buf.duration = +buffer.duration.toFixed( 4 );
					return buf;
				} );
	}
	loadFiles( files ) {
		return new Promise( res => {
			const newBuffers = [],
				knownBuffers = [],
				failedBuffers = [];
			let nbDone = 0;

			Array.from( files ).forEach( file => {
				this.#getBufferFromFile( file )
					.then( ( [ hash, buffer ] ) => {
						const buf = {
								hash,
								buffer,
								type: file.type,
								name: file.name,
								duration: +buffer.duration.toFixed( 4 ),
							},
							old = this.getBuffer( buf );

						if ( !old ) {
							newBuffers.push( buf );
						} else if ( !old.buffer ) {
							knownBuffers.push( buf );
						}
					}, () => {
						failedBuffers.push( {
							type: file.type,
							name: file.name,
						} );
					} )
					.finally( () => {
						if ( ++nbDone === files.length ) {
							newBuffers.forEach( this.setBuffer, this );
							knownBuffers.forEach( this.setBuffer, this );
							res( { newBuffers, knownBuffers, failedBuffers } );
						}
					} );
			} );
		} );
	}

	// .........................................................................
	#getBufferFromFile( file ) {
		return new Promise( ( res, rej ) => {
			const reader = new FileReader();

			reader.onload = e => {
				const buf = e.target.result,
					hash = this.#hashBufferV1( new Uint8Array( buf ) ); // 1.

				this.#daw.ctx.decodeAudioData( buf ).then( audiobuf => {
					res( [ hash, audiobuf ] );
				}, rej );
			};
			reader.readAsArrayBuffer( file );
		} );
	}
	#hashBufferV1( u8buf ) {
		const hash = new Uint8Array( 19 ),
			len = `${ u8buf.length }`.padStart( 9, "0" );
		let i = 0,
			ind = 0;

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
};

Object.freeze( DAWCore.Buffers );

/*
1. the hash is calculed before the data decoded
   to bypass the "neutered ArrayBuffer" error.
*/
