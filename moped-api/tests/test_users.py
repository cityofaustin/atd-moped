from moto import mock_cognitoidp
import boto3, os, json, pytest
from tests.test_app import TestApp
from unittest.mock import patch, Mock
from claims import is_valid_user, has_user_role


def create_user_claims():
    return {
        "email": "@austintexas.gov",
        "cognito:username": "test_user",
        "https://hasura.io/jwt/claims": {
            "x-hasura-user-id": "test",
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": ["user", "admin"],
        },
        "email_verified": True,
        "aud": "test_aud",
    }


mock_users = [
    {"email": "neo@test.test", "password": "test123", "roles": ["moped-viewer"]},
    {"email": "morpheus@test.test", "password": "test123", "roles": ["moped-viewer"]},
    {"email": "trinity@test.test", "password": "test123", "roles": ["moped-viewer"]},
]


@pytest.fixture(scope="function")
def aws_credentials():
    """Mock credentials for moto"""
    os.environ["AWS_ACCESS_KEY_ID"] = "testing"
    os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
    os.environ["AWS_SECURITY_TOKEN"] = "testing"
    os.environ["AWS_SESSION_TOKEN"] = "testing"


@pytest.fixture(scope="function")
def cognito(aws_credentials):
    with mock_cognitoidp():
        yield boto3.client("cognito-idp")


@pytest.fixture(scope="function")
def create_user_pool(cognito):
    cognito_response = cognito.create_user_pool(PoolName="test_pool")
    user_pool_id = cognito_response["UserPool"]["Id"]

    user_ids = []

    # Add mock users to pool
    for user in mock_users:
        response = cognito.admin_create_user(
            UserPoolId=user_pool_id,
            Username=user["email"],
            TemporaryPassword=user["password"],
            UserAttributes=[
                {"Name": "email", "Value": user["email"]},
                {"Name": "email_verified", "Value": "true"},
            ],
        )
        user_id = response["User"]["Username"]
        user_ids.append(user_id)

    return {"user_pool_id": user_pool_id, "user_ids": user_ids}


class TestUsers(TestApp):
    def test_is_valid_user(self):
        """Test valid user attributes in JWT payload."""
        mock_jwt_payload = Mock()
        mock_jwt_payload._get_current_object = Mock(return_value=create_user_claims())

        result = is_valid_user(mock_jwt_payload)

        assert result is True

    def test_is_invalid_user_email(self):
        """Test invalid user email in JWT payload."""
        user_with_invalid_email = create_user_claims()
        user_with_invalid_email["email"] = "@gmail.com"

        mock_jwt = Mock()
        mock_jwt._get_current_object = Mock(return_value=user_with_invalid_email)

        result = is_valid_user(mock_jwt)

        assert result is False

    def test_is_invalid_user_roles(self):
        """Test invalid user (no roles) in JWT payload."""
        user_with_no_roles = create_user_claims()
        user_with_no_roles.pop("https://hasura.io/jwt/claims", None)

        mock_jwt = Mock()
        mock_jwt._get_current_object = Mock(return_value=user_with_no_roles)

        result = is_valid_user(mock_jwt)

        assert result is False

    def test_has_user_role_true(self):
        """Test user roles check in JWT claims (has role)."""
        result = has_user_role("user", create_user_claims())

        assert result is True

    def test_has_user_role_false(self):
        """Test user roles check in JWT claims (does not have role)."""
        result = has_user_role("hacker", create_user_claims())

        assert result is False

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

    @patch("flask_cognito._cognito_auth_required")
    @patch("users.users.is_valid_user")
    def test_gets_users(
        self, mock_is_valid_user, mock_cognito_auth_required, create_user_pool
    ):
        """Test get users route."""
        mock_is_valid_user.return_value = True

        # Mock user pool
        user_pool_dict = create_user_pool
        user_pool_id = user_pool_dict["user_pool_id"]

        # Patch the user pool id with the mock pool id
        patch("users.users.USER_POOL", new=user_pool_id).start()

        response = self.client.get("/users/")
        response_list = self.parse_response(response.data)

        # Collect mock user emails to compare to response data
        mock_usernames = [obj["email"] for obj in mock_users]

        assert isinstance(response_list, list)
        assert len(response_list) is len(mock_users)
        assert "Username" in response_list[0]
        assert "UserCreateDate" in response_list[0]
        assert response_list[0]["Username"] in mock_usernames

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

    @patch("flask_cognito._cognito_auth_required")
    @patch("users.users.is_valid_user")
    @patch("users.users.load_claims")
    def test_gets_user(
        self,
        mock_load_claims,
        mock_is_valid_user,
        mock_cognito_auth_required,
        create_user_pool,
    ):
        """Test get user route."""
        # Mock valid user check and claims loaded from DynamoDB
        mock_is_valid_user.return_value = True
        mock_load_claims.return_value = create_user_claims()[
            "https://hasura.io/jwt/claims"
        ]

        # Mock user pool
        user_pool_dict = create_user_pool
        user_pool_id = user_pool_dict["user_pool_id"]
        user_ids = user_pool_dict["user_ids"]

        # Patch the user pool id with the mock pool id
        patch("users.users.USER_POOL", new=user_pool_id).start()

        user_id = user_ids[0]
        response = self.client.get(f"/users/{user_id}")
        response_dict = self.parse_response(response.data)

        assert isinstance(response_dict, dict)
        assert "Username" in response_dict
        assert "UserCreateDate" in response_dict
        assert response_dict["Username"] == user_id

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

    @patch("flask_cognito._cognito_auth_required")
    @patch("users.users.is_valid_user")
    @patch("users.users.has_user_role")
    @patch("users.users.is_valid_user_profile")
    @patch("users.users.format_claims")
    @patch("users.users.put_claims")
    @patch("users.users.generate_user_profile")
    @patch("users.users.db_create_user")
    def test_creates_user_success(
        self,
        mock_db_create_user,
        mock_generate_user_profile,
        mock_put_claims,
        mock_format_claims,
        mock_is_valid_user_profile,
        mock_has_user_role,
        mock_is_valid_user,
        mock_cognito_auth_required,
        create_user_pool,
    ):
        """Test create user route."""
        # Mock valid user check and claims loaded from DynamoDB
        mock_is_valid_user.return_value = True
        mock_has_user_role.return_value = True
        mock_is_valid_user_profile.return_value = True, None
        mock_db_create_user.return_value = {}

        # Patch normalize claims
        claims = create_user_claims()
        claims["https://hasura.io/jwt/claims"] = json.dumps(
            claims["https://hasura.io/jwt/claims"]
        )
        _get_current_object = Mock(return_value=claims)
        patch(
            "claims.current_cognito_jwt",
            Mock(_get_current_object=_get_current_object),
        ).start()

        # Mock user pool
        user_pool_dict = create_user_pool
        user_pool_id = user_pool_dict["user_pool_id"]

        # Patch the user pool id with the mock pool id
        patch("users.users.USER_POOL", new=user_pool_id).start()

        # Prepare the payload for the request
        existing_user_json_payload = json.dumps(mock_users[0])
        new_user_json_payload = json.dumps(
            {"email": "new@test.test", "password": "test123", "roles": ["moped-viewer"]}
        )

        # New user request
        success_response = self.client.post(
            "/users/", data=new_user_json_payload, content_type="application/json"
        )
        success_response_dict = self.parse_response(success_response.data)

        # Get user list to compare length
        user_list_response = self.client.get("/users/")
        user_list = self.parse_response(user_list_response.data)

        assert isinstance(success_response_dict, dict)
        assert isinstance(success_response_dict.get("success", False), dict)
        assert len(user_list) == len(mock_users) + 1

    @patch("flask_cognito._cognito_auth_required")
    @patch("users.users.is_valid_user")
    @patch("users.users.has_user_role")
    @patch("users.users.is_valid_user_profile")
    @patch("users.users.put_claims")
    def test_creates_user_already_exists(
        self,
        mock_put_claims,
        mock_is_valid_user_profile,
        mock_has_user_role,
        mock_is_valid_user,
        mock_cognito_auth_required,
        create_user_pool,
    ):
        """Test create user route when user already exists."""
        # Mock valid user check and claims loaded from DynamoDB
        mock_is_valid_user.return_value = True
        mock_has_user_role.return_value = True
        mock_is_valid_user_profile.return_value = True, None

        # Patch normalize claims
        claims = create_user_claims()
        claims["https://hasura.io/jwt/claims"] = json.dumps(
            claims["https://hasura.io/jwt/claims"]
        )
        _get_current_object = Mock(return_value=claims)
        patch(
            "claims.current_cognito_jwt",
            Mock(_get_current_object=_get_current_object),
        ).start()

        # Mock user pool
        user_pool_dict = create_user_pool
        user_pool_id = user_pool_dict["user_pool_id"]

        # Patch the user pool id with the mock pool id
        patch("users.users.USER_POOL", new=user_pool_id).start()

        # Prepare the payload for the request
        existing_user_json_payload = json.dumps(mock_users[0])
        new_user_json_payload = json.dumps(
            {"email": "new@test.test", "password": "test123", "roles": ["moped-viewer"]}
        )

        # Existing user request
        fail_response = self.client.post(
            "/users/", data=existing_user_json_payload, content_type="application/json"
        )
        fail_response_dict = self.parse_response(fail_response.data)

        assert isinstance(fail_response_dict, dict)
        assert isinstance(fail_response_dict.get("Error", None), dict)
        assert fail_response_dict["Error"]["Code"] == "UsernameExistsException"

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

    @patch("flask_cognito._cognito_auth_required")
    @patch("users.users.is_valid_user")
    @patch("users.users.has_user_role")
    @patch("users.users.is_valid_user_profile")
    @patch("users.users.get_user_email_from_attr")
    @patch("users.users.generate_user_profile")
    @patch("users.users.db_update_user")
    @patch("users.users.delete_claims")
    @patch("users.users.format_claims")
    @patch("users.users.put_claims")
    def test_edits_user(
        self,
        mock_put_claims,
        mock_format_claims,
        mock_delete_claims,
        mock_db_update_user,
        mock_generate_user_profile,
        mock_get_user_email_from_attr,
        mock_is_valid_user_profile,
        mock_has_user_role,
        mock_is_valid_user,
        mock_cognito_auth_required,
        create_user_pool,
    ):
        """Test edit user route."""
        # Mock valid user check and claims loaded from DynamoDB
        mock_is_valid_user.return_value = True
        mock_has_user_role.return_value = True
        mock_is_valid_user_profile.return_value = True, None
        mock_db_update_user.return_value = json.dumps({})

        # Patch normalize claims
        claims = create_user_claims()
        claims["https://hasura.io/jwt/claims"] = json.dumps(
            claims["https://hasura.io/jwt/claims"]
        )
        _get_current_object = Mock(return_value=claims)
        patch(
            "claims.current_cognito_jwt",
            Mock(_get_current_object=_get_current_object),
        ).start()

        # Mock user pool
        user_pool_dict = create_user_pool
        user_pool_id = user_pool_dict["user_pool_id"]

        # Patch the user pool id with the mock pool id
        patch("users.users.USER_POOL", new=user_pool_id).start()

        # Prepare the payload for the request
        user_to_edit = mock_users[0]["email"]
        new_email_json_payload = json.dumps({"email": "edited@test.test"})
        mock_get_user_email_from_attr.return_value = user_to_edit

        # Edit user request
        response = self.client.put(
            f"/users/{user_to_edit}",
            data=new_email_json_payload,
            content_type="application/json",
        )
        response_dict = self.parse_response(response.data)

        assert isinstance(response_dict, dict)
        assert isinstance(response_dict.get("success", None), dict)

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

    @patch("flask_cognito._cognito_auth_required")
    @patch("users.users.is_valid_user")
    @patch("users.users.has_user_role")
    @patch("users.users.db_deactivate_user")
    @patch("users.users.get_user_email_from_attr")
    @patch("users.users.delete_claims")
    def test_deletes_user(
        self,
        mock_delete_claims,
        mock_get_user_email_from_attr,
        mock_db_deactivate_user,
        mock_has_user_role,
        mock_is_valid_user,
        mock_cognito_auth_required,
        create_user_pool,
    ):
        """Test delete user route."""
        # Mock valid user check and claims loaded from DynamoDB
        mock_is_valid_user.return_value = True
        mock_has_user_role.return_value = True
        mock_db_deactivate_user.return_value = json.dumps({})

        # Patch normalize claims
        claims = create_user_claims()
        claims["https://hasura.io/jwt/claims"] = json.dumps(
            claims["https://hasura.io/jwt/claims"]
        )
        _get_current_object = Mock(return_value=claims)
        patch(
            "claims.current_cognito_jwt",
            Mock(_get_current_object=_get_current_object),
        ).start()

        # Mock user pool
        user_pool_dict = create_user_pool
        user_pool_id = user_pool_dict["user_pool_id"]

        # Patch the user pool id with the mock pool id
        patch("users.users.USER_POOL", new=user_pool_id).start()

        # Prepare the payload for the request
        user_to_delete = mock_users[0]["email"]

        # Delete user request
        response = self.client.delete(
            f"/users/{user_to_delete}",
        )
        response_dict = self.parse_response(response.data)

        # Get user list to compare length
        user_list_response = self.client.get("/users/")
        user_list = self.parse_response(user_list_response.data)

        assert isinstance(response_dict, dict)
        assert isinstance(response_dict.get("success", None), dict)
        assert len(user_list) == len(mock_users) - 1

    @patch("flask_cognito._cognito_auth_required")
    @patch("users.users.is_valid_user")
    @patch("users.users.is_users_password")
    @patch("users.users.is_valid_user_password")
    def test_update_user_password(
        self,
        mock_is_valid_user_password,
        mock_is_users_password,
        mock_is_valid_user,
        mock_cognito_auth_required,
        create_user_pool,
    ):
        """Test update password route."""
        # Mock valid user check and claims loaded from DynamoDB
        mock_is_valid_user.return_value = True
        mock_is_users_password.return_value = True
        mock_is_valid_user_password.return_value = True, None

        # Patch normalize claims
        claims = create_user_claims()
        claims["https://hasura.io/jwt/claims"] = json.dumps(
            claims["https://hasura.io/jwt/claims"]
        )
        _get_current_object = Mock(return_value=claims)
        patch(
            "claims.current_cognito_jwt",
            Mock(_get_current_object=_get_current_object),
        ).start()

        # Mock user pool
        user_pool_dict = create_user_pool
        user_pool_id = user_pool_dict["user_pool_id"]

        # Patch the user pool id with the mock pool id
        patch("users.users.USER_POOL", new=user_pool_id).start()

        # Prepare the payload for the request
        user_to_update_password = mock_users[0]["email"]
        new_password_json_payload = json.dumps({"password": "nUPaSSword"})

        # Delete user request
        response = self.client.put(
            f"/users/{user_to_update_password}/password",
            data=new_password_json_payload,
            content_type="application/json",
        )
        response_dict = self.parse_response(response.data)

        # Get user list to compare length
        user_list_response = self.client.get("/users/")
        user_list = self.parse_response(user_list_response.data)

        assert isinstance(response_dict, dict)
        assert isinstance(response_dict.get("success", None), dict)
