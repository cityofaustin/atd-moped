import {
  Grid,
  TextField,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Switch,
} from "@mui/material";
import FileUpload from "src/components/FileUpload/FileUpload";

/**
 * Form for uploading a single file to S3 and saving the file metadata to the database
 * @param {number} projectId - integer representing the project id. This is used to generate the S3 presigned URL for file upload
 * @param {Object[]} fileTypesLookup - array of file types lookup options
 * @param {string} fileType- Contains an integer representing file type (see moped_file_types DB table)
 * @param {bool} externalFile - True if user toggled external file switch
 * @param {function} handleFileNameChange - onChange handler for file name text field
 * @param {function} handleFileDescriptionChange - onChange handler for file description text field
 * @param {function} handleFileTypeChange - onChange handler for file type select
 * @param {function} handleExternalLinkChange - onChange handler for external file link text field
 * @param {function} handleToggleChange - onChange handler for external file toggle switch
 * @param {function} handleOnFileProcessed - callback for when a file has been processed
 * @param {function} handleOnFileAdded - callback for when a file has been added
 *
 * @returns {JSX.Element}
 */
const FileUploadSingle = ({
  projectId,
  fileTypesLookup,
  fileType,
  externalFile,
  handleFileNameChange,
  handleFileDescriptionChange,
  handleFileTypeChange,
  handleExternalLinkChange,
  handleToggleChange,
  handleOnFileProcessed,
  handleOnFileAdded,
}) => {
  return (
    <Grid container style={{ marginTop: "5px" }}>
      <Grid
        size={{
          xs: 12,
          md: 12,
        }}
      >
        <TextField
          autoFocus
          sx={(theme) => ({
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
          })}
          id="file-name-input"
          multiline={false}
          label={"File name"}
          value={undefined}
          onChange={handleFileNameChange}
          fullWidth
          helperText={"Required"}
        />

        <FormControl>
          <InputLabel id="select-dropdown-filetype">Type</InputLabel>
          <Select
            labelId="select-dropdown-filetype"
            sx={(theme) => ({ width: theme.spacing(25) })}
            value={fileType}
            label="Type"
            onChange={handleFileTypeChange}
          >
            {fileTypesLookup.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Required</FormHelperText>
        </FormControl>

        <TextField
          sx={(theme) => ({
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
          })}
          id="standard-multiline-static"
          label={"Description"}
          multiline
          rows={4}
          defaultValue={null}
          onChange={handleFileDescriptionChange}
          fullWidth
        />

        <FormControl>
          <FormControlLabel
            value="external"
            control={
              <Switch
                color="primary"
                checked={externalFile}
                onChange={handleToggleChange}
              />
            }
            label="Link to file"
            labelPlacement="start"
          />
        </FormControl>
      </Grid>
      <Grid
        sx={(theme) => ({ marginTop: theme.spacing(2) })}
        size={{
          xs: 12,
          md: 12,
        }}
      >
        {externalFile ? (
          <TextField
            autoFocus
            id="file-name-input"
            multiline={false}
            label={"Link"}
            value={undefined}
            onChange={handleExternalLinkChange}
            fullWidth
            helperText={"Required. Enter URL or network location"}
          />
        ) : (
          <FileUpload
            limit={1}
            sizeLimit={"1024MB"}
            projectId={projectId}
            onFileProcessed={handleOnFileProcessed}
            onFileAdded={handleOnFileAdded}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default FileUploadSingle;
