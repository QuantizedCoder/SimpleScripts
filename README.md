# SimpleScripts

A collection of lightweight, purpose-built scripts designed to streamline everyday development tasks, automate routine processes, and demonstrate key coding concepts. This repository serves as a modular toolbox for quick solutions, learning references, and customizable starter templates.

## Included scripts

### `saved_search_export.js`
A Scheduled Script template for exporting employee data from a NetSuite saved search to a CSV file in the File Cabinet. Update the script with your saved search ID, folder destination, and field mappings. The example includes CSV header construction, row iteration, and value cleaning for safe CSV output.

### `scheduled_sftp_upload_credentials_needed.js`
A NetSuite Scheduled Script that uploads a File Cabinet CSV to an SFTP server using a stored credential GUID and host key. It looks up the file by name, establishes an SFTP connection, timestamps the uploaded filename, and handles logging for success or failure. Replace the placeholder credential GUID, host key, SFTP server details, and target file name before deployment.

### `suitelet_store_credentials.js`
A NetSuite Suitelet that presents a form to generate and store an SFTP credential. It restricts the credential to specific domains and script IDs, then displays the generated credential GUID after submission. Customize the allowed domain and script IDs to match your environment.

### `suitelet_generic_suiteql.js`
A NetSuite Suitelet template that renders a SuiteQL-driven report with customizable filters, query columns, and WHERE clauses. It includes starter filters (date range and record selector), builds the query dynamically based on provided parameters, and displays results in a sublist. Replace the sample SELECT statement, filters, and sublist columns to fit your reporting use case.

## Getting started

1. Download or clone the repository.
2. Open the script you want to use and replace placeholder values (saved search IDs, folder IDs, credential GUIDs, host keys, SFTP settings, and allowed domains/script IDs) with values from your NetSuite account.
3. Deploy the script in NetSuite as the indicated script type (Scheduled Script or Suitelet) and test in a sandbox before production use.

> These examples are starting points; review and adjust them to match your account-specific requirements and governance constraints.
