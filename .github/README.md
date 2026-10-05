# OWCraft

Real Minecraft on Outer Wilds planets: land, press F6 and break, place, craft and light TNT on Timber Hearth. Your builds stay through every time loop.

**OWCraft is made by [Yaekai](https://github.com/Yaekai).** All credit for the mod goes to them. It is built on [chasmlol/SkyCraft](https://github.com/chasmlol/SkyCraft) by chasmlol.

- Original project: https://github.com/Yaekai/OWCraft
- Report bugs and ask questions there: https://github.com/Yaekai/OWCraft/issues
- Upstream release packaged here: [v0.1.1](https://github.com/Yaekai/OWCraft/releases/tag/v0.1.1) (commit [`cd5f061`](https://github.com/Yaekai/OWCraft/tree/cd5f0613e1de04c537e7db28a5813b0329cfbfa9))

> **Beta.** Nobody at SIGF has played this build yet. Back up your saves.
> Bugs in the mod itself go to the author's issue tracker above; problems with the one-click install go to this repository's issues.

## What you need

- **Outer Wilds** ([Steam](https://store.steampowered.com/app/753640/)): current Steam build (upstream pins none), OWML 2.16.3.
- **Minecraft**: Java Edition 26.3.
- owml 2.16.3: install the Outer Wilds Mod Manager and start Outer Wilds from it once: OWML patches the game each time the Mod Manager starts it (https://outerwildsmods.com/mod-manager/).
- Windows and the [SIGF app](https://sigf.ai). The app installs fabric-loader 0.19.5, fabric-api 0.161.0+26.3 for you.

## Install

In the SIGF app, open **OWCraft** in the catalog, press **Install**, then **Play**. **Restore** puts your game folders back exactly as they were.
The app follows `mashup.json` in this repository: every download is pinned by sha256. The files come from the release [`v0.1.1`](../../releases/tag/v0.1.1).

### Good to know

- You need both games: Outer Wilds on Steam (Windows) and Minecraft: Java Edition. Single-player only.
- One step by hand, once: install the Outer Wilds Mod Manager (https://outerwildsmods.com/mod-manager/), then in it choose Install From > Zip and pick Yaekai.OWCraft-0.1.1.zip from this mod's folder (Open folder in the app). It lands in %AppData%\OuterWildsModManager\OWML\Mods\Yaekai.OWCraft.
- Press Play: Minecraft starts as the app's own Prism instance "sigf-owcraft" (Minecraft 26.3, Fabric Loader 0.19.5, Fabric API 0.161.0+26.3, Java 25). Then start Outer Wilds from the Mod Manager. Once they link, Minecraft opens its own void world; land on a planet and press F6.
- Keys: F6 enters and leaves Minecraft mode, O opens Minecraft's menu, F5 third person, Esc pauses. Builds are saved in the Minecraft world and survive time loops.
- Restore deletes the Minecraft instance and the zip copy; remove OWCraft from the Mod Manager yourself (it does not touch your Outer Wilds save).
- Beta ("experimental, but playable", tested on one PC): translucent blocks are drawn opaque, the Outer Wilds player does not collide with placed blocks, no day/night sync. Report bugs to the author on the upstream issue tracker.

## What this repository holds

1. The upstream source tree at tag `v0.1.1`, commit [`cd5f0613e1de04c537e7db28a5813b0329cfbfa9`](https://github.com/Yaekai/OWCraft/tree/cd5f0613e1de04c537e7db28a5813b0329cfbfa9), every file unchanged (same git blobs). Upstream's own `README.md` is there, unchanged; GitHub shows this file (`.github/README.md`) first.
2. Added by SIGF in the same commit: this file, `THIRD-PARTY.md` (licenses and sources of the third-party files in the release), and `sigf/` (the scripts that built the release assets, for reference: they run inside the SIGF repository).
3. `mashup.json`, the SIGF app recipe (the next commit).
4. The release `v0.1.1` (its tag is the first commit):

| Asset | Size | sha256 | What it is |
|---|---|---|---|
| `Yaekai.OWCraft-0.1.1.zip` | 44755 B | `927f96588f2f1f6b89aad386e5a3dfebed119d6866cb48f71b711d3f442d9a28` | upstream's Outer Wilds mod release file, unchanged (sha256 `927f9658...9a28`); the app puts it in its own folder for the Outer Wilds Mod Manager's "Install From > Zip". |
| `owcraft.mrpack` | 247868 B | `ac94b71ca0e52c0f81f05fbf46d9aa22a842247996c1b4194733de00cb2a44cd` | the Minecraft side: upstream's `skycraft-0.1.2+owcraft.5.jar` (SkyCraft with OWCraft's patch) unchanged, with OWCraft's LICENSE and THIRD-PARTY-NOTICES and SkyCraft's LICENSE, for Minecraft 26.3 with Fabric Loader 0.19.5; Fabric API 0.161.0+26.3 is a Modrinth download link, not stored here. |

## Licenses

| Part | License | Where |
|---|---|---|
| OWCraft (all of the upstream tree) | MIT, Copyright Yaekai | `LICENSE`, `THIRD-PARTY-NOTICES.md` |
| SkyCraft, which OWCraft's Minecraft jar patches | MIT, Copyright chasmlol | `THIRD-PARTY.md` |
| Fabric API (downloaded from Modrinth by the app, not stored here) | Apache-2.0 | https://github.com/FabricMC/fabric |

## Why this repository exists

The SIGF app (https://sigf.ai) installs mods from recipes (`mashup.json`) whose downloads are pinned release files. This repository makes OWCraft installable in one click, credited to Yaekai. If you are the author and want anything changed or taken down, open an issue here.
