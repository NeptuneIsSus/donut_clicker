import webview
from pathlib import Path
import os
import json
import sys

html = Path("title.html").resolve()

appdata_env = os.getenv("LOCALAPPDATA")
if appdata_env is None:
    raise RuntimeError("LOCALAPPDATA not found")

appdata = Path(appdata_env) / "DonutClicker"
appdata.mkdir(parents=True, exist_ok=True)

class Api:
    def __init__(self):
        self.latest_state = None

    def updateState(self, state):
        print("auto: storing current state")
        self.latest_state = state

    def has_save(self, file:str, slot:str="autosave"):
        print(f"Checking for save {slot}/{file}.json")
        save_file = appdata / slot / f"save-{file}.json"
        if save_file.is_file():
            print(f"Had save at {slot}/{file}.json")
            return True
        print(f"{file}.json was not found in {slot}/")
        return False

    def load_game(self, file:str, slot:str="autosave"):
        save_file = appdata / slot / f"save-{file}.json"

        with open(save_file, "r") as f:
            data = json.load(f)
        
        print(f"Loading save {file}.json from {slot}/")
        print(data)
        return data

    def save_game(self, data:dict, file:str, slot:str="autosave"):
        save_dir = appdata / slot
        save_dir.mkdir(parents=True, exist_ok=True)
        save_file = save_dir / f"save-{file}.json"

        with open(save_file, "w") as f:
            json.dump(data, f, indent=4)

    def kill(self):
        print("KILL ME NOW")
        window.destroy() # type: ignore

api = Api()

window = webview.create_window(
    "Donut Clicker",
    html.as_uri(),
    maximized=True,
    width=1280,
    height=720,
    min_size=(640,360),
    js_api=api
)

def create_handlers(win):
    def on_loaded():
        win.evaluate_js("window.IS_PYWEBVIEW = true;") # type: ignore

    def on_closing():
        print("AAAAAAAAAAAAAAAA")

        grab_state = api.latest_state

        if not grab_state == None:
            api.save_game(grab_state,"clicker","autosave")

    win.events.loaded += on_loaded # type: ignore
    win.events.closing += on_closing # type: ignore

create_handlers(window)
webview.start(debug=True) # type: ignore