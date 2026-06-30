import webview
from pathlib import Path
import os
import json

html = Path("index.html").resolve()

appdata_env = os.getenv("LOCALAPPDATA")
if appdata_env is None:
    raise RuntimeError("LOCALAPPDATA not found")

appdata = Path(appdata_env) / "DonutClicker"
appdata.mkdir(parents=True, exist_ok=True)

class Api:
    def has_save(self):
        save_file = appdata / "save.json"
        if save_file.is_file():
            return True
        return False

    def load_game(self):
        save_file = appdata / "save.json"

        with open(save_file, "r") as file:
            data = json.load(file)
        
        return data

    def save_game(self, data:dict):
        save_file = appdata / "slot 1" / "save.json"

        with open(save_file, "w") as file:
            json.dump(data, file, indent=4)

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

def on_loaded(window):
    window.evaluate_js("window.IS_PYWEBVIEW = true;") # type: ignore

webview.start(on_loaded,window) # type: ignore