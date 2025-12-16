/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/log'], (ui, log) => {
  function onRequest(context) {
    if (context.request.method === 'GET') {
      // Create a form with a credential field to store an SFTP password
      const form = ui.createForm({ title: 'Register SFTP Credential' });

      form.addCredentialField({
        id: 'custpage_sftp_pwd',
        label: 'Enter SFTP Password',
        restrictToDomains: ['sftp.example.com'], // <-- replace with your target SFTP domain
        restrictToScriptIds: ['customscript_sftp_upload_handler'], // <-- replace with your actual script ID
        restrictToCurrentUser: false
      });

      form.addSubmitButton({ label: 'Generate Token' });
      context.response.writePage(form);

    } else {
      // Handle POST request: display the generated credential GUID
      const guid = context.request.parameters.custpage_sftp_pwd;
      log.audit('SFTP Password GUID Created', guid);
      context.response.write('Copy this password GUID:\n' + guid);
    }
  }

  return { onRequest };
});
