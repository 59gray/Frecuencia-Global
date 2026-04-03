# Maya Host Render Pack

Fecha: 2026-04-03
Estado: selected master ready

## Source Render

- Selected render: `output/gemini/maya_host_render_pass_20260403/maya-host-c-avatar-safe.png`
- Reference used: `C:/OneDrive/Desktop/maya.png`
- Generation path: Gemini web automation with `Create image` tool plus direct reference upload

## Final Assets

- `06_Assets/MAYA_HOST_KeyVisual_FullBody_1080x1920_v1.png`
- `06_Assets/MAYA_HOST_Avatar_Master_1080_v1.png`
- `06_Assets/MAYA_HOST_Avatar_Profile_400_v1.png`
- `06_Assets/MAYA_HOST_Avatar_Profile_200_v1.png`

## Notes

- `C_avatar_safe` is the first render that successfully used the reference image instead of prompt-only generation.
- The avatar crop is tuned for face, glasses, ponytail, and shoulder readability in square and circular profile usage.
- Asset derivation is reproducible through `scripts/build_maya_host_assets.py`.
