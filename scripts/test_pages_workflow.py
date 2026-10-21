"""Check publication eligibility against the workflow's actual guard."""

from pathlib import Path
import re
import unittest


class PagesPublicationTests(unittest.TestCase):
    def test_publication_requires_main_and_push_or_explicit_manual_retry(self):
        workflow = (Path(__file__).resolve().parents[1] /
                    '.github/workflows/pages.yml').read_text(encoding='utf-8')
        publish = workflow.split('\n  publish:', 1)[1]
        self.assertRegex(publish, r'(?m)^    needs: verify$')
        guard = re.search(r'^    if: (.+)$', publish, re.MULTILINE).group(1)
        for event in ('push', 'pull_request', 'workflow_dispatch'):
            for ref in ('refs/heads/main', 'refs/heads/feature', 'refs/pull/4/merge'):
                for retry in (False, True):
                    with self.subTest(event=event, ref=ref, retry=retry):
                        expression = guard.replace('github.event_name', repr(event))
                        expression = expression.replace('github.ref', repr(ref))
                        expression = expression.replace('inputs.publish_reviewed_site', str(retry))
                        expression = expression.replace('&&', ' and ').replace('||', ' or ')
                        # Only literals and boolean/comparison operators may be evaluated.
                        remainder = re.sub(r"'[^']*'|True|False|and|or|==|\(|\)|\s+", '', expression)
                        self.assertEqual(remainder, '')
                        expected = ref == 'refs/heads/main' and (
                            event == 'push' or (event == 'workflow_dispatch' and retry))
                        self.assertEqual(bool(eval(expression, {'__builtins__': {}}, {})), expected)


if __name__ == '__main__':
    unittest.main()
