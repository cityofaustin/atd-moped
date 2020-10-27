from moto import mock_cognitoidp
from tests.test_app import TestApp
from unittest.mock import patch


class TestUsers(TestApp):
    headers = {"Authorization": "Bearer TEST123"}

    @mock_cognitoidp
    def test_gets_users_no_auth(self):
        """Get users with no auth."""
        response = self.client.get("/users/")
        response_dict = self.parse_response(response.data)

        assert isinstance(response_dict, dict)
        assert "description" in response_dict
        assert "error" in response_dict
        assert (
            "Request does not contain a well-formed access token"
            in response_dict.get("description", "")
        )
        assert "Authorization Required" in response_dict.get("error", "")

    @mock_cognitoidp
    @patch("flask_cognito._cognito_auth_required")
    def test_gets_users(self, mock_cognito_auth_required):
        """Get users."""
        response = self.client.get("/users/")
        response_dict = self.parse_response(response.data)

        assert isinstance(response_dict, str)
        assert "description" in response_dict
        assert "error" in response_dict
        assert (
            "Request does not contain a well-formed access token"
            in response_dict.get("description", "")
        )
        assert "Authorization Required" in response_dict.get("error", "")

    @mock_cognitoidp
    def test_gets_user_no_auth(self):
        """Get user with no auth."""
        response = self.client.get("/users/test123")
        response_dict = self.parse_response(response.data)

        assert isinstance(response_dict, dict)
        assert "description" in response_dict
        assert "error" in response_dict
        assert (
            "Request does not contain a well-formed access token"
            in response_dict.get("description", "")
        )
        assert "Authorization Required" in response_dict.get("error", "")

    @mock_cognitoidp
    def test_creates_user_no_auth(self):
        """Create user with no auth."""
        response = self.client.post("/users/")
        response_dict = self.parse_response(response.data)

        assert isinstance(response_dict, dict)
        assert "description" in response_dict
        assert "error" in response_dict
        assert (
            "Request does not contain a well-formed access token"
            in response_dict.get("description", "")
        )
        assert "Authorization Required" in response_dict.get("error", "")

    @mock_cognitoidp
    def test_edits_user_no_auth(self):
        """Edit user with no auth."""
        response = self.client.put("/users/test123")
        response_dict = self.parse_response(response.data)

        assert isinstance(response_dict, dict)
        assert "description" in response_dict
        assert "error" in response_dict
        assert (
            "Request does not contain a well-formed access token"
            in response_dict.get("description", "")
        )
        assert "Authorization Required" in response_dict.get("error", "")

    @mock_cognitoidp
    def test_deletes_user_no_auth(self):
        """Delete user with no auth."""
        response = self.client.delete("/users/test123")
        response_dict = self.parse_response(response.data)

        assert isinstance(response_dict, dict)
        assert "description" in response_dict
        assert "error" in response_dict
        assert (
            "Request does not contain a well-formed access token"
            in response_dict.get("description", "")
        )
        assert "Authorization Required" in response_dict.get("error", "")
