#!/usr/bin/env python3

import json
import os

os.environ["INCOMING_HOOK_BODY"] = json.dumps({
        "FOO": "bar",
        "FIZZ": "buzz",
})

payload = os.environ.get('INCOMING_HOOK_BODY')
decoded_vars = json.loads(payload)

environment = " ".join(['{}={}'.format(key, value) for key, value in decoded_vars.items()])
print(environment)

cmd = environment + " npm run build:local"
os.system(cmd)

