HSRC DOCUMENTS ADMIN-MANAGED v8

This package contains the updated frontend files and the MERGED Code.gs.
The Documents backend is already integrated into Code.gs; do NOT paste a separate addon.

FILES
- index.html: public portal with Documents button/list/view/download
- admin.html: Admin Documents Manager (add, edit, replace, delete)
- Code.gs: existing HSRC backend plus Documents Manager actions

DEPLOYMENT
1. Open the Apps Script project currently used by your HSRC Web App.
2. Replace its Code.gs contents with the Code.gs in this package (keep a backup first).
3. Save.
4. Deploy > Manage deployments > Edit the Web App deployment.
5. Create a new version and Deploy.
6. Make sure the Web App is still accessible to the same users as before.
7. Use the same Web App URL already configured in admin.html/index.html.

DOCUMENT STORAGE
The first time a document is uploaded, Apps Script creates/uses a Drive folder named "HSRC Documents".
Document metadata is stored in Script Properties, while the actual files are stored in Drive.

LIMIT
Frontend/backend limit is 25 MB per document.

IMPORTANT
The Documents actions use the existing ADMIN_KEY from Code.gs.
The public list uses GET?action=documents_list.
Admin actions use POST with actions:
- documents_admin_list
- documents_admin_add
- documents_admin_update
- documents_admin_delete
