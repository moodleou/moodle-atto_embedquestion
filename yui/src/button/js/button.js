// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package   atto_embedquestion
 * @copyright 2018 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_embedquestion-button
 */

/**
 * Atto text editor embedquestion plugin.
 *
 * @namespace M.atto_embedquestion
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

Y.namespace('M.atto_embedquestion').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * Add the button to the toolbar if appropriate.
     */
    initializer: function() {
        var dialogue;

        if (!this.get('enablebutton')) {
            return;
        }

        this.addButton({
            icon: 'icon',
            iconComponent: 'atto_embedquestion',
            callback: this.displayDialogue
        });

        // Highlight logic for this button.
        this.get('host').on('atto:selectionchanged', function() {
            if (this.getEmbedCodeAtSelection()) {
                this.highlightButtons();
            } else {
                this.unHighlightButtons();
            }
        }, this);

        // Set the dialogue to blank its contents whenever hidden.
        // (Otherwise multiple copies of the form hidden in the HTML,
        // but with the same ids, breaks things.)
        dialogue = this.getDialogue({
            headerContent: M.util.get_string('pluginname', 'atto_embedquestion'),
            width: '600px',
            focusAfterHide: true
        }, true);
        dialogue.on('visibleChange', function(e) {
            if (!e.newVal) {
                // Been hidden, so blank dialogue contents.
                dialogue.set('bodyContent', '');
            }
        });
    },

    /**
     * Display the question selector dialogue.
     */
    displayDialogue: function() {
        var button = this;
        require(['atto_embedquestion/dialogue_manager'], function(dialogueManager) {
            dialogueManager.showDialogueFor(button);
        });
    },

    /**
     * If there is selected text and it is part of an embed code,
     * extract it.
     *
     * @return {Object|Boolean} False if no match, or and object with three
     *         three fields start, end and embedcode.
     */
    getEmbedCodeAtSelection: function() {

        // Find the equation in the surrounding text.
        var selectedNode = this.get('host').getSelectionParentNode(),
            selection = this.get('host').getSelection(),
            text,
            returnValue = false,
            pattern = /\{Q\{(?:(?!\}Q\}).)*\}Q\}/g,
            patternMatches;

        // Note this is a document fragment and YUI doesn't like them.
        if (!selectedNode) {
            return false;
        }

        // We don't yet have a cursor selection somehow so we can't possible be resolving an equation that has selection.
        if (!selection || selection.length === 0) {
            return false;
        }

        selection = selection[0];
        text = selectedNode.textContent;
        patternMatches = text.match(pattern);

        if (!patternMatches || !patternMatches.length) {
            return false;
        }

        // This pattern matches at least once. See if this pattern matches our current position.
        // Note: We return here to break the Y.Array.find loop - any truthy return will stop any subsequent
        // searches which is the required behaviour of this function.
        Y.Array.find(patternMatches, function(match) {
            // Check each occurrence of this match.
            var startIndex = 0;
            while (text.indexOf(match, startIndex) !== -1) {
                // Determine whether the cursor is in the current occurrence of this string.
                // Note: We do not support a selection exceeding the bounds of an equation.
                var start = text.indexOf(match, startIndex),
                    end = start + match.length,
                    startMatches = (selection.startOffset >= start && selection.startOffset < end),
                    endMatches = (selection.endOffset <= end && selection.endOffset > start);

                if (startMatches && endMatches) {
                    // Save all data for later.
                    returnValue = {
                        // Outer match data.
                        start: start,
                        end: end,
                        embedCode: match
                    };

                    // This breaks out of both Y.Array.find functions.
                    return true;
                }

                // Update the startIndex to match the end of the current match so that we can continue hunting
                // for further matches.
                startIndex = end;
            }

            return false;
        }, this);

        return returnValue;
    }

}, {
    ATTRS: {
        enablebutton: {value: false},
        contextid: {value: false},
        elementid: {value: false}
    }
});
