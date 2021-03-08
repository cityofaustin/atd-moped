import pytest, pdb

from users.helpers import get_user_database_ids

mock_db_response_test_cases = [
    {
      "data": {
        "insert_moped_users": {
          "affected_rows": 1,
          "returning": [
            {
              "user_id": 4,
              "workgroup_id": 1
            }
          ]
        }
      }
    },
    {
        "data": {
            "insert_moped_users": {
                "affected_rows": 1,
                "returning": [
                    {
                        "user_id": 4
                    }
                ]
            }
        }
    },
    {
        "data": {
            "insert_moped_users": {
                "affected_rows": 1,
                "returning": [
                    {
                        "workgroup_id": 1
                    }
                ]
            }
        }
    },
    {
        "data": {
            "insert_moped_users": {
                "affected_rows": 1,
                "wrong_key": [
                    {
                        "user_id": 4,
                        "workgroup_id": 1
                    }
                ]
            }
        }
    },
    {
        "data": {
            "insert_moped_users": {
                "affected_rows": 1,
                "returning": []
            }
        }
    },
    {
        "data": {
            "insert_moped_users": {
                "affected_rows": 1,
                "returning": None,
            }
        }
    },
    {
        "data": {
            "insert_moped_users": {
                "affected_rows": 1
            }
        }
    },
    {
        "data": {
            "somewhere": {
                "affected_rows": 1,
                "returning": [
                    {
                        "user_id": 4,
                        "workgroup_id": 1
                    }
                ]
            }
        }
    },
]



class TestUserHelpers():
    def test_get_user_database_ids(self):
        """Test valid user attributes in JWT payload."""
        database_id, workgroup_id = get_user_database_ids(response=None)
        assert isinstance(database_id, str) and isinstance(workgroup_id, str)
        assert database_id == "0" and workgroup_id == "0"


        database_id, workgroup_id = get_user_database_ids(response=mock_db_response_test_cases[0])
        assert isinstance(database_id, str) and isinstance(workgroup_id, str)
        assert database_id == "4" and workgroup_id == "1"

        database_id, workgroup_id = get_user_database_ids(response=mock_db_response_test_cases[1])
        assert isinstance(database_id, str) and isinstance(workgroup_id, str)
        assert database_id == "4" and workgroup_id == "0"

        database_id, workgroup_id = get_user_database_ids(response=mock_db_response_test_cases[2])
        assert isinstance(database_id, str) and isinstance(workgroup_id, str)
        assert database_id == "0" and workgroup_id == "1"

        for test_case in mock_db_response_test_cases[3:]:
            database_id = "-1"
            workgroup_id = "-1"
            database_id, workgroup_id = get_user_database_ids(response=test_case)
            print(test_case)
            assert isinstance(database_id, str) and isinstance(workgroup_id, str)
            assert database_id == "0" and workgroup_id == "0"
