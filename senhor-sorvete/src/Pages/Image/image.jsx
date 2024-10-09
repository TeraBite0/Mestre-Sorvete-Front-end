import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const Image = () => {
    const [file, setFile] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };
    
      const handleUpload = () => {
        if (!file) {
            alert("Arquivo vazio ou inválido!")
          return;
        }
        alert("Arquivo " + file.name + " OK");
        
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