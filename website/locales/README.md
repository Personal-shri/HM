# English, Hindi and Marathi

The site keeps English as its source language. `hi.json` and `mr.json` are saved text catalogues generated locally with NLLB-200 (600M, CT2 int8). `overrides.json` and `reviewed.json` contain curated UI, technical and numeric corrections. These are machine-assisted reading translations, not certified construction specifications. The language notice directs readers to the English/manufacturer source for technical verification.

No visitor text is sent to a translation API. Catalogues ship with the site; language preference is stored locally in the browser. The standalone HTML viewers receive embedded copies of the catalogue and language runtime during the website build. Original raster artwork, original downloaded drawings and third-party manufacturer pages can retain English. Product codes, numerical calculator results, currency and measurement notation are kept stable. Purchasing notes contain only the user's own entered values and the visible translated labels; the browser downloads them without sending to a supplier.

`source.json` is the extracted source inventory. `*-review.json` records machine output flagged during generation; curated overrides may resolve these entries. Do not interpret the raw machine-review files as the merged catalogue.

To update: build the English website, add new source strings, translate locally using `website/translate_local.py --model /path/to/model`, review both language catalogues and quantitative claims, then rebuild. The ordinary Vercel build needs no model, Python environment, network translation service or API key. Optional model/tool dependencies are not bundled in the repository.

Translation model attribution: [Meta NLLB-200 distilled 600M](https://huggingface.co/facebook/nllb-200-distilled-600M), [CT2 int8 conversion by JustFrederik](https://huggingface.co/JustFrederik/nllb-200-distilled-600M-ct2-int8), [CTranslate2](https://opennmt.net/CTranslate2/). The model is licensed CC-BY-NC-4.0; used here locally for a personal family-home project. Model weights are not redistributed. Translation outputs were edited for this website.
