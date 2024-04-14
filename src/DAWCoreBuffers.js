"use strict";

class DAWCoreBuffers {
	static #audioMIMEs = [ "audio/wav", "audio/wave", "audio/flac", "audio/webm", "audio/ogg", "audio/mpeg", "audio/mp3", "audio/mp4" ];

	static $change( daw, store, obj ) {
		if ( "buffers" in obj ) {
			Object.entries( obj.buffers ).forEach( ( [ id, buf ] ) => {
				if ( !buf ) {
					store.$buffersCustom.delete( id );
				} else if ( store.$buffersCustom.has( id ) ) {
					if ( "reverse" in buf ) {
						DAWCoreBuffers.#rewriteBuffer( daw, store, id );
						daw.$slicesBuffersBuffersLoaded( { [ id ]: store.$buffersCustom.get( id ) } );
					}
				} else {
					( buf.url
						? DAWCoreBuffers.$loadURLBuffer( daw, store, buf.url )
						: Promise.resolve()
					).then( () => {
						DAWCoreBuffers.#rewriteBuffer( daw, store, id );
					} );
				}
			} );
		}
	}

	// .........................................................................
	static $getAudioBufferSource( daw, store, hash ) {
		return store.$buffers.has( hash )
			? Promise.resolve( store.$buffers.get( hash ) )
			: DAWCoreBuffers.$loadURLBuffer( daw, store, hash );
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
	static #rewriteBuffer( daw, store, id ) {
		const objBuf = daw.$getBuffer( id );
		const srcBuf = store.$buffers.get( objBuf.url || objBuf.hash );

		if ( srcBuf ) {
			const buf = GSUcloneBuffer( daw.$getCtx(), srcBuf );

			if ( objBuf.reverse ) {
				GSUreverseBuffer( buf );
			}
			store.$buffersCustom.set( id, buf );
			daw.$callCallback( "buffersLoaded", id, buf );
		}
	}

	// .........................................................................
	static $dropBuffers( daw, store, promFiles ) {
		return promFiles
			.then( files => DAWCoreBuffers.#dropBuffersHashmap( files ) )
			.then( hashs => DAWCoreBuffers.#dropBuffersFilterNew( store, hashs ) )
			.then( hashs => DAWCoreBuffers.#dropBuffersDecode( daw.$getCtx(), hashs ) )
			.then( buffs => DAWCoreBuffers.#dropBuffersSave( daw, store, buffs ) );
	}
	static #dropBuffersHashmap( files ) {
		let currFold;

		return Promise.all( files
			.filter( file => DAWCoreBuffers.#audioMIMEs.includes( file.type ) )
			.reduce( ( arr, file ) => {
				const path = file.filepath.split( "/" );
				const fold = ( path.pop(), path.pop() ) || "";
				const prom = GSUgetFileContent( file, "array" )
					.then( arr => [ GSUhashBufferV1( new Uint8Array( arr ) ), arr, file.name ] ); // 1.

				if ( fold !== currFold ) {
					currFold = fold;
					arr.push( fold );
				}
				arr.push( prom );
				return arr;
			}, [] ) );
	}
	static #dropBuffersFilterNew( store, hashs ) {
		return hashs
			.filter( h => !Array.isArray( h ) || !store.$buffers.has( h[ 0 ] ) )
			.filter( ( h, i, arr ) => Array.isArray( h ) || Array.isArray( arr[ i + 1 ] ) );
	}
	static #dropBuffersDecode( ctx, hashs ) {
		return Promise.all( hashs.map( h => !Array.isArray( h )
			? h
			: ctx.decodeAudioData( h[ 1 ] ).then( buf => [ h[ 0 ], buf, h[ 2 ] ] ) ) );
	}
	static #dropBuffersSave( daw, store, arr ) {
		const bufSlices = {};
		const idSlices = daw.$getOpened( "slices" );

		arr.forEach( smp => {
			if ( Array.isArray( smp ) ) {
				const bufs = Object.entries( daw.$getBuffers() );
				const fnd = bufs.filter( b => b[ 1 ].hash === smp[ 0 ] );

				store.$buffers.set( smp[ 0 ], smp[ 1 ] );
				fnd.forEach( ( [ id, buf ] ) => {

					DAWCoreBuffers.#rewriteBuffer( daw, store, id );
					bufSlices[ id ] = store.$buffersCustom.get( id );
				} );
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
