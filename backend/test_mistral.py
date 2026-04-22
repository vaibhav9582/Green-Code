import mistralai
import mistralai.client

print(dir(mistralai))
print(dir(mistralai.client))

from mistralai.client import Mistral
print("Imported Mistral from mistralai.client")
