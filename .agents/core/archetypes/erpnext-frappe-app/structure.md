# Recommended Structure — ERPNext / Frappe App

This is a recommendation for new custom apps or major reorganizations, not a
requirement. Do not blindly restructure an existing Frappe app that already
follows a working layout from an earlier framework version — this is a
high-level shape, not a strict template to force onto legacy code.

```text
<app_name>/
  <app_name>/                 # the installable Python package
    hooks.py                  # integration points registered with Frappe
    modules.txt                # list of modules this app owns
    patches.txt                 # ordered list of one-way migrations
    <module_name>/
      doctype/
        <doctype_name>/
          <doctype_name>.json  # schema definition
          <doctype_name>.py    # server-side controller logic
          test_<doctype_name>.py
      report/
      page/
    fixtures/                  # exported, version-controlled config data
    public/                    # static assets served by the app
  requirements.txt
docs/
features/                      # UTE feature folders (see feature-plan)
```

## Notes

- One module directory per logical domain area of the app; don't dump every
  DocType into a single module once the app grows past a handful of them.
- `fixtures/` should only contain data meant to be shipped with the app and
  reviewed like code — not a dump of whatever a developer's local site
  happens to contain.
- A small app with one module can collapse the module nesting — don't force
  multiple module directories where one clearly covers the whole app.
