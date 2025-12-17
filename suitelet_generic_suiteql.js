/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/query'], function (ui, query) {

    function onRequest(context) {

        var request = context.request;
        var params = request.parameters;

        /* =========================================================
         * 1. FORM
         * ========================================================= */
        var form = ui.createForm({
            title: 'Generic SuiteQL Report'
        });

        /* =========================================================
         * 2. FILTER SECTION (CUSTOMIZE AS NEEDED)
         * ========================================================= */

        // Example filter: Date From
        var dateFromField = form.addField({
            id: 'custpage_datefrom',
            type: ui.FieldType.DATE,
            label: 'Date From'
        });

        // Example filter: Date To
        var dateToField = form.addField({
            id: 'custpage_dateto',
            type: ui.FieldType.DATE,
            label: 'Date To'
        });

        // Example filter: Generic Record Select
        var recordFilter = form.addField({
            id: 'custpage_record',
            type: ui.FieldType.SELECT,
            label: 'Record',
            source: 'item' // change source as needed
        });

        // Preserve filter values on refresh
        dateFromField.defaultValue = params.custpage_datefrom || '';
        dateToField.defaultValue   = params.custpage_dateto || '';
        recordFilter.defaultValue = params.custpage_record || '';

        /* =========================================================
         * 3. RESULTS SUBLIST (CUSTOMIZE COLUMNS)
         * ========================================================= */
        var sublist = form.addSublist({
            id: 'custpage_results',
            type: ui.SublistType.LIST,
            label: 'Results'
        });

        // Define columns (change freely)
        sublist.addField({ id: 'col1', label: 'Column 1', type: ui.FieldType.TEXT });
        sublist.addField({ id: 'col2', label: 'Column 2', type: ui.FieldType.TEXT });
        sublist.addField({ id: 'col3', label: 'Column 3', type: ui.FieldType.FLOAT });

        /* =========================================================
         * 4. BUILD WHERE CLAUSE (DYNAMIC)
         * ========================================================= */
        var conditions = [];
        var sqlParams = [];

        if (params.custpage_datefrom && params.custpage_dateto) {
            conditions.push('t.createddate BETWEEN ? AND ?');
            sqlParams.push(params.custpage_datefrom);
            sqlParams.push(params.custpage_dateto);
        }

        if (params.custpage_record) {
            conditions.push('t.id = ?');
            sqlParams.push(params.custpage_record);
        }

        var whereClause = conditions.length
            ? 'WHERE ' + conditions.join(' AND ')
            : '';

        /* =========================================================
         * 5. SUITEQL QUERY (REPLACE FOR EACH USE CASE)
         * ========================================================= */
        var sql = `
            SELECT
                t.id        AS col1,
                t.tranid    AS col2,
                t.amount   AS col3
            FROM transaction t
            ${whereClause}
            ORDER BY t.id
        `;

        /* =========================================================
         * 6. RUN QUERY
         * ========================================================= */
        var results = [];

        try {
            results = query.runSuiteQL({
                query: sql,
                params: sqlParams
            }).asMappedResults();
        } catch (e) {
            form.addField({
                id: 'custpage_error',
                type: ui.FieldType.INLINEHTML,
                label: ' '
            }).defaultValue =
                '<div style="color:red;">Error running query: ' + e.message + '</div>';
        }

        /* =========================================================
         * 7. POPULATE SUBLIST
         * ========================================================= */
        results.forEach(function (row, index) {

            if (row.col1 !== undefined) {
                sublist.setSublistValue({
                    id: 'col1',
                    line: index,
                    value: String(row.col1)
                });
            }

            if (row.col2 !== undefined) {
                sublist.setSublistValue({
                    id: 'col2',
                    line: index,
                    value: String(row.col2)
                });
            }

            if (row.col3 !== undefined) {
                sublist.setSublistValue({
                    id: 'col3',
                    line: index,
                    value: String(row.col3)
                });
            }
        });

        /* =========================================================
         * 8. ACTIONS
         * ========================================================= */
        form.addSubmitButton({
            label: 'Apply Filters'
        });

        context.response.writePage(form);
    }

    return {
        onRequest: onRequest
    };
});
