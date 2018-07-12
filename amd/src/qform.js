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
 * @package    atto_embedquestion
 * @copyright  2018 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define(['jquery', 'core/notification', 'core/fragment', 'core/templates', 'core/ajax'], function($, Notification, Fragment, Templates, Ajax) {
    'use strict';
    var t, priv;

    /**
     * Private variables and methods.
     */
    priv = {
        rootNode: false,
        contextId: false
    };

    /**
     * Public returned object.
     *
     * @alias atto_embedquestion/qform
     */
    t = {
        setRootNode: function(rootnode) {
            priv.rootNode = $(rootnode);
        },
        setContextId: function(contextid) {
            priv.contextId = contextid;
        },

        /**
         * This uses an ajax function to add the question selection form to the dialogue.
         *
         */
        insertQform: function() {
            var args = {};
            args.contextId = priv.contextId;

            // Replace with the form.
            Fragment.loadFragment('atto_embedquestion', 'questionselector', priv.contextId, args).done(function (html, js) {
                t.niceReplaceNodeContents(priv.rootNode, html, js);
            }).fail(Notification.exception);
        },

        niceReplaceNodeContents: function(node, html, js) {
            var promise = $.Deferred();
            node.fadeOut("fast", function () {
                Templates.replaceNodeContents(node, html, js);
                node.fadeIn("fast", function () {
                    promise.resolve();
                    t.formSubmitListener();
                });
            });
            return promise.promise();
        },

        formSubmitListener : function () {
            var button = $('#embedqform input[id=id_submitbutton][name=submitbutton]');
            button.parent().parent().parent().parent().removeClass('hidden');
            button.on('click', t.getEmbedCode);
        },

        getEmbedCode : function (e) {
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
            }])[0].done(t.passEmbedCode);
        },

        passEmbedCode: function (response) {
            //Create a custom event with the response in it for YUI to consume.
            var event = new CustomEvent('responseForYUI', {detail: {code: response.embedcode}});
            document.dispatchEvent(event);
        }
    };

    return t;
});
