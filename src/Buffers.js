"use strict";

DAWCore.Buffers = class {
	constructor( daw ) {
		this.daw = daw;
		this._files = new Map();
	}

	empty() {
		this._files.clear();
	}
	getBufferKey( buf ) {
		return `${ buf.type }:${ buf.length }:${ buf.duration }:${ buf.name }`;
	}
	getBuffer( buf ) {
		return this._files.get( this.getBufferKey( buf ) );
	}
	setBuffer( buf ) {
		this._files.set( this.getBufferKey( buf ), Object.assign( {}, buf ) );
	}
	loadFiles( files ) {
		return new Promise( res => {
			const newBuffers = [],
				knownBuffers = [],
				failedBuffers = [];
			let nbDone = 0;

			Array.from( files ).forEach( file => {
				this._getBufferFromFile( file )
					.then( buffer => {
						const buf = {
								buffer,
								type: file.type,
								name: file.name,
								length: buffer.length,
								duration: buffer.duration.toFixed( 4 ),
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

	// private:
	_getBufferFromFile( file ) {
		return new Promise( ( res, rej ) => {
			const reader = new FileReader();

			reader.onload = e => {
				this.daw.ctx.decodeAudioData( e.target.result ).then( res, rej );
			};
			reader.readAsArrayBuffer( file );
		} );
	}
};
