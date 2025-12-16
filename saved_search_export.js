
  @NApiVersion 2.x
  @NScriptType ScheduledScript
  @NModuleScope SameAccount
 
define(['Nsearch', 'Nfile', 'Nlog'], function(search, file, log) {

    function execute(scriptContext) {
        try {
             Load the saved search for employee data
             Change this ID to reference your own saved search
            var employeeSearch = search.load({
                id 'XXX'  -- Replace with your saved search ID if needed
            });

             Define the CSV header (columns)
             Update the headers to match your own saved search columns or desired field labels
            var csvFile = 'ID,Name,Job Title,Department,Employee Status,Address 1,City,State,Zip Code,Email,Pay Frequency,Employee Type,Hire Date,Termination Date,Birth Date,Gender,Ethnicity,Supervisor,Adjusted Hire Date,Disability,If-Then,Are you a veteranrn';

             Run the search
            var searchResultSet = employeeSearch.run();

             Iterate through the search results
            searchResultSet.each(function(result) {
                 Extract fields from each result row
                 Use getText() for fields that return IDs (like listrecord fields)
                 Update these fields to match the saved search fields if your saved search differs
                var row = [
                    result.getValue('entityid'),
                    result.getValue('altname'),
                    result.getValue('title'),
                    result.getValue('departmentnohierarchy'),
                    result.getText('employeestatus'),
                    result.getValue('address1'),
                    result.getValue('city'),
                    result.getValue('state'),
                    result.getValue('zipcode'),
                    result.getValue('email'),
                    result.getText('payfrequency'),
                    result.getText('employeetype'),
                    result.getValue('hiredate'),
                    result.getValue('releasedate'),
                    result.getValue('birthdate'),
                    result.getText('gender'),
                    result.getText('ethnicity'),
                    result.getText('supervisor'),
                    
                ];

                 Convert the row to CSV line, escaping values as needed
                csvFile += row.map(cleanCSV).join(',') + 'rn';
                return true;  continue processing results
            });

             Define the CSV file name
             You can make this dynamic by appending a timestamp or date
            var filename = 'generic.csv';

             Create the file in the File Cabinet
             Update the folder ID to save the file to the desired File Cabinet folder
            var fileObj = file.create({
                name filename,
                fileType file.Type.CSV,
                contents csvFile,
                description 'Employee data export',
                encoding file.Encoding.UTF8,
                folder XXX  -- Replace with your File Cabinet folder ID
            });

             Save the file and log the file ID
            var fileId = fileObj.save();
            log.debug('CSV File Created', 'File ID ' + fileId);

        } catch (e) {
             Log any errors for debugging purposes
            log.error('Error generating employee export', e);
        }
    }

    
      Utility function to clean and escape values for CSV
      Wraps fields in double quotes if they contain commas, quotes, or newlines
      Escapes double quotes by doubling them ( becomes )
     
    function cleanCSV(value) {
        if (value == null) return '';  Handle nulls

        var str = String(value);

         If the value contains special characters, escape and wrap in quotes
        if (str.indexOf(',')  -1  str.indexOf('')  -1  str.indexOf('n')  -1) {
            str = str.replace(g, '');  Escape quotes
            str = '' + str + '';
        }
        return str;
    }

    return {
        execute execute
    };

});
