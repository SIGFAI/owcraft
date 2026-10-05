// OWCraft (Yaekai, MIT): real Minecraft played on Outer Wilds planets. Passthrough: an OWML mod in Outer Wilds and
// SkyCraft's Fabric mod (chasmlol, MIT) with OWCraft's patch in Minecraft 26.3, linked over shared memory
// (Local\OWCraft_v1). Outer Wilds is single-player with no anti-cheat. Rehosted on SIGFAI/owcraft (standard upstream
// fusion, source.hosted), both release files unchanged.
//
// The Outer Wilds side cannot be placed by the app today. OWML loads mods only from its own Mods folder
// (%AppData%\OuterWildsModManager\OWML\Mods, OwmlConfig.ModsPath), which no recipe root reaches, and OWML itself
// patches the game (Assembly-CSharp.dll, mscorlib.dll in Managed/) each time its launcher runs, which a snapshot taken
// at install time cannot undo, so we do not ship OWML. The player installs the Outer Wilds Mod Manager (official),
// and the mod zip is put in {app} as released, for the Mod Manager's "Install From > Zip" (one step, in the notes).
// Contract proposal (notes.md): an {owml} root, like {fivem}, so the zip unpacks into OWML's Mods folder directly.
//   node library/owcraft/build.mjs       (outputs: library/lib.mjs)
import { mrpack, resolveFabricApi } from '../../orchestrator/src/recipe.js';
import { instanceName } from '../../orchestrator/scripts/package-fusion.mjs';
import { asset, card, dl, emit, pinned, rawAt } from '../lib.mjs';

const UP = {
  repo: 'https://github.com/Yaekai/OWCraft', tag: 'v0.1.1', commit: 'cd5f0613e1de04c537e7db28a5813b0329cfbfa9',
  license: 'MIT', authors: ['Yaekai', 'chasmlol'], basedOn: 'https://github.com/chasmlol/SkyCraft',
  zip: { file: 'Yaekai.OWCraft-0.1.1.zip', sha256: '927f96588f2f1f6b89aad386e5a3dfebed119d6866cb48f71b711d3f442d9a28' }, // = GitHub digest
  jar: { file: 'skycraft-0.1.2+owcraft.5.jar', sha256: 'bc820b62b215e36564c8559ff4318b87cd07e1577c21f65e1dedb0cfae39ab70' }, // = GitHub digest
};
const SKY = { repo: 'https://github.com/chasmlol/SkyCraft', commit: 'bfcaf178524b92c2cdeb88e4ce0f13ef9ded6f32', version: '0.1.2', license: 'MIT' };
// README: Minecraft 26.3, Fabric Loader >= 0.19.5, Fabric API for 26.3, Java 25; OWML 2.16.3 (manifest.json).
const MC = { mc: '26.3', loader: '0.19.5', fabricApi: '0.161.0+26.3', java: '25' };
const OWML = { version: '2.16.3', page: 'https://outerwildsmods.com/mod-manager/' };
const ID = 'owcraft', VERSION = '0.1.1', NAME = 'OWCraft';
const TAGLINE = 'Real Minecraft on Outer Wilds planets: land, press F6 and break, place, craft and light TNT on Timber Hearth. Your builds stay through every time loop.';

const rel = (f) => `${UP.repo}/releases/download/${UP.tag}/${f.file}`;
const modZip = asset(UP.zip.file, await pinned(rel(UP.zip), UP.zip.sha256));
const jar = await pinned(rel(UP.jar), UP.jar.sha256);
const licenses = [
  { name: `overrides/licenses/${NAME}-LICENSE.txt`, data: await rawAt(UP.repo, UP.commit, 'LICENSE') },
  { name: `overrides/licenses/${NAME}-THIRD-PARTY-NOTICES.md`, data: await rawAt(UP.repo, UP.commit, 'THIRD-PARTY-NOTICES.md') },
  { name: 'overrides/licenses/SkyCraft-LICENSE.txt', data: await rawAt(SKY.repo, SKY.commit, 'LICENSE') },
];
const pack = async (offline) => {
  const fabricApi = offline ? null : await resolveFabricApi(MC.fabricApi, MC.mc);
  if (!offline && !fabricApi?.download) throw new Error(`Fabric API ${MC.fabricApi} not resolved on Modrinth`);
  return asset(`${ID}.mrpack`, mrpack({ name: NAME, summary: TAGLINE, versions: MC, versionId: VERSION, fabricApi,
    jars: [{ name: UP.jar.file, data: jar }], extra: licenses }));
};
const assets = [modZip, await pack(false)];
const fixtureAssets = [modZip, await pack(true)];

const make = (urls, set) => {
  const mp = set.find(a => a.name.endsWith('.mrpack'));
  const offline = set !== assets;
  return {
    id: `sigf/${ID}`,
    version: VERSION,
    name: NAME,
    tagline: TAGLINE,
    kind: 'passthrough',
    games: [
      { game: 'outerwilds', role: 'host', label: 'Outer Wilds', engine: 'Outer Wilds (Unity, Mono) + OWML mod (C#)', apps: { steam: '753640' },
        runtime: `current Steam build (upstream pins none), OWML ${OWML.version}`, mode: 'single-player only' },
      { game: 'minecraft', role: 'guest', label: 'Minecraft', engine: 'Minecraft Java 26.3 + SkyCraft Fabric mod with the OWCraft patch (Java)', mc: MC.mc, loader: `fabric@${MC.loader}`, java: MC.java },
    ],
    requires: [
      { id: 'owml', version: OWML.version, page: OWML.page, license: 'MIT; the Mod Manager installs and updates it',
        note: 'install the Outer Wilds Mod Manager and start Outer Wilds from it once: OWML patches the game each time the Mod Manager starts it' },
      { id: 'fabric-loader', version: MC.loader },
      { id: 'fabric-api', version: MC.fabricApi, note: 'in the Minecraft pack (downloaded from Modrinth)' },
    ],
    install: [
      // As released, for the Mod Manager's "Install From > Zip" (no recipe root reaches OWML's Mods folder).
      { game: 'outerwilds', strategy: 'profile', loader: 'owml', files: [
        { src: modZip.name, dst: `{app}/${modZip.name}`, unpack: false, ...dl(modZip, urls) },
      ] },
      { game: 'minecraft', strategy: 'mrpack', pack: { src: mp.name, ...dl(mp, urls) } },
    ],
    // Minecraft first (it waits for Outer Wilds over shared memory); Outer Wilds is started from the Mod Manager.
    launch: [{ game: 'minecraft' }],
    files: set.map(a => ({ name: a.name, ...dl(a, urls) })),
    source: {
      repo: UP.repo, license: 'MIT', upstream_license: UP.license, tag: UP.tag, commit: UP.commit,
      hosted: `https://github.com/SIGFAI/${ID}`, based_on: UP.basedOn,
      bundled: [{ name: 'SkyCraft (Fabric mod, OWCraft patch)', version: SKY.version, repo: SKY.repo, commit: SKY.commit, license: SKY.license }],
    },
    media: {},
    built_by: { author: UP.authors[0], authors: UP.authors, packaged_by: 'SIGF' },
    idea_by: UP.authors[0],
    built_at: '2026-10-05T00:00:00.000Z',
    ...card(UP.repo),
    notes: [
      'You need both games: Outer Wilds on Steam (Windows) and Minecraft: Java Edition. Single-player only.',
      `One step by hand, once: install the Outer Wilds Mod Manager (${OWML.page}), then in it choose Install From > Zip and pick ${modZip.name} from this mod's folder (Open folder in the app). It lands in %AppData%\\OuterWildsModManager\\OWML\\Mods\\Yaekai.OWCraft.`,
      `Press Play: Minecraft starts as the app's own Prism instance "${instanceName(`sigf/${ID}`)}" (Minecraft ${MC.mc}, Fabric Loader ${MC.loader}, Fabric API ${MC.fabricApi}, Java ${MC.java}). Then start Outer Wilds from the Mod Manager. Once they link, Minecraft opens its own void world; land on a planet and press F6.`,
      'Keys: F6 enters and leaves Minecraft mode, O opens Minecraft\'s menu, F5 third person, Esc pauses. Builds are saved in the Minecraft world and survive time loops.',
      'Restore deletes the Minecraft instance and the zip copy; remove OWCraft from the Mod Manager yourself (it does not touch your Outer Wilds save).',
      'Beta ("experimental, but playable", tested on one PC): translucent blocks are drawn opaque, the Outer Wilds player does not collide with placed blocks, no day/night sync. Report bugs to the author on the upstream issue tracker.',
      ...(offline ? [`Offline fixture: Fabric API ${MC.fabricApi} not in the pack.`] : []),
    ],
  };
};

emit({ slug: ID, version: VERSION, assets, fixtureAssets, make });
