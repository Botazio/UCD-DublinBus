from django.test import TestCase

class DublinBusTests(TestCase):
    """Class for tests for Dublin Bus app"""

    def test_404(self):
        """Test 404 responses from invalid IDs"""
        response = self.client.get('/stop/abc/')
        self.assertEqual(response.status_code, 404)
