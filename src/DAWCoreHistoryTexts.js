"use strict";

class DAWCoreHistoryTexts {
	static getFn( part, action ) {
		return DAWCoreHistoryTexts.#texts.get( part )?.[ action ];
	}

	// .........................................................................
	static #texts = new Map( [
		[ "cmp", {
			renameComposition: ( old, neww ) => [ "pen", `rename compo "${ old || "untitled" }" to "${ neww }"` ],
			changeTempo: ( bpm, bPM, sPB ) => [ "clock", `new tempo ${ bpm } (${ bPM }/${ sPB })` ],
			changeLoop: ( a, b ) => [ "loop", `change loop ${ a } -> ${ b }` ],
			removeLoop: () => [ "loop", "remove loop" ],
		} ],
		[ "tracks", {
			renameTrack: ( old, neww ) => [ "pen", `rename track "${ old }" -> "${ neww }"` ],
			toggleTrack: ( tr, b ) => [ b ? "unmute" : "mute", `${ b ? "unmute" : "mute" } track "${ tr }"` ],
			toggleSoloTrack: ( tr, b ) => [ b ? "unmute" : "mute", `${ b ? "unmute all tracks" : `mute all tracks except "${ tr }"` }` ],
		} ],
		[ "blocks", {
			addBlock: pat => [ "plus", `add a new ${ pat } block` ],
			moveBlocks: len => [ "arrows", `move ${ DAWCore.utils.plural( len, "block" ) }` ],
			selectBlocks: len => [ "mouse", `select ${ DAWCore.utils.plural( len, "block" ) }` ],
			removeBlocks: len => [ "erase", `remove ${ DAWCore.utils.plural( len, "block" ) }` ],
			cropEndBlocks: len => [ "crop", `crop-end ${ DAWCore.utils.plural( len, "block" ) }` ],
			cropStartBlocks: len => [ "crop", `crop-start ${ DAWCore.utils.plural( len, "block" ) }` ],
			unselectBlock: () => [ "mouse", `unselect ${ DAWCore.utils.plural( 1, "block" ) }` ],
			unselectAllBlocks: len => [ "mouse", `unselect ${ DAWCore.utils.plural( len, "block" ) }` ],
			duplicateSelectedBlocks: len => [ "plus", `duplicate ${ DAWCore.utils.plural( len, "block" ) }` ],
		} ],
		[ "synth", {
			addOscillator: syn => [ "oscillator", `${ syn }: add osc` ],
			removeOscillator: syn => [ "oscillator", `${ syn }: remove osc` ],
			reorderOscillator: syn => [ "sort", `${ syn }: reorder oscs` ],
			changeOscillator: ( syn, prop, val ) => [ "oscillator", `${ syn }: change osc ${ prop } -> ${ val }` ],
			toggleEnv: ( syn, b ) => [ "osc-sine", `${ syn }: ${ b ? "enable" : "disable" } envelope` ],
			changeEnv: ( syn, prop, val ) => [ "osc-sine", `${ syn }: envelope's ${ prop } = ${ val }` ],
			toggleLFO: ( syn, b ) => [ "osc-sine", `${ syn }: ${ b ? "enable" : "disable" } LFO` ],
			changeLFO: ( syn, prop, val ) => [ "osc-sine", `${ syn }: LFO's ${ prop } = ${ val }` ],
		} ],
		[ "synths", {
			addSynth: syn => [ "oscillator", `add new synth "${ syn }"` ],
			renameSynth: ( old, neww ) => [ "pen", `rename synth "${ old }" -> "${ neww }"` ],
			removeSynth: syn => [ "minus", `remove synth "${ syn }"` ],
			redirectSynth: ( syn, chanDest ) => [ "redirect", `redirect synth "${ syn }" to chan "${ chanDest }"` ],
		} ],
		[ "channels", {
			addChannel: chan => [ "plus", `mixer: new channel "${ chan }"`, ],
			removeChannel: chan => [ "minus", `mixer: remove "${ chan }"`, ],
			reorderChannel: chan => [ "sort", `mixer: reorder "${ chan }"`, ],
			renameChannel: ( old, neww ) => [ "pen", `mixer: rename "${ old }" -> "${ neww }"` ],
			toggleChannel: ( chan, b ) => [ b ? "unmute" : "mute", `mixer: ${ b ? "unmute" : "mute" } "${ chan }"`, ],
			changeChannel: ( chan, prop, val ) => [ "mixer", `mixer: "${ chan }" ${ prop }: ${ val }`, ],
			redirectChannel: ( chan, chanDest ) => [ "redirect", `mixer: redirect "${ chan }" to "${ chanDest }"`, ],
		} ],
		[ "patterns", {
			dropBuffers: nb => [ "file-buffer", `drop ${ DAWCore.utils.plural( nb, "new buffer" ) }` ],
			changePatternBufferInfo: pat => [ "pen", `edit info of the buffer "${ pat }"` ],
			addPattern: ( type, pat ) => [ "plus", `add new ${ type } "${ pat }"` ],
			addPatternKeys: ( pat, syn ) => [ "plus", `add new keys "${ pat }" of synth "${ syn }"` ],
			renamePattern: ( type, old, neww ) => [ "pen", `rename ${ type } "${ old }" -> "${ neww }"` ],
			removePattern: ( type, pat ) => [ "minus", `remove ${ type } "${ pat }"` ],
			reorderPattern: ( type, pat ) => [ "sort", `reorder ${ type } "${ pat }"` ],
			clonePattern: ( type, pat, patSrc ) => [ "clone", `clone ${ type } "${ patSrc }" to "${ pat }"` ],
			redirectPatternBuffer: ( pat, chanDest ) => [ "redirect", `redirect buffer "${ pat }" to chan "${ chanDest }"` ],
			redirectPatternKeys: ( pat, syn ) => [ "redirect", `redirect keys "${ pat }" to synth "${ syn }"` ],
			redirectPatternSlices: ( pat, src ) => [ "redirect", `redirect slices "${ pat }" to buffer "${ src }"` ],
		} ],
		[ "effects", {
			addEffect: ( dest, type ) => [ "effects", `fx: new ${ type } on ${ dest }`, ],
			toggleEffect: ( dest, type, b ) => [ b ? "unmute" : "mute", `fx: ${ b ? "unmute" : "mute" } ${ type } of ${ dest }`, ],
			removeEffect: ( dest, type ) => [ "minus", `fx: remove ${ type } of ${ dest }`, ],
			changeEffect: ( dest, type, prop ) => [ "effects", `fx: change ${ type }'s ${ prop } of ${ dest }` ],
		} ],
		[ "drumrows", {
			addDrumrow: row => [ "drums", `drumrows: new "${ row }"` ],
			removeDrumrow: row => [ "drums", `drumrows: remove "${ row }"` ],
			reorderDrumrow: row => [ "drums", `drumrows: reorder "${ row }"` ],
			changeDrumrow: ( row, prop, val ) => [ "drums", `drumrows: "${ row }" ${ prop }: ${ val }` ],
			changeDrumrowPattern: ( row, newPat ) => [ "drums", `drumrows: "${ row }" -> "${ newPat }"` ],
			toggleDrumrow: ( row, b ) => [ "drums", `drumrows: ${ b ? "unmute" : "mute" } "${ row }"` ],
			toggleSoloDrumrow: ( row, b ) => [ "drums", `drumrows: ${ b ? "unmute all" : `mute all except "${ row }"` }` ],
		} ],
		[ "slices", {
			cropSlices: sli => [ "slices", `crop "${ sli }"` ],
			changeSlices: sli => [ "slices", `change "${ sli }"'s slices` ],
			changeSlicesDuration: ( sli, dur ) => [ "slices", `"${ sli }"'s duration: ${ dur }beat` ],
		} ],
		[ "drums", {
			addDrums: ( pat, row, nb ) => [ "drums", `drums: add ${ nb } "${ row }" in "${ pat }"` ],
			removeDrums: ( pat, row, nb ) => [ "drums", `drums: remove ${ nb } "${ row }" in "${ pat }"` ],
			changeDrumsProps: ( pat, row, prop, nb ) => [ "drums", `drums: set ${ prop } to ${ nb } "${ row }" in "${ pat }"` ],
		} ],
		[ "keys", {
			addKey: pat => [ "keys", `add a new key in "${ pat }"` ],
			moveKeys: ( pat, len ) => [ "arrows", `keys: move ${ DAWCore.utils.plural( len, "key" ) } in "${ pat }"` ],
			removeKeys: ( pat, len ) => [ "erase", `keys: remove ${ DAWCore.utils.plural( len, "key" ) } in "${ pat }"` ],
			selectKeys: ( pat, len ) => [ "mouse", `keys: select ${ DAWCore.utils.plural( len, "key" ) } in "${ pat }"` ],
			cropEndKeys: ( pat, len ) => [ "crop", `keys: crop ${ DAWCore.utils.plural( len, "key" ) } in "${ pat }"` ],
			redirectKey: ( pat, b ) => [ "glissando", `${ b ? "add" : "remove" } a glissando in "${ pat }"` ],
			unselectKey: pat => [ "mouse", `keys: unselect ${ DAWCore.utils.plural( 1, "key" ) } in "${ pat }"` ],
			unselectAllKeys: ( pat, len ) => [ "mouse", `unselect ${ DAWCore.utils.plural( len, "key" ) } in "${ pat }"` ],
			changeKeysProps: ( pat, prop, len ) => [ "keys", `keys: change ${ DAWCore.utils.plural( len, "key", "'s" ) } ${ prop } in "${ pat }"` ],
			cloneSelectedKeys: ( pat, len ) => [ "keys", `clone ${ DAWCore.utils.plural( len, "key" ) } in "${ pat }"` ],
		} ],
	] );
}
