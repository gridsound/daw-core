"use strict";

DAWCore.prototype.dropAudioFiles = function( files ) {
	this.buffers.loadFiles( files ).then( ( { newBuffers, knownBuffers, failedBuffers } ) => {
		if ( newBuffers.length || knownBuffers.length ) {
			const cmpBuffers = this.get.buffers(),
				bufNextId = +this._getNextIdOf( cmpBuffers ),
				patNextId = +this._getNextIdOf( this.get.patterns() ),
				buffersLoaded = {};

			if ( newBuffers.length ) {
				const obj = {};

				obj.buffers = {};
				obj.patterns = {};
				newBuffers.forEach( ( buf, i ) => {
					const dotind = buf.name.lastIndexOf( "." ),
						patname = dotind > -1 ? buf.name.substr( 0, dotind ) : buf.name;

					obj.buffers[ bufNextId + i ] = {
						type: buf.type,
						name: buf.name,
						length: buf.length,
						duration: buf.duration,
					};
					obj.patterns[ patNextId + i ] = {
						type: "buffer",
						name: patname,
						buffer: `${ bufNextId + i }`,
						duration: Math.ceil( buf.duration * ( this.get.bpm() / 60 ) ),
					};
					buffersLoaded[ bufNextId + i ] = this.buffers.getBuffer( buf );
				} );
				this.compositionChange( obj );
			}
			if ( knownBuffers.length ) {
				const bufmap = Object.entries( cmpBuffers )
						.reduce( ( map, [ idBuf, buf ] ) => {
							map.set( this.buffers.getBufferKey( buf ), idBuf );
							return map;
						}, new Map() );

				knownBuffers.forEach( buf => {
					const idBuf = bufmap.get( this.buffers.getBufferKey( buf ) );

					buffersLoaded[ idBuf ] = this.buffers.getBuffer( buf );
				} );
			}
			this._call( "buffersLoaded", buffersLoaded );
		}
		if ( failedBuffers.length > 0 ) {
			console.log( "failedBuffers", failedBuffers );
			// show a popup
		}
	} );
};
