"use strict";

class DAWCoreControllerMixer {
	$data = Object.freeze( { channels: {}, effects: {} } );
	#on = null;
	#chansCrud = GSUcreateUpdateDelete.bind( null, this.$data.channels,
		this.#addChannel.bind( this ),
		this.#updateChannel.bind( this ),
		this.#deleteChannel.bind( this ) );
	#effectsCrud = GSUcreateUpdateDelete.bind( null, this.$data.effects,
		this.#addEffect.bind( this ),
		this.#updateEffect.bind( this ),
		this.#deleteEffect.bind( this ) );

	constructor( fns ) {
		this.#on = { ...fns };
		Object.freeze( this );
	}

	// .........................................................................
	$clear() {
		Object.keys( this.$data.effects ).forEach( id => this.#deleteEffect( id ) );
		Object.keys( this.$data.channels ).forEach( id => {
			if ( id !== "main" ) {
				this.#deleteChannel( id );
			}
		} );
	}
	$recall() {
		const ent = Object.entries( this.$data.channels );

		ent.forEach( kv => this.#deleteChannel( kv[ 0 ] ) );
		ent.forEach( kv => this.#addChannel( kv[ 0 ], kv[ 1 ] ) );
	}
	$change( obj ) {
		this.#chansCrud( obj.channels );
		this.#effectsCrud( obj.effects );
	}

	// .........................................................................
	#addChannel( id, obj ) {
		const obj2 = Object.seal( { ...obj } );

		this.$data.channels[ id ] = obj2;
		this.#on.$addChannel?.( id, obj2 );
		this.#updateChannel( id, obj2 );
	}
	#deleteChannel( id ) {
		delete this.$data.channels[ id ];
		this.#on.$removeChannel?.( id );
	}
	#updateChannel( id, obj ) {
		const chan = this.$data.channels[ id ];
		const prevCpy = { ...chan };

		Object.assign( chan, obj );
		if ( this.#on.$changeChannelProp ) {
			GSUforEach( obj, ( val, p ) => this.#on.$changeChannelProp( id, p, val, prevCpy[ p ] ) );
		}
		this.#on.$changeChannel?.( id, chan );
	}

	// .........................................................................
	#addEffect( id, obj ) {
		this.$data.effects[ id ] = {};
		this.#on.$addEffect?.( obj.dest, id, obj );
		this.#updateEffect( id, obj );
	}
	#deleteEffect( id ) {
		const dest = this.$data.effects[ id ].dest;

		delete this.$data.effects[ id ];
		if ( dest in this.$data.channels ) {
			this.#on.$removeEffect?.( dest, id );
		}
	}
	#updateEffect( id, obj ) {
		GSUdeepAssign( this.$data.effects[ id ], obj );
		this.#on.$updateEffect?.( this.$data.effects[ id ].dest, id, obj );
	}
}

Object.freeze( DAWCoreControllerMixer );
