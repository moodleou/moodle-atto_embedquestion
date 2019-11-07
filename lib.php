<?php
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
 * Atto text editor integration file.
 *
 * @package   atto_embedquestion
 * @copyright 2018 The Open University
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once($CFG->libdir . '/questionlib.php');
use filter_embedquestion\form\embed_options_form;

/**
 * Initialise the js strings required for this module.
 */
function atto_embedquestion_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js(['pluginname', 'embedqcode', 'loading'], 'atto_embedquestion');
}

/**
 * Set params for this plugin.
 *
 * @param string $elementid
 * @param stdClass $options - the options for the editor, including the context.
 * @param stdClass $fpoptions - unused.
 * @return array of params to pass to the JavaScript.
 */
function atto_embedquestion_params_for_js($elementid, $options, $fpoptions) {
    $context = $options['context'];
    if (!$context) {
        return array('enablebutton' => false, 'contextid' => null, 'elementid' => null);
    }

    // Get the course context, this is the only context we use.
    $context = context_course::instance(
            \filter_embedquestion\utils::get_relevant_courseid($context));
    $enablebutton = has_any_capability(
            ['moodle/question:useall', 'moodle/question:usemine'], $context);

    return array('enablebutton' => $enablebutton, 'contextid' => $context->id, 'elementid' => $elementid);
}

/**
 * Server side controller used by core Fragment javascript to return a moodle form html.
 * This is used for the question selection form displayed in the embedquestion atto dialogue.
 * Reference https://docs.moodle.org/dev/Fragment.
 * Based on similar function in mod/assign/lib.php.
 *
 * @param array $args Must contain contextid
 * @return null|string
 */
function atto_embedquestion_output_fragment_questionselector($args) {
    global $CFG;
    require_once($CFG->dirroot . '/filter/embedquestion/filter.php');
    $context = context::instance_by_id($args['contextId']);
    $mform = new embed_options_form(null, ['context' => $context]);

    $currentvalue = $args['embedCode'];
    if ($currentvalue && preg_match(filter_embedquestion::get_filter_regexp(), $currentvalue, $matches)) {

        list($embedid, $toform) =
                filter_embedquestion::parse_embed_code($matches[1]);
        if ($embedid !== null) {
            $toform['questionidnumber'] = $embedid->questionidnumber;
            $toform['categoryidnumber'] = $embedid->categoryidnumber;
            $mform->set_data($toform);
        }
    }

    return $mform->render();
}
