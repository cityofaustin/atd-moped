# Moped API

The Mobility Project Database API uses a unique stack consisting of the elements:

- AWS Cognito: It managers our user base. It also federates users and allows for
  single sign-on with different identity providers such as Google, Microsoft, OpenID, etc.
- AWS DynamoDB: It serves as a serverless key-value database.
- AWS S3: It stores all the files that will be needed for the Moped database project.
- AWS API Gateway: It helps manage the API endpoint and manages some of the security with Cognito.
- AWS Lambda: It runs a serverless Flask API.
- Zappa: It deploys the stack for us with minimal configuration.
- Pytest: We will be using Pytest for our test-driven development practices.
- Python: Version 3.8

## Getting Started

#### Requirements

The python requirements are organized in three environments:

```
requirements/
├── dev.txt
├── production.txt
└── staging.txt
```

** TO DEVELOP LOCALLY YOU MUST CHOOSE DEV **

Install the requirements in your machine, run these in order:

1.First create a virtual environment in the API root folder:

```
$ virtualenv venv
```

2.Then activate the environment

```
$ source venv/bin/activate
```

3.Now you are ready to install the requirements

```
$ pip install -r requirements/development.txt
```

If you run into problems with installing `cryptography`, see the [cryptography docs on installing on macOS](https://cryptography.io/en/latest/installation/#building-cryptography-on-macos). If you've already run the last command and install of `cryptography` failed, then you may need to:

```
$ pip uninstall cryptography
$ brew install openssl@1.1 rust
$ env LDFLAGS="-L$(brew --prefix openssl@1.1)/lib" CFLAGS="-I$(brew --prefix openssl@1.1)/include" pip install cryptography==3.3.2
```

and then (to install the rest of the requirements):

```
$ pip install -r requirements/development.txt
```

This particular requirements file includes tools such as pytest that make development and unit testing a lot easier, but it also makes the api bulky. Do not bother in installing the production or staging requirement files, those are only meant for cloud deployments.

Next, set up your [AWS config and credentials](https://docs.aws.amazon.com/sdkref/latest/guide/file-format.html) files. You can obtain your credentials from the AWS console.

Running the API (with hot-reload)
Once the installation of the requirements is done, you are ready to launch the application using this command:

#### Run Flask in development mode:

```
$ FLASK_ENV=development flask run
```

You may have noticed the FLASK_ENV=development bash variable, this is passed to the flask command and it will initialize the application in app.py and enabled hot-reload, meaning that any changes you make to the code will be automatically reloaded for you (without you having to restart the API for every change).

## Blueprint Architecture

We will adhere to a blueprint architecture as it is stipulated in their documentation: https://flask.palletsprojects.com/en/1.1.x/blueprints/#blueprints

This is going to help scale large amounts of code into our API, it should also help with modularity and code re-use and our testing strategies. Please refer to the architecture notes below for details on how blueprints work.

## Test-driven development

To enable test-driven development patterns in our API I have created a tests folder with a sample test.

In the API root directory, you can use these commands to run your tests:

#### Testing

We use pytest and follow its patters to test our code for the API. To get started with testing make
sure you install the requirements/dev.txt files and run any of these commands:

```
# Run all tests
$ pytest -vs

# Run a specific test file
$ pytest -vs tests/your_test.py

# Run a specific test in a file:
$ pytest -v tests/your_tests.py::TestClass::test_method
```

#### Creating a new test file

You should look at a file called ./tests/test_app.py and copy it into a new file. Inside the test_app.py file you will see this syntax:

First you need to make sure you import the Flask application:

```python
#!/usr/bin/env python
import json, pdb
from unittest.mock import patch

# Imports the Flask application
from app import app
```

Then, you create a test class, it must begin with the prefix Test in order to be valid, here we use TestApp but if you were to create a new test file for say the authentication blueprint, you could name the test class TestAuth so on and so forth:

```python
class TestApp:
    @classmethod
    def setup_class(cls):
        # Gives us access to the app class
        cls.app = app
        cls.app.config["TESTING"] = True
        # Allows us to have a client for every test we make via self
        cls.client = cls.app.test_client()
        print("Beginning tests for: TestApp")

    @classmethod
    def teardown_class(cls):
        # Discards the app instance we have
        cls.app = None
        cls.client = None
        print("\n\nAll tests finished for: TestApp")
```

And your first test could be something like this:

```python
    @staticmethod
    def parse_response(response: bytes) -> dict:
        """
        Parses a response from Flask into a JSON dict
        :param bytes response: The response bytes string
        :return dict:
        """
        return json.loads(response.decode('utf-8'))

    def test_app_initializes(self):
        """Start with a blank database."""
        response = self.client.get('/')
        response_dict = self.parse_response(response.data)

        assert isinstance(response_dict, dict)
        assert "message" in response_dict
        assert "MOPED API Available" in response_dict.get("message", "")
```

## Parsing the JWT token within the API

Parsing JWT tokens provided by AWS Cognito is done with the help of the flask-cognito library (see references at the bottom) Take a look at the ./auth/auth.py file in the API, you will notice a few interesting lines:

First we import two helper methods:

```python
from flask_cognito import cognito_auth_required, current_cognito_jwt
```

1. **cognito_auth_required**: This is a decorator that populates the value of a global thread variable (local) with the decoded JWT token.

2. **current_cognito_jwt**: This is a helper function, basically it can safely access the place in memory where the JWT token is stored. This is a lambda function that returns a class of type LocalProxy, which wraps the dictionary value we are looking for. To access the decoded token value as a dictionary, use the `_get_current_object()` method.

Example:

```python
#
# In order to retrieve the current_cognito_jwt object,
# we need to call the @cognito_auth_required decorator.
#
@auth_blueprint.route('/example')
@cognito_auth_required
def auth_example() -> str:
    """
    Shows the current user payload data
    :return str:
    """

    # Use the _get_current_object method to get the dictionary containing our token:
    decoded_jwt = current_cognito_jwt._get_current_object()

    # Now we output our token:
    return jsonify({
        "decoded_jwt": decoded_jwt
    })
```

### Custom Decorators

One thing I have discovered with Hasura and Cognito, is that the Hasura claims are not a normal JSON document, in fact, the JWT token wraps the Hasura claims in a nested JSON (JSON within a JSON), which can be inconvenient, but it is the way it works according to their documentation.

To help with this, I’ve created a couple decorators and methods in the ./claims.py file, which can help with obtaining a normalized version of the token. One of them is called `@normalize_claims`, here is an example on how to use it:

```python
#
# You may also use the normalize_claims decorator
# along with the claims parameter to have a fully parsed claims dict
#
@auth_blueprint.route('/example')
@cognito_auth_required
@normalize_claims
def auth_example(claims) -> str:
    """
    Shows the current user payload data
    :return str:
    """
    return jsonify({
        "cognito:username": claims["cognito:username"],
        "email": claims["email"],
        "hasura_claims": claims["https://hasura.io/jwt/claims"]
    })
```

You will notice there will not be any nested JSON strings.
Feel free to implement your own decorators or helper methods.
