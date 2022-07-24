#!/usr/bin/env python3

import json
import os

payload = os.environ.get('INCOMING_HOOK_BODY')
decoded_vars = json.loads(payload)

environment = " ".join(['{}={}'.format(key, value) for key, value in decoded_vars.items()])

cmd = environment + " npm run build:local"
result = os.system(cmd)
print(result)
