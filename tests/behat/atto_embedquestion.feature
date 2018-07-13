@ou @ou_vle @editor @editor_atto @atto @atto_embedquestion
Feature: Add an activity and embed a question inside that activity using atto editor
  In order to encourage students interacting with ativity and learning from it
  As a teacher
  I need to insert appropriate interactive questuins (iCMas) inside any activity modules

  Background:
    # Set up toolbar to add this button
    Given the following config values are set as admin:
      | toolbar | files = image, media, managefiles, embedquestion | editor_atto |
    And the following "users" exist:
      | username | firstname | lastname | email                |
      | teacher  | Terry1    | Teacher1 | teacher1@example.com |
      | student  | Sam1      | Student1 | student1@example.com |
    And the following "courses" exist:
      | fullname | shortname | category |
      | Course 1 | C1        | 0        |
    And the following "course enrolments" exist:
      | user    | course | role           |
      | teacher | C1     | editingteacher |
      | student | C1     | student        |
    And the following "question categories" exist:
      | contextlevel | reference | name                      |
      | Course       | C1        | Test questions [ID:embed] |
    And the following "questions" exist:
      | questioncategory          | qtype     | name                      |
      | Test questions [ID:embed] | truefalse | First question [ID:test1] |
    And the "embedquestion" filter is "on"
    And I log in as "teacher"

  @javascript
  Scenario: Test using 'Embed question' button
    When I am on "Course 1" course homepage
    And I turn editing mode on
    And I follow "Add an activity or resource"
    And I click on "Page" "radio"
    And I press "Add"
    And I set the field "Name" to "Test page 01"
    And I set the field "Description" to "Test page description"
    And I set the field "content" to "Test page content"
    And I click on "Embed question" "button"
    Then I should see "Question category"
    And I set the field "Question category" to "Test questions [ID:embed] (1)"
    And I set the field "id_questionidnumber" to "First question [ID:test1]"
    And "Embed question" "button" should exist in the "Embed question" "dialogue"
    And I click on "Embed question" "button" in the "Embed question" "dialogue"
    And I should see "{Q{embed/test1|"
    And I should see "}Q}Test page description"
