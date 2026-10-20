"""Exercise the actual workflow guards for retries after a committed sync."""

from pathlib import Path
import re
import unittest


WORKFLOW = Path(__file__).resolve().parents[1] / '.github/workflows/sync-settings.yml'


def enabled(condition, *, changed, retry=False, manual=False, publishing=True):
    values = {
        'steps.changes.outputs.changed': repr(str(changed).lower()),
        'needs.sync.outputs.changed': repr(str(changed).lower()),
        'github.event_name': repr('workflow_dispatch' if manual else 'schedule'),
        'inputs.retry_publish': str(retry),
        'vars.PAGES_SYNC_PUBLISH': repr(str(publishing).lower()),
    }
    for name, value in values.items():
        condition = condition.replace(name, value)
    condition = condition.replace('&&', ' and ').replace('||', ' or ')
    if not re.fullmatch(r"(?:True|False|'true'|'false'|'workflow_dispatch'|'schedule'|==|and|or|\(|\)|\s)+", condition):
        raise AssertionError(f'Unsupported workflow guard: {condition}')
    return bool(eval(condition, {'__builtins__': {}}, {}))


class PublicationRetryTests(unittest.TestCase):
    def setUp(self):
        workflow = WORKFLOW.read_text(encoding='utf-8')
        sync, publish = workflow.split('\n  publish:', 1)
        self.steps = re.split(r'^      - ', sync, flags=re.MULTILINE)[1:]
        self.publish = re.search(r'^    if: (.+)$', publish, re.MULTILINE).group(1)

    def step_runs(self, text, **scenario):
        matches = [step for step in self.steps if text in step]
        self.assertEqual(len(matches), 1, text)
        guard = re.search(r'^(?:if:|        if:) (.+)$', matches[0], re.MULTILINE)
        return True if guard is None else enabled(guard.group(1), **scenario)

    def assert_pipeline(self, *, build, commit, publish, **scenario):
        for command in ('run: npm ci', 'run: npm test', 'run: npm run build', 'uses: actions/upload-pages-artifact@'):
            self.assertEqual(self.step_runs(command, **scenario), build, command)
        self.assertEqual(self.step_runs('name: Record the validated source update', **scenario), commit)
        self.assertEqual(enabled(self.publish, **scenario), publish)

    def test_manual_retry_recovers_after_upload_or_deploy_failure_without_another_commit(self):
        # The prior attempt has already pushed JSON, but did not finish publishing.
        for failure in ('upload', 'deployment'):
            with self.subTest(failure=failure):
                self.assert_pipeline(changed=False, manual=True, retry=True,
                                     build=True, commit=False, publish=True)

    def test_scheduled_unchanged_data_remains_a_noop(self):
        self.assert_pipeline(changed=False, build=False, commit=False, publish=False)

    def test_new_data_builds_commits_and_publishes(self):
        self.assert_pipeline(changed=True, build=True, commit=True, publish=True)

    def test_retry_does_not_bypass_publication_enablement(self):
        self.assert_pipeline(changed=False, manual=True, retry=True, publishing=False,
                             build=True, commit=False, publish=False)

    def test_retry_is_only_available_for_manual_runs(self):
        self.assert_pipeline(changed=False, retry=True, manual=False,
                             build=False, commit=False, publish=False)


if __name__ == '__main__':
    unittest.main()
