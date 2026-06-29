import json

with open("upgrades.json", "r") as file:
    data = json.load(file)
    for i in data:
        del i["requires"]
        i["unlocks"] = []

with open("upgrades.json", "w") as file:
    json.dump(data, file, indent=4)