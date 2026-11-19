/**
 * filepond-plugin-image-preview doesn't ship types like the other FilePond plugins we use.
 * The default export is the plugin function that we pass to react-filepond's registerPlugin
 * @see https://github.com/pqina/filepond-plugin-image-preview
 */
declare module "filepond-plugin-image-preview" {
  const FilePondPluginImagePreview: (fpAPI: unknown) => unknown;
  export default FilePondPluginImagePreview;
}
