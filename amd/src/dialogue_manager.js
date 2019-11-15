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

/**
 * Manages the question selection form.
 *
 * @module    atto_embedquestion/dialogue_manager
 * @package   atto_embedquestion
 * @copyright 2018 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define([
    'jquery',
    'core/notification',
    'core/fragment',
    'core/templates',
    'core/ajax'
], function(
    $,
    Notification,
    Fragment,
    Templates,
    Ajax
) {
    'use strict';

    /**
     * Constructor for an object that handles one occurrence of showing the dialogue.
     *
     * @param {EditorPlugin} button - the editor toolbar button that has just been clicked.
     */
    function DialogueHandler(button) {
        var currentSelection, dialogue, existingCode;

        currentSelection = button.get('host').getSelection();

        // The wrapper div's loading icon will be replaced with form contents.
        dialogue = button.getDialogue({
            headerContent: M.util.get_string('pluginname', 'atto_embedquestion'),
            focusAfterHide: true
        }, true);
        dialogue.set('bodyContent', '<div class="atto_embedquestion-wrap">' +
                '<img class="icon" src="' + M.util.image_url('y/loading') + '" alt="' +
                M.util.get_string('loading', 'atto_embedquestion') + '">' +
                '</div>');
        dialogue.show();

        existingCode = button.getEmbedCodeAtSelection();
        if (existingCode) {
            existingCode = existingCode.embedCode;
        }

        // Replace with the form.
        Fragment.loadFragment('atto_embedquestion', 'questionselector', button.get('contextid'),
                {contextId: button.get('contextid'), embedCode: existingCode}
                ).done(function(html, js) {
                    niceReplaceNodeContents($('.atto_embedquestion-wrap'), html, js, dialogue);
                }
                ).fail(Notification.exception);

        /**
         * This function fades out one lot of content and fades in some new content.
         *
         * @param {JQuery} node - Element or selector to replace.
         * @param {String} html - HTML to insert / replace.
         * @param {String} js - Javascript to run after the insertion.
         * @returns {Promise} - a promise that resolves when the animation is complete.
         */
        function niceReplaceNodeContents(node, html, js) {
            var promise = $.Deferred();
            node.fadeOut("fast", function() {
                Templates.replaceNodeContents(node, html, js);
                node.fadeIn("fast", function() {
                    promise.resolve();
                    $('#embedqform #id_submitbutton').on('click', getEmbedCode);
                    setupCentreing();
                });
            });
            return promise.promise();
        }

        /**
         * Called after the form in the dialogue has finished loading.
         *
         * Centre the dialogue now, and ensure it re-centres whenever a
         * form section is expanded or collapsed.
         */
        function setupCentreing() {
            dialogue.centerDialogue();
            var observer = new MutationObserver(dialogueResized);
            $('#embedqform fieldset.collapsible').each(function(index, node) {
                observer.observe(node, { attributes: true, attributeFilter: ['class'] });
            });
        }

        /**
         * Re-centre the dialogue.
         */
        function dialogueResized() {
            dialogue.centerDialogue();
        }

        /**
         * Handler for when the form button is clicked.
         *
         * Make an AJAX request ot the server to get the embed code.
         *
         * @param {Event} e - the click event.
         */
        function getEmbedCode(e) {
            e.preventDefault();
            Ajax.call([{
                methodname: 'filter_embedquestion_get_embed_code',
                args: {
                    courseid: $('input[name=courseid]').val(),
                    categoryidnumber: $('select#id_categoryidnumber').val(),
                    questionidnumber: $('select#id_questionidnumber').val(),
                    behaviour: $('select#id_behaviour').val(),
                    maxmark: $('input#id_maxmark').val(),
                    variant: $('input#id_variant').val(),
                    correctness: $('select#id_correctness').val(),
                    marks: $('select#id_marks').val(),
                    markdp: $('select#id_markdp').val(),
                    feedback: $('select#id_feedback').val(),
                    generalfeedback: $('select#id_generalfeedback').val(),
                    rightanswer: $('select#id_rightanswer').val(),
                    history: $('select#id_history').val()
                }
            }])[0].done(insertEmbedCode);
        }

        /**
         * Handles when we get the embed code from the AJAX request.
         *
         * @param {String} embedCode - the embed code to insert.
         */
        function insertEmbedCode(embedCode) {
            var dialogue, host, parent, text, existingCode;

            // Hide the dialogue and blank the contents.
            dialogue = button.getDialogue({
                focusAfterHide: null
            });
            dialogue.hide();

            host = button.get('host');

            // Focus on the last point.
            host.setSelection(currentSelection);

            existingCode = button.getEmbedCodeAtSelection();
            if (existingCode) {
                // Replace the existing code.
                parent = host.getSelectionParentNode();
                text = parent.textContent;
                parent.textContent = text.slice(0, existingCode.start) +
                        embedCode + text.slice(existingCode.end);
            } else {
                // Otherwise insert the embed code.
                host.insertContentAtFocusPoint(embedCode);
            }

            // Mark the text area as updated.
            button.markUpdated();
        }
    }

    return {
        /**
         * Show the dialogue when the button in a particular editor was clicked,
         * then handle the interaction with it.
         *
         * @param {EditorPlugin} button - the editor toolbar button that has just been clicked.
         */
        showDialogueFor: function(button) {
            new DialogueHandler(button);
        }
    };
});
