# MOPED API - Testing

We are following a very basic pattern to write and make tests. We use pytest
with a combination of whatever packages you are running in your SQS event.

To get started:

1. Create a virtual environment:
    ```
    $ virtualenv venv
    $ source venv/bin/activate
    ```
2. Install dependencies:
    ```
    $ pip install -r requirements/dev.txt
    ```
3. Run your tests:
   ```
   # Run a specific test:
   $ pytest -v tests/your_test.py
   $ pytest -v tests/your_tests.py::TestClass::test_method
   ```