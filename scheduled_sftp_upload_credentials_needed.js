/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/sftp', 'N/file', 'N/log', 'N/search'], (sftp, file, log, search) => {

  const CREDENTIAL_GUID = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Replace with your actual credential GUID
  const HOST_KEY = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQ...'; // Replace with your actual SFTP host key
  const FILE_NAME = 'data_export.csv'; // Replace with the name of the file you're exporting

  function execute(context) {
    try {
      // 1. Search for the file by name in the File Cabinet
      const myFile = findFileByName(FILE_NAME);
      if (!myFile) {
        log.error('File Not Found', `Could not find file: ${FILE_NAME}`);
        return;
      }

      const fileObj = file.load({ id: myFile.id });
      log.debug('File Loaded', fileObj.name);

      // 2. Establish SFTP connection
      const connection = sftp.createConnection({
        username: 'your_sftp_username', // Replace with your SFTP username
        passwordGuid: CREDENTIAL_GUID,
        url: 'sftp.example.com', // Replace with your SFTP server address
        directory: 'inbound_folder', // Replace with your target SFTP directory
        hostKey: HOST_KEY
      });

      log.debug('SFTP Connection Established', 'Connection to SFTP server successful.');

      // 3. Generate a unique filename with timestamp if needed
      const timestamp = new Date().toISOString().replace(/[:\-T]/g, '').split('.')[0];
      const remoteFilename = `data_export_${timestamp}.csv`;

      // 4. Upload the file to the SFTP server
      connection.upload({
        filename: remoteFilename,
        file: fileObj,
        replaceExisting: true
      });

      log.audit('Upload Complete', `File ${remoteFilename} uploaded successfully.`);

    } catch (e) {
      log.error('Upload Failed', JSON.stringify(e));
    }
  }

  /**
   * Utility function: find a file in the File Cabinet by name
   */
  function findFileByName(fileName) {
    const fileSearch = search.create({
      type: 'file',
      filters: [['name', 'is', fileName]],
      columns: ['internalid', 'name']
    });

    const result = fileSearch.run().getRange({ start: 0, end: 1 });
    return result.length ? {
      id: result[0].getValue('internalid'),
      name: result[0].getValue('name')
    } : null;
  }

  return { execute };
});
