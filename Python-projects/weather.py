import tkinter as tk
from tkinter import font as tkfont
import requests
import threading

API_KEY = "efa9892fadc5558e74020b29f587f278"
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

# ── Palette ──────────────────────────────────────────────────────────────────
BG         = "#0d1117"
CARD       = "#161b22"
BORDER     = "#21262d"
ACCENT     = "#58a6ff"
ACCENT2    = "#1f6feb"
TEXT_PRI   = "#e6edf3"
TEXT_SEC   = "#8b949e"
SUCCESS    = "#3fb950"
ERROR_CLR  = "#f85149"
ENTRY_BG   = "#0d1117"

WEATHER_ICONS = {
    "clear": "☀️", "cloud": "☁️", "rain": "🌧️",
    "drizzle": "🌦️", "thunder": "⛈️", "snow": "❄️",
    "mist": "🌫️", "fog": "🌫️", "haze": "🌫️",
}

def get_icon(description: str) -> str:
    desc = description.lower()
    for key, icon in WEATHER_ICONS.items():
        if key in desc:
            return icon
    return "🌡️"


def get_weather():
    city = city_entry.get().strip()
    if not city:
        show_error("Enter a city name")
        return

    set_loading(True)
    threading.Thread(target=_fetch, args=(city,), daemon=True).start()


def _fetch(city: str):
    params = {"q": city, "appid": API_KEY, "units": "metric"}
    try:
        response = requests.get(BASE_URL, params=params, timeout=8)
        data = response.json()

        # FIX: cod can be int 200 or string "404" — normalise to int
        cod = int(data.get("cod", 0))

        if cod == 200:
            name    = data["name"]
            country = data["sys"]["country"]
            temp    = data["main"]["temp"]
            feels   = data["main"]["feels_like"]
            humidity= data["main"]["humidity"]
            desc    = data["weather"][0]["description"].capitalize()
            icon    = get_icon(desc)
            wind    = data["wind"]["speed"]
            root.after(0, show_result, name, country, temp, feels, humidity, desc, icon, wind)
        else:
            msg = data.get("message", "City not found")
            root.after(0, show_error, msg.capitalize())

    except requests.exceptions.ConnectionError:
        root.after(0, show_error, "No internet connection")
    except requests.exceptions.Timeout:
        root.after(0, show_error, "Request timed out")
    except Exception as e:
        root.after(0, show_error, f"Unexpected error: {e}")
    finally:
        root.after(0, set_loading, False)


def set_loading(state: bool):
    if state:
        btn.config(text="  Fetching…", state="disabled", bg=ACCENT2)
        clear_result()
    else:
        btn.config(text="  Get Weather", state="normal", bg=ACCENT)


def clear_result():
    for w in result_frame.winfo_children():
        w.destroy()


def show_error(msg: str):
    clear_result()
    tk.Label(result_frame, text="⚠", font=("Segoe UI Emoji", 26),
             bg=CARD, fg=ERROR_CLR).pack(pady=(18, 4))
    tk.Label(result_frame, text=msg, font=("Segoe UI", 11),
             bg=CARD, fg=ERROR_CLR, wraplength=300).pack()


def show_result(name, country, temp, feels, humidity, desc, icon, wind):
    clear_result()

    # Icon + temp
    top = tk.Frame(result_frame, bg=CARD)
    top.pack(fill="x", pady=(18, 0))

    tk.Label(top, text=icon, font=("Segoe UI Emoji", 48),
             bg=CARD).pack()

    tk.Label(top, text=f"{temp:.1f}°C", font=("Segoe UI", 42, "bold"),
             bg=CARD, fg=TEXT_PRI).pack()

    tk.Label(top, text=desc, font=("Segoe UI", 13),
             bg=CARD, fg=ACCENT).pack(pady=(0, 4))

    tk.Label(top, text=f"{name}, {country}", font=("Segoe UI", 11),
             bg=CARD, fg=TEXT_SEC).pack()

    # Divider
    tk.Frame(result_frame, height=1, bg=BORDER).pack(fill="x", pady=16, padx=24)

    # Stats row
    stats = tk.Frame(result_frame, bg=CARD)
    stats.pack(fill = "x", padx = 28, pady = (0, 18))
    stats.columnconfigure((0, 1, 2), weight=1)

    def stat_col(parent, col, emoji, label, value):
        f = tk.Frame(parent, bg=CARD)
        f.grid(row = 0, column = col, padx = 4)
        tk.Label(f, text = emoji, font = ("Segoe UI Emoji", 16), bg = CARD).pack()
        tk.Label(f, text = value, font = ("Segoe UI", 12, "bold"),
                 bg = CARD, fg = TEXT_PRI).pack()
        tk.Label(f, text=label, font=("Segoe UI", 9),
                 bg = CARD, fg = TEXT_SEC).pack()

    stat_col(stats, 0, "🌡️", "Feels like", f"{feels:.1f}°C")
    stat_col(stats, 1, "💧", "Humidity",   f"{humidity}%")
    stat_col(stats, 2, "💨", "Wind",        f"{wind} m/s")


# ── Root window ──────────────────────────────────────────────────────────────
root = tk.Tk()
root.title("Weather")
root.geometry("380x560")
root.resizable(False, False)
root.configure(bg=BG)

# Center on screen
root.update_idletasks()
x = (root.winfo_screenwidth()  - 380) // 2
y = (root.winfo_screenheight() - 560) // 2
root.geometry(f"380x560+{x}+{y}")

# ── Header ────────────────────────────────────────────────────────────────────
header = tk.Frame(root, bg=BG)
header.pack(fill="x", padx=24, pady=(28, 0))

tk.Label(header, text="Weather", font=("Segoe UI", 22, "bold"),
         bg=BG, fg=TEXT_PRI).pack(side="left")
tk.Label(header, text="🌐", font=("Segoe UI Emoji", 18),
         bg=BG).pack(side="right", pady=4)

# ── Search bar ────────────────────────────────────────────────────────────────
search_frame = tk.Frame(root, bg=BORDER, padx=1, pady=1)
search_frame.pack(fill="x", padx=24, pady=18)

inner = tk.Frame(search_frame, bg=ENTRY_BG)
inner.pack(fill="x")

tk.Label(inner, text="🔍", font=("Segoe UI Emoji", 13),
         bg=ENTRY_BG, fg=TEXT_SEC).pack(side="left", padx=(12, 6), pady=10)

city_entry = tk.Entry(inner, font=("Segoe UI", 13), bg=ENTRY_BG,
                      fg=TEXT_PRI, insertbackground=ACCENT,
                      relief="flat", bd=0)
city_entry.pack(side="left", fill="x", expand=True, pady=10)
city_entry.insert(0, "Search city…")
city_entry.config(fg=TEXT_SEC)

def on_focus_in(e):
    if city_entry.get() == "Search city…":
        city_entry.delete(0, "end")
        city_entry.config(fg=TEXT_PRI)

def on_focus_out(e):
    if not city_entry.get():
        city_entry.insert(0, "Search city…")
        city_entry.config(fg=TEXT_SEC)

city_entry.bind("<FocusIn>",  on_focus_in)
city_entry.bind("<FocusOut>", on_focus_out)
city_entry.bind("<Return>",   lambda e: get_weather())

# ── Button ────────────────────────────────────────────────────────────────────
btn = tk.Button(root, text="  Get Weather", font=("Segoe UI", 12, "bold"),
                bg=ACCENT, fg="#0d1117", activebackground=ACCENT2,
                activeforeground=TEXT_PRI, relief="flat", bd=0,
                cursor="hand2", command=get_weather, pady=10)
btn.pack(fill="x", padx=24)

# ── Result card ───────────────────────────────────────────────────────────────
card_border = tk.Frame(root, bg=BORDER, padx=1, pady=1)
card_border.pack(fill="both", expand=True, padx=24, pady=18)

result_frame = tk.Frame(card_border, bg=CARD)
result_frame.pack(fill="both", expand=True)

# Placeholder text
tk.Label(result_frame, text="Enter a city to see\ncurrent weather",
         font=("Segoe UI", 12), bg=CARD, fg=TEXT_SEC,
         justify="center").pack(expand=True)

root.mainloop()