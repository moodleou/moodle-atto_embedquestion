YUI.add('moodle-atto_embedquestion-button', function (Y, NAME) {

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
 * @package    atto_embedquestion
 * @copyright  2018 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_embedquestion-button
 */

var COMPONENTNAME = 'atto_embedquestion',
    CSS = {
        PARAM: 'atto_embedquestion_param'
    },
    SELECTORS = {
        BUTTON: 'input[name="embedquestion"]'
    }

/**
 * Atto text editor embedquestion plugin.
 *
 * @namespace M.atto_embedquestion
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

Y.namespace('M.atto_embedquestion').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    qForm: null,
    listening: false,

    initializer: function() {
        var contextId, courseId;
        if (!this.get('enablebutton')) {
            return;
        }
        contextId = this.get('contextid');
        courseId = this.get('courseid');
        this.addButton({
            icon: 'icon',
            iconComponent: COMPONENTNAME,
            callback: this._displayDialogue
        });
        // Initialise the amd javascript that will insert the moodle form in the dialogue.
        require(['atto_embedquestion/qform'], function(qform) {
            //qform.setCourseId(18);//TODO this.get('courseid');//not available for now
            qform.setContextId(contextId);
            qform.setCourseId(courseId);
            qForm = qform;
        });
    },

    /**
     * Display the question selector dialogue.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        var loadersrc, dialogue;
        // Store the current selection.
        this._currentSelection = this.get('host').getSelection();

        if (this._currentSelection === false) {
            return;
        }

        loadersrc = this.get('loadersrc');
        dialogue = this.getDialogue({
            headerContent: M.util.get_string('pluginname', COMPONENTNAME),
            focusAfterHide: true,
            bodyContent: '<div class="atto-embedquestion-content"><div class="atto-embedquestion-question-selector-wrapper">' +
                '<img class="icon " src="' + loadersrc + '" alt="Loading..." title="Loading...">' +
                '</div><button class="atto-embedquestion-submit">Embed qcode</button></div>' //  TODO: pass langauge string through
        }, true);
        qForm.setRootNode('.atto-embedquestion-question-selector-wrapper');//does not work with this.qForm!
        dialogue.show();
        qForm.insertQform();
        if (!this.listening) {
            this.listening = true;
            var submit = Y.all('.atto-embedquestion-submit');
            submit.on('click', this.insertQcode, this);
            //content.delegate('key', this._insertQcode, '32', SELECTORS.BUTTON, this);
        }
    },

    /**
     * Insert the selected question code into the editor.
     *
     * @method insertQcode
     * @param {EventFacade} e
     * @private
     */
    insertQcode: function(e) {
        //var character = e.target.getData('character');
        var formData = qForm.getQformData();//not working yet
        // use formData to create a qcode.
        var qcode = '{Q{' + formData.catidnum +'/' + formData.queidnum + '|id=3|courseid=' + formData.courseid + '}Q}';//TODO: id and courseid to be done properly.

        // Hide the dialogue.
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var host = this.get('host');

        // Focus on the last point.
        host.setSelection(this._currentSelection);

        // And add the character.
        host.insertContentAtFocusPoint(qcode);

        // And mark the text area as updated.
        this.markUpdated();
    }
}, {
    ATTRS: {
        /**
         * Whether the button should be displayed
         *
         * @attribute enablebutton
         * @type Boolean
         */
        enablebutton: {
            value: false
        },
        contextid: {value: false},
        courseid: {value: false},
        loadersrc: {value: false}
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
