HSRC DOCUMENTS SYSTEM — FIXED INTEGRATION

Architecture
-------------
The Documents Manager is now integrated into the SAME Google Apps Script Web App
as the HSRC ID System. The Documents data still lives in its separate spreadsheet:

Spreadsheet ID:
"143oGCdRizf_rMIPpfyBibnvjN-FXjr-ruG8AlMeA"

The Documents files still live in the HSRC Documents Drive folder.

Why this fixes the JSON error
-----------------------------
The previous frontend versions pointed to different/stale Documents Web App URLs.
The main ID System Code.gs also did not have documents_list/documents_admin_* routes.
The fixed version adds those routes to the existing ID System backend and points
both index.html and admin.html to the same ID_SYSTEM_WEB_APP_URL.

Deployment
----------
1. Open the EXISTING Google Apps Script project that contains your MAIN/current Code.gs.
2. Replace its Code.gs with the Code.gs in this package.
3. Save.
4. Deploy > Manage deployments.
5. Edit the existing Web app deployment.
6. Execute as: Me.
7. Who has access: Anyone (or the same public setting your ID System currently uses).
8. Click Deploy / Update deployment.
9. Keep using the SAME Web App URL already used by the ID System:
   https://script.google.com/macros/s/AKfycbxxTJWUBOCvDzTeVYxh34NinD-HH2BQU9ckCD24BZ_V2twqKqaffGjQDagx-XZ9ypzA/exec

10. Replace your website index.html with the fixed index.html.
11. Replace your admin.html with the fixed admin.html.
12. Hard refresh the browser (Ctrl+F5).

Documents spreadsheet
---------------------
The backend automatically creates/uses a sheet named "Documents" and applies these
headers:
Document ID | Title | Description | Type | File Name | MIME Type | File ID |
File URL | Download URL | Size Bytes | Size | Created At | Updated At | Active

Admin key
---------
The Documents Manager uses the same admin key currently defined in the new Documents
backend: HSRC2026.

Important
---------
Do NOT deploy the old standalone Documents Code.gs as a second Web App for this setup.
Keep it only as a backup/reference. The fixed main Code.gs contains the Documents
functions and routes.

Test
----
1. Open the website and click Documents.
2. It should show "No documents available" if the Documents sheet is empty.
3. Open Admin > Documents.
4. Enter the admin key.
5. Add a PDF/Word/PowerPoint file <= 25 MB.
6. Confirm it appears in the Documents sheet and public Documents list.
7. Test Open and Download.
8. Test Edit and Delete.

Backup
------
Before replacing your Apps Script Code.gs, make a copy of your current production Code.gs.
