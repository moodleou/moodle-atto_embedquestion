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
        if (!this.get('enablebutton')) {
            return;
        }

        this.addButton({
            icon: 'icon',
            iconComponent: 'atto_embedquestion',
            callback: this.displayDialogue
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
    }

}, {
    ATTRS: {
        enablebutton: {value: false},
        contextid: {value: false},
        elementid: {value: false}
    }
});
