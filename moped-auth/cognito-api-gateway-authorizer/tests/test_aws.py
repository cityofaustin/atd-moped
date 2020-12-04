#!/usr/bin/env python
import json
from aws import *


class TestAWS:
    @classmethod
    def setup_class(cls):
        # Gives us access to the app class
        cls.policy_statement = generate_policy_statement(
            api_name="hello_world",
            api_stage="staging",
            api_verb="OPTIONS",
            api_resource="*",
            action="*"
        )

    @classmethod
    def teardown_class(cls):
        # Discards the app instance we have
        cls.policy_statement = None

    def test_aws_iam_api_permissions(self):
        """
        Checks the IAM permissions look correct
        """
        iamp = AWS_ATD_MOPED_IAM_API_PERMISSIONS[0]
        assert isinstance(iamp, dict)
        assert "arn" in iamp
        assert "resource" in iamp
        assert "stage" in iamp
        assert "httpVerb" in iamp
        assert "scope" in iamp

    def test_aws_generate_policy_statement(self):
        """
        Checks if generate_policy_statement works
        """
        assert isinstance(self.policy_statement, dict)
        assert "Effect" in self.policy_statement
        assert "Action" in self.policy_statement
        assert "Resource" in self.policy_statement
        assert self.policy_statement["Effect"] == "*"
        assert self.policy_statement["Action"] == "execute-api:Invoke"
        assert self.policy_statement["Resource"] == "hello_world/staging/OPTIONS/*/"

    def test_aws_generate_policy(self):
        """
        Checks if generate_policy policy works
        """
        policy = generate_policy(
            principal_id="user",
            policy_statements=[self.policy_statement]
        )
        assert isinstance(policy, dict)
        assert "principalId" in policy
        assert "policyDocument" in policy
        assert json.dumps(policy) == '{"principalId": "user", "policyDocument": {"Version": "2012-10-17", "Statement": [{"Effect": "*", "Action": "execute-api:Invoke", "Resource": "hello_world/staging/OPTIONS/*/"}]}}'

    def test_generate_iam_policy(self):
        """
        Tests if generate_iam_policy works
        """
        iam_policy_valid = generate_iam_policy(valid=True, claims={})
        iam_policy_invalid = generate_iam_policy(valid=False, claims={})
        assert isinstance(iam_policy_valid, dict)
        assert isinstance(iam_policy_invalid, dict)
        assert json.dumps(iam_policy_valid) == '{"principalId": "user", "policyDocument": {"Version": "2012-10-17", "Statement": [{"Effect": "Allow", "Action": "execute-api:Invoke", "Resource": "arn:aws:execute-api:us-east-1:*:og37y2s8aA/*/*/*/"}]}}'
        assert json.dumps(iam_policy_invalid) == '{"principalId": "user", "policyDocument": {"Version": "2012-10-17", "Statement": [{"Effect": "Deny", "Action": "execute-api:Invoke", "Resource": "arn:aws:execute-api:us-east-1:*:og37y2s8aA/*/*/*/"}]}}'
