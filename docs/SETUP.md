# rotating-3d-model — Setup

> An auto-rotating 3D model on a transparent background.

## Install (one click)

1. Install [Übersicht](https://tracesof.net/uebersicht/) and run it once.
2. Double-click `install.command` (or run `./install.sh` in Terminal).
   It copies `rotating-3d-model.widget` into your Übersicht widgets folder, installs any
   helpers, and walks you through any configuration.

The installer is safe to re-run; it just refreshes the install in place.
To install by hand instead, unzip `rotating-3d-model.widget.zip` into
`~/Library/Application Support/Übersicht/widgets/`.

## Configuration

No setup. One model is bundled for offline use; the rest stream from the Khronos
glTF sample assets the first time they're shown. Edit the `MODELS` list at the
top of `index.jsx` to curate your own lineup.

## Fonts

For the intended look, install **Instrument Serif**, **Geist**, and
**Geist Mono**. System fonts are used as a fallback otherwise.
