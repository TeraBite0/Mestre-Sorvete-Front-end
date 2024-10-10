import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const { BlobServiceClient, generateBlobSASQueryParameters, ContainerSASPermissions } = require("@azure/storage-blob");


const accountName = "terabite";
const containerName = "terabite-container";
const sasToken = "sv=2021w&sig=dN0fIr0ci2FaEL0Jq1T6n4jq4YOPAGvYupNrPGI0g1Q%3D";

const Image = () => {
    const [file, setFile] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Arquivo vazio ou inválido!")
            return;
        }

        const blobServiceClient = new BlobServiceClient("https://" + accountName + ".blob.core.windows.net/?" + sasToken);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        //const blobName = `${produto.id}.${file.name.split('.').pop()}`; lógica verdadeira
        const blobName = `1245.${file.name.split('.').pop()}`; // MOCKADO

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        try {
            const uploadBlobResponse = await blockBlobClient.uploadBrowserData(file);
            alert(`Upload concluído: ${uploadBlobResponse.requestId}`);
            console.log("Arquivo " + file.name + " OK");

            console.log(uploadBlobResponse);
        } catch (error) {
            console.error("Erro ao fazer upload:", error.message);
        }

        setFile(null);
    };


    return <>

        <h1>Teste de upload de imagem Azure</h1>
        <hr></hr>
        <br></br>
        <input type="file" onChange={handleFileChange}>
        </input>
        <br></br>
        <button onClick={handleUpload}>Upload</button>

    </>
}


export default Image;