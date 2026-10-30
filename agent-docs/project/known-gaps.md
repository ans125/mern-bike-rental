# Known gaps / future work

Back to [index](../../CLAUDE.md)

The project is kept **simple on purpose** for the FYP. Do not add the items below unless the team asks for them.

## Out of scope for this version (do not add)
| Item | Current behaviour |
|---|---|
| Online payment | rent is paid at the shop on hand-over; commission is calculated but not collected online |
| SMS / email / OTP / push notifications | none; users check their dashboard (chat has a refresh button) |
| External services (Google Maps, WhatsApp, etc.) | shop address is plain text, phone is a normal `tel:` link |
| Pick-up codes / extra security layers | owner simply presses **Hand over** after checking the original CNIC and licence |
| CNIC re-upload after rejection | rejected users contact support through the Contact page |
| Damage / dispute reports | handled through the Contact page |
| Search by free dates | browse page shows all available bikes; booking still blocks overlapping dates |

## Known gaps
| Gap | Notes |
|---|---|
| Free hosting limits | Render free server sleeps after ~15 min idle (first request ~30–50 s); its disk is wiped on restart, so bike/CNIC files uploaded on the live site are lost (seeded demo photos in Git are safe). Demo CNIC sample images are not on Render. |
| Security deposit | mentioned in descriptions for heavy bikes, not tracked in the system |
| Car rental, mobile app, automated tests | future |
