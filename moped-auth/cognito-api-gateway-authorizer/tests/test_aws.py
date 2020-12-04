#!/usr/bin/env python
import json
from aws import *
import pdb


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
        Checks if the generate policy statement works in all cases
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
        Checks if generte policy works in all cases
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
        Not yet implemented
        """
        assert True
