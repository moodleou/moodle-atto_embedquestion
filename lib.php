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
 * @package    atto_embedquestion
 * @copyright  2018 The Open University
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Initialise the js strings required for this module.
 */
function atto_embedquestion_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js(array('pluginname'), 'atto_embedquestion');//This is used as the question selector dialogue title - at present.
}

/**
 * Set params for this plugin.
 *
 * @param string $elementid
 * @param stdClass $options - the options for the editor, including the context.
 * @param stdClass $fpoptions - unused.
 */
function atto_embedquestion_params_for_js($elementid, $options, $fpoptions) {
    $context = $options['context'];
    if (!$context) {
        $context = context_system::instance();
    }
    $enablebutton = has_capability('moodle/question:useall', $context);//TODO (all/mine) not add?
    //TODO if courseid is required it will need to be calculated here and passed through.

    return array('elementid' => $elementid, 'enablebutton' => $enablebutton, 'contextid' => $context->id);
}

/**
 * Server side controller used by core Fragment javascript to return a moodle form html.
 * This is used for the question selection form displayed in the embedquestion atto dialogue.
 * Reference https://docs.moodle.org/dev/Fragment.
 * Based on similar function in mod/assign/lib.php.
 *
 * @param $args
 * @return null|string
 */
function atto_embedquestion_output_fragment_questionselector($args) {
    global $CFG;
    require_once($CFG->dirroot . '/lib/editor/atto/plugins/embedquestion/classes/local/qform.php');
    $html = '';
    $data = [];
    $courseid = isset($args['courseid']) ? clean_param($args['courseid'], PARAM_INT) : null;
    $data['courseid'] = 18;
    $hasformdata = isset($args['formdata']) && !empty($args['formdata']);
    //$context = context_course::instance($courseid);
    $context = context_module::instance(140);
    $data['contextid'] = $context->id;

    if ($hasformdata) {
        parse_str(clean_param($args['formdata'], PARAM_TEXT), $data);
    }

    $mform = new qform(null, null, 'post', '', null, true, $data);

    // If the user is on course context and is allowed to add course events set the event type default to course.
    //if ($courseid != SITEID && !empty($allowed->courses)) {
    //    $data['eventtype'] = 'course';
    //    $data['courseid'] = $courseid;
    //    $data['groupcourseid'] = $courseid;
    //} else if (!empty($categoryid) && !empty($allowed->category)) {
    //    $data['eventtype'] = 'category';
    //    $data['categoryid'] = $categoryid;
    //}
    $mform->set_data($data);

    if ($hasformdata) {
        $mform->is_validated();
    }

    $html .= $mform->render();
    return $html;
}
