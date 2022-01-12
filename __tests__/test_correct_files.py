import os
import pathlib
import re

root_dir = pathlib.Path(__file__).parent.parent

ADDED_FILES = os.environ.get('ADDED_FILES', '')
NO_NEW_HTML_FILES_MESSAGE = '''
Your PR should contain a new HTML file in the introductions/ folder, but does
not appear to. Your new file should be named YOURNAME.html, where you replace
YOURNAME with your actual name.
'''
NEW_HTML_FILE_CALLED_YOURNAME_MESSAGE = '''
Your new HTML file should not literally be called {newfilename}.html. You should
replace {newfilename} with your actual name.
'''

REMOVED_FILES = os.environ.get('REMOVED_FILES', '')
REMOVED_FILES_MESSAGE = '''
Your PR should not remove any files from the repository. Please restore any
removed files. For example, if I were working from the command line I would do
so like this:

    git remote add upstream https://github.com/musa-611-spring-2022/musa-611-spring-2022-week1.git
    git checkout upstream/main -- NAME FILES THAT WERE REMOVED HERE
'''

MODIFIED_FILES = os.environ.get('MODIFIED_FILES', '')
MODIFIED_START_FILE_MESSAGE = '''
Your PR must not modify the introductions/_start.html file. Please restore the
version of _start.html in your repository. For example, if I were using the
command line, I would add the original assignment repository as a "remote", and
then check out the original _start.html file from there like this:

    git remote add upstream https://github.com/musa-611-spring-2022/musa-611-spring-2022-week1.git
    git checkout upstream/main -- introductions/_start.html
'''


def test_start_file_has_not_been_modified():
    """Test that the _start.html file has not been modified"""

    assert 'introductions/_start.html' not in MODIFIED_FILES, \
           MODIFIED_START_FILE_MESSAGE


def test_new_html_file_has_been_added():
    """Test that a new HTML file has been added"""

    html_file_pattern = re.compile(r'introductions/.*\.html')
    assert html_file_pattern.search(ADDED_FILES) is not None, \
           NO_NEW_HTML_FILES_MESSAGE


def test_new_html_file_not_called_yourname():
    """Test that there's not a new HTML file named YOURNAME.html"""

    yourname_pattern = re.compile(r'introductions/(yourname)\.html',
                                  re.IGNORECASE)
    youname_file_name = yourname_pattern.search(ADDED_FILES)
    assert youname_file_name is None, \
           NEW_HTML_FILE_CALLED_YOURNAME_MESSAGE.format(newfilename=youname_file_name.groups(1)[0])


def test_no_files_have_been_removed():
    """Test that no files have been removed"""

    assert len(REMOVED_FILES) == 0, REMOVED_FILES_MESSAGE
