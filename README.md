# Grade 9 · Python Training Lab

English study material for 9A, 9B and 9C before Evidence 3. Students work independently. Six lessons, twelve quick checks, three fresh debugging programs, four tests per program, hints, optional practice model solutions and a Python quick reference are included.

This public training package contains new practice problems. It does not contain the formal assessments, their answer keys, the response spreadsheet or student records. There is no peer-feedback activity.

## Publish on Karbian GitHub Pages

The download includes `github-pages/`, ready to upload without a build step.

1. Sign in to the **Karbian** GitHub account and open the repository that should host this material, or create a repository such as `grade9-python-training`.
2. Upload the **contents** of `github-pages/` to the repository root. `index.html`, `.nojekyll` and the `assets` folder must sit together. Keep the folder structure. Upload the extracted files, rather than the ZIP itself.
3. In the repository, open **Settings → Pages**. Select **Deploy from a branch**, choose the branch containing the files (usually `main`) and select **/(root)**. Save.
4. Wait for GitHub Pages to finish deployment. Open the URL displayed by GitHub, then share that link with 9A, 9B and 9C. Test it on a school device first.

If adding this to an existing site, put those same files together in a subfolder, such as `training/`, and share that path on the existing Pages site. All local asset references are relative so a repository subpath works. The package has been prepared and tested locally; no Karbian repository has been created or changed by this delivery.

## Suggested student session

Allow approximately 55–70 minutes, or split the work across two sessions.

1. Follow the six lessons: choose input types, write calculations, read decisions, debug one cause, test boundaries, improve and explain. Predict before checking an answer.
2. Open the debugging lab. Start with **Reading pace checker**, then try **Quiz average checker** and the loop extension **Club points collector**. Each starter has four intended faults.
3. Read the task, predict the complete outputs, run the code and repair one cause at a time. Keep a record in the debugging notebook. Run the four supplied tests and compare predictions with actual output.
4. Add one useful feature and test it separately. Explain your input types, calculation, conditions and evidence. Use a hint when needed; a model solution becomes available after an execution attempt.
5. Export progress before changing devices. Review the quick reference before the test.

The formal assessments remain separate Apps Script pages. Training progress is optional study evidence and is not a formal submission or grade.

## Python and saved progress

- Python runs on the student's device in a module Web Worker using [Pyodide](https://pyodide.org/en/stable/). The pinned runtime is `v314.0.7` from jsDelivr. The first run downloads the runtime and needs internet. Use a modern browser with WebAssembly and module-worker support. Google Fonts are optional; system fonts provide a fallback.
- The app itself does not send code, notes, answers or scores to Google Sheets or another collection service. The CDN and font provider receive ordinary asset requests. There are no analytics, accounts or embedded secrets in this package.
- The browser stores code, notes, predictions and progress locally. Storage can be cleared by private browsing, a device reset or browser settings. Export creates a JSON backup; import restores it on another device. Imported program tests must be run again. Avoid entering personal or sensitive information in a shared device's notebook.
- The app collects input values from the Inputs box, one per line. Python input prompts are omitted from captured output. Correct programs print the required lines before any extra feature output. Tests check those required lines and do not evaluate written explanations or added features.
- **Stop** terminates the worker. Runs stop automatically after eight seconds of execution; output is capped at 20,000 characters. If Python cannot load, students can download their `.py` code and use GLM Python Lab.
- This is a learning runner for small console programs, not an isolated service for running untrusted code. Arbitrary Python libraries and file uploads are outside the supported study workflow.

## Files and maintenance

`github-pages/` is the published site. `source/` contains the matching development layout, `package.json` and verification scripts. No build, package install, Apps Script deployment or server is required for GitHub Pages.

Edit `github-pages/assets/content.mjs` to change the lessons, practice starters, hints, model solutions and test cases. Edit `styles.css` for presentation. If changing tests or solutions, also update `source/dist` before rerunning verification. A better ongoing workflow is to keep `source/` as the development folder and copy its `dist` contents to the publishing root after testing.

To preview from source, serve `source/dist` over HTTP, for example with `python3 -m http.server 8000 --directory source/dist`, then open the local address. ES modules and workers should be served over HTTP rather than opening `index.html` directly as a file.

To verify, open a terminal in `source/` and run `npm test` with Node 18+ and Python 3 available (`PYTHON` can select the Python executable). No npm dependencies are needed. Tests execute all twelve expected model cases with real Python, confirm the broken starters raise syntax errors, check input exhaustion and runtime recovery, and verify answer/output comparisons and progress-file validation. The browser smoke test exercised actual Pyodide execution, errors, four-case feedback, saved-progress restoration after reload, Stop, runtime restart and progress export. The browser automation timed out when opening the import file chooser; import validation passed the automated checks, but file-picker import should be checked on a school device before sharing.

Official references: [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Pyodide in a Web Worker](https://pyodide.org/en/stable/usage/webworker.html), [Python tutorial](https://docs.python.org/3/tutorial/).
