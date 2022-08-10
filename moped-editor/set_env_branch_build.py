#!/usr/bin/env python3

import json
import os

cmd = ""

print("Using payload defined environment variables, if any, to overload 'netlifypr' from .env_cmdrc")
payload = os.environ.get("INCOMING_HOOK_BODY", "{}")
decoded_vars = json.loads(payload)
environment = " ".join(
    ["{}={}".format(key, value) for key, value in decoded_vars.items()]
)
cmd = environment + " env-cmd --no-override -e netlifypr npm run build:local"

result = os.popen(cmd)

# i'm still not convinced this is giving us a build log, or is there none in a CI environment?
print(result.read())
