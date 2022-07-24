#!/usr/bin/env python3

import json
import os

cmd = ""
if os.environ.has_key("INCOMING_HOOK_BODY"):
    payload = os.environ.get("INCOMING_HOOK_BODY")
    decoded_vars = json.loads(payload)
    environment = " ".join(
        ["{}={}".format(key, value) for key, value in decoded_vars.items()]
    )
    cmd = environment + " npm run build:local"
else:
    cmd = "env-cmd -e netlifypr npm run build:local"

result = os.system(cmd)
print(result)
