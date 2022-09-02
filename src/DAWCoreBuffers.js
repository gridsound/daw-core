"use strict";

class DAWCoreBuffers {
	static #audioMIMEs = [ "audio/wav", "audio/wave", "audio/flac", "audio/webm", "audio/ogg", "audio/mpeg", "audio/mp3", "audio/mp4" ];

	static $change( daw, store, obj, prevObj ) {
		if ( "buffers" in obj ) {
			Object.entries( obj.buffers ).forEach( ( [ id, buf ] ) => {
				if ( !buf ) {
					const bufprev = prevObj.buffers[ id ];

					store.$objs.delete( bufprev.hash || bufprev.url );
				} else if ( !DAWCoreBuffers.$getBuffer( store, buf ) ) {
					const pr = DAWCoreBuffers.$setBuffer( daw, store, buf );

					if ( buf.url ) {
						pr.then( buf => daw.$callCallback( "buffersLoaded", id, buf ) );
					}
				}
			} );
		}
	}

	// .........................................................................
	static $getBuffer( store, objBuf ) {
		return store.$objs.get( objBuf.hash || objBuf.url );
	}
	static $getAudioBuffer( daw, store, hash ) {
		return store.$buffers.has( hash )
			? Promise.resolve( store.$buffers.get( hash ) )
			: DAWCoreBuffers.$loadURLBuffer( daw, store, hash );
	}
	static $setBuffer( daw, store, objBuf ) {
		const cpy = { ...objBuf };

		store.$objs.set( cpy.hash || cpy.url, cpy );
		return !cpy.url
			? Promise.resolve( cpy )
			: DAWCoreBuffers.$loadURLBuffer( daw, store, cpy.url )
				.then( buf => {
					cpy.buffer = buf;
					cpy.duration = +buf.duration.toFixed( 4 );
					return cpy;
				} );
	}
	static $loadURLBuffer( daw, store, url ) {
		return fetch( `/🥁/${ url }.wav` )
			.then( res => res.arrayBuffer() )
			.then( arr => daw.$getCtx().decodeAudioData( arr ) )
			.then( buf => {
				store.$buffers.set( url, buf );
				return buf;
			} );
	}
	static $playBuffer( daw, store, hash ) {
		const buf = store.$buffers.get( hash );
		const absn = daw.$getCtx().createBufferSource();

		DAWCoreBuffers.$stopBuffer( store );
		store.$absn = absn;
		absn.buffer = buf;
		absn.connect( daw.$getAudioDestination() );
		absn.start();
		return buf;
	}
	static $stopBuffer( store ) {
		store.$absn?.stop();
	}

	// .........................................................................
	static $dropBuffers( daw, store, promFiles ) {
		return promFiles
			.then( files => DAWCoreBuffers.#dropBuffersHashmap( files ) )
			.then( hashs => DAWCoreBuffers.#dropBuffersFilterNew( store.$buffers, hashs ) )
			.then( hashs => DAWCoreBuffers.#dropBuffersDecode( daw.$getCtx(), hashs ) )
			.then( buffs => DAWCoreBuffers.#dropBuffersSave( daw, store.$buffers, buffs ) );
	}
	static #dropBuffersHashmap( files ) {
		let currFold;

		return Promise.all( files
			.filter( file => DAWCoreBuffers.#audioMIMEs.includes( file.type ) )
			.reduce( ( arr, file ) => {
				const path = file.filepath.split( "/" );
				const fold = ( path.pop(), path.pop() ) || "";
				const prom = DAWCoreUtils.$getFileContent( file, "array" )
					.then( arr => [ DAWCoreUtils.$hashBufferV1( new Uint8Array( arr ) ), arr, file.name ] ); // 1.

				if ( fold !== currFold ) {
					currFold = fold;
					arr.push( fold );
				}
				arr.push( prom );
				return arr;
			}, [] ) );
	}
	static #dropBuffersFilterNew( bufferMap, hashs ) {
		return hashs
			.filter( h => !Array.isArray( h ) || !bufferMap.has( h[ 0 ] ) )
			.filter( ( h, i, arr ) => Array.isArray( h ) || Array.isArray( arr[ i + 1 ] ) );
	}
	static #dropBuffersDecode( ctx, hashs ) {
		return Promise.all( hashs.map( h => !Array.isArray( h )
			? h
			: ctx.decodeAudioData( h[ 1 ] ).then( buf => [ h[ 0 ], buf, h[ 2 ] ] ) ) );
	}
	static #dropBuffersSave( daw, bufferMap, arr ) {
		const bufSlices = {};
		const idSlices = daw.$getOpened( "slices" );

		arr.forEach( smp => {
			if ( Array.isArray( smp ) ) {
				const bufs = Object.entries( daw.$getBuffers() );
				const fnd = bufs.find( b => b[ 1 ].hash === smp[ 0 ] );

				bufferMap.set( smp[ 0 ], smp[ 1 ] );
				if ( fnd ) {
					fnd[ 1 ].buffer = smp[ 1 ]; // ?
					bufSlices[ fnd[ 0 ] ] = fnd[ 1 ];
					daw.$callCallback( "buffersLoaded", fnd[ 0 ], fnd[ 1 ] );
				}
			}
		} );
		daw.$slicesBuffersBuffersLoaded( bufSlices );
		return arr;
	}
}

/*
1. the hash is calculed before the data decoded
   to bypass the "neutered ArrayBuffer" error.
*/
