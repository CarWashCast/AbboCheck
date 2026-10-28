"""Apply the approved AbboCheck icon to a generated Capacitor Android project."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parent.parent
resources = root / "android/app/src/main/res"
icon = root / "abbocheck-icon.png"
if not resources.is_dir():
    raise SystemExit("Run npx cap add android first.")

# Android scales these PNG resources at runtime. Preserve the approved artwork.
for image in resources.glob("mipmap-*/*.png"):
    if image.stem in {"ic_launcher", "ic_launcher_round", "ic_launcher_foreground"}:
        shutil.copyfile(icon, image)

# Adaptive launchers use a separate foreground resource on Android 8+.
# Keep the artwork inside the safe area so launcher masks do not crop the mark.
(resources / "drawable/abbocheck_icon.png").write_bytes(icon.read_bytes())
for name in ("ic_launcher", "ic_launcher_round"):
    (resources / f"mipmap-anydpi-v26/{name}.xml").write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
        '    <background android:drawable="@color/ic_launcher_background"/>\n'
        '    <foreground>\n'
        '        <inset android:inset="16.67%">\n'
        '            <bitmap android:src="@drawable/abbocheck_icon" android:gravity="fill"/>\n'
        '        </inset>\n'
        '    </foreground>\n'
        '</adaptive-icon>\n'
    )
(resources / "values/ic_launcher_background.xml").write_text(
    '<?xml version="1.0" encoding="utf-8"?>\n'
    '<resources><color name="ic_launcher_background">#1d1d1f</color></resources>\n'
)
print("Applied AbboCheck launcher icons.")
