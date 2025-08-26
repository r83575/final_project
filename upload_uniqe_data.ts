import axios from 'axios';
import { upload_file } from './upload_file';

/**
 * Uploads a file only if it does not already exist on the server.
 * @param file_path Path to the file to upload
 * @param server_endpoint Server API endpoint for upload
 * @returns Promise<string> Success or error message
 */
export async function upload_unique_file(file_path: string, server_endpoint: string): Promise<string> {
	// בדיקה האם הקובץ כבר קיים בשרת
	try {
		const checkResponse = await axios.get(`${server_endpoint}/exists`, {
			params: { file_path }
		});
		if (checkResponse.data.exists) {
			return 'Error: File already exists on the server.';
		}
	} catch (err) {
		return 'Error: Failed to check file existence on server.';
	}

	// אם הקובץ לא קיים, נעלה אותו
	return await upload_file(file_path, server_endpoint);
}
